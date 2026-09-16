import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BlochSphereProps {
  theta: number; // in radians [0, pi]
  phi: number; // in radians [0, 2*pi)
  r?: number; // radius <= 1 (default: 1)
  onAngleChange?: (theta: number, phi: number) => void;
  interactive?: boolean;
  size?: number;
  label?: string;
  purity?: number;
}

export const BlochSphere3D: React.FC<BlochSphereProps> = ({
  theta,
  phi,
  r = 1.0,
  onAngleChange: _onAngleChange,
  interactive: _interactive = true,
  size = 380,
  label,
  purity,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup with Z-up (Standard Quantum Physics Convention)
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.up.set(0, 0, 1);
    camera.position.set(2.4, -2.8, 1.8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.replaceChildren(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffdf8, 0.7);
    dirLight.position.set(5, -5, 8);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xe4ece6, 0.4);
    dirLight2.position.set(-5, 5, -5);
    scene.add(dirLight2);

    // 1. Semi-transparent Bloch Sphere Surface
    const sphereRadius = 1.0;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 48, 48);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f3ea,
      transparent: true,
      opacity: 0.38,
      roughness: 0.3,
      metalness: 0.05,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      depthWrite: false,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    // 2. Equator ring (XY plane at Z=0)
    const equatorCurve = new THREE.EllipseCurve(0, 0, sphereRadius, sphereRadius, 0, 2 * Math.PI, false, 0);
    const equatorPoints = equatorCurve.getPoints(64).map(p => new THREE.Vector3(p.x, p.y, 0));
    const equatorGeo = new THREE.BufferGeometry().setFromPoints(equatorPoints);
    const equatorMat = new THREE.LineDashedMaterial({
      color: 0xa09e94,
      dashSize: 0.05,
      gapSize: 0.03,
      linewidth: 1,
    });
    const equatorLine = new THREE.Line(equatorGeo, equatorMat);
    equatorLine.computeLineDistances();
    scene.add(equatorLine);

    // 3. Meridian rings (XZ and YZ planes)
    const meridianPointsXZ = equatorCurve.getPoints(64).map(p => new THREE.Vector3(p.x, 0, p.y));
    const meridianGeoXZ = new THREE.BufferGeometry().setFromPoints(meridianPointsXZ);
    const meridianMat = new THREE.LineDashedMaterial({
      color: 0xb5b3a8,
      dashSize: 0.03,
      gapSize: 0.04,
      linewidth: 1,
    });
    const meridianLineXZ = new THREE.Line(meridianGeoXZ, meridianMat);
    meridianLineXZ.computeLineDistances();
    scene.add(meridianLineXZ);

    const meridianPointsYZ = equatorCurve.getPoints(64).map(p => new THREE.Vector3(0, p.x, p.y));
    const meridianGeoYZ = new THREE.BufferGeometry().setFromPoints(meridianPointsYZ);
    const meridianLineYZ = new THREE.Line(meridianGeoYZ, meridianMat);
    meridianLineYZ.computeLineDistances();
    scene.add(meridianLineYZ);

    // 4. Coordinate Axes Lines (-1.2 to +1.2)
    const axisMat = new THREE.LineBasicMaterial({ color: 0x48524e, linewidth: 1.5 });

    // Z Axis
    const zAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -1.25),
      new THREE.Vector3(0, 0, 1.25),
    ]);
    scene.add(new THREE.Line(zAxisGeo, axisMat));

    // X Axis
    const xAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.25, 0, 0),
      new THREE.Vector3(1.25, 0, 0),
    ]);
    scene.add(new THREE.Line(xAxisGeo, axisMat));

    // Y Axis
    const yAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1.25, 0),
      new THREE.Vector3(0, 1.25, 0),
    ]);
    scene.add(new THREE.Line(yAxisGeo, axisMat));

    // 5. Canvas Text Labels via Sprites
    const createTextSprite = (text: string, fontSize: number = 44, color: string = '#17211D', isBold: boolean = true) => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = color;
        ctx.font = `${isBold ? 'bold ' : ''}${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 80, 40);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.38, 0.19, 1);
      return sprite;
    };

    // Z Pole Labels: |0> at top, |1> at bottom
    const label0 = createTextSprite('|0⟩', 52, '#17211D');
    label0.position.set(0, 0, 1.48);
    scene.add(label0);

    const labelZ = createTextSprite('z', 40, '#48524E', false);
    labelZ.position.set(0.12, 0, 1.28);
    scene.add(labelZ);

    const label1 = createTextSprite('|1⟩', 52, '#17211D');
    label1.position.set(0, 0, -1.48);
    scene.add(label1);

    const labelX = createTextSprite('x', 44, '#17211D');
    labelX.position.set(1.4, 0, 0);
    scene.add(labelX);

    const labelY = createTextSprite('y', 44, '#17211D');
    labelY.position.set(0, 1.4, 0);
    scene.add(labelY);

    // 6. State Vector Arrow (Terracotta / Red Accent)
    const effectiveR = Math.max(0.01, Math.min(1.0, r));
    const targetX = effectiveR * Math.sin(theta) * Math.cos(phi);
    const targetY = effectiveR * Math.sin(theta) * Math.sin(phi);
    const targetZ = effectiveR * Math.cos(theta);
    const targetVec = new THREE.Vector3(targetX, targetY, targetZ);

    // Arrow line
    const arrowMat = new THREE.LineBasicMaterial({ color: 0xb65331, linewidth: 3 });
    const arrowGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), targetVec]);
    const arrowLine = new THREE.Line(arrowGeo, arrowMat);
    scene.add(arrowLine);

    // State Point Sphere at endpoint
    const ptRadius = 0.052;
    const ptGeo = new THREE.SphereGeometry(ptRadius, 32, 32);
    const ptMat = new THREE.MeshStandardMaterial({
      color: 0xb65331,
      roughness: 0.2,
      metalness: 0.1,
    });
    const ptMesh = new THREE.Mesh(ptGeo, ptMat);
    ptMesh.position.copy(targetVec);
    scene.add(ptMesh);

    // Projection dashed line from tip to XY plane
    const projMat = new THREE.LineDashedMaterial({
      color: 0x9c8b82,
      dashSize: 0.04,
      gapSize: 0.03,
      linewidth: 1.5,
    });
    const projGeo = new THREE.BufferGeometry().setFromPoints([
      targetVec,
      new THREE.Vector3(targetX, targetY, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const projLine = new THREE.Line(projGeo, projMat);
    projLine.computeLineDistances();
    scene.add(projLine);

    // Theta arc (Green arc from +Z axis to state vector)
    if (theta > 0.05) {
      const arcPoints: THREE.Vector3[] = [];
      const numSegments = 24;
      const arcRadius = 0.45;
      for (let i = 0; i <= numSegments; i++) {
        const t = (i / numSegments) * theta;
        const ax = arcRadius * Math.sin(t) * Math.cos(phi);
        const ay = arcRadius * Math.sin(t) * Math.sin(phi);
        const az = arcRadius * Math.cos(t);
        arcPoints.push(new THREE.Vector3(ax, ay, az));
      }
      const thetaArcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const thetaArcMat = new THREE.LineBasicMaterial({ color: 0x2f5d50, linewidth: 2 });
      scene.add(new THREE.Line(thetaArcGeo, thetaArcMat));

      // Theta label
      const midT = theta / 2;
      const thetaLabel = createTextSprite('θ', 36, '#2F5D50');
      thetaLabel.position.set(
        0.58 * Math.sin(midT) * Math.cos(phi),
        0.58 * Math.sin(midT) * Math.sin(phi),
        0.58 * Math.cos(midT)
      );
      scene.add(thetaLabel);
    }

    // Phi arc (Brown/terracotta arc on the XY plane from +X to projection)
    if (phi > 0.08 && Math.sin(theta) > 0.1) {
      const phiPoints: THREE.Vector3[] = [];
      const numSegments = 24;
      const phiRadius = 0.4;
      for (let i = 0; i <= numSegments; i++) {
        const p = (i / numSegments) * phi;
        phiPoints.push(new THREE.Vector3(phiRadius * Math.cos(p), phiRadius * Math.sin(p), 0));
      }
      const phiArcGeo = new THREE.BufferGeometry().setFromPoints(phiPoints);
      const phiArcMat = new THREE.LineBasicMaterial({ color: 0xb65331, linewidth: 2 });
      scene.add(new THREE.Line(phiArcGeo, phiArcMat));

      // Phi label
      const midP = phi / 2;
      const phiLabel = createTextSprite('φ', 36, '#B65331');
      phiLabel.position.set(0.52 * Math.cos(midP), 0.52 * Math.sin(midP), 0);
      scene.add(phiLabel);
    }

    // Interactive Orbit Controls (Mouse Drag & Wheel Zoom)
    let spherical = {
      radius: 4.2,
      theta: Math.atan2(camera.position.y, camera.position.x), // azimuthal
      phi: Math.acos(camera.position.z / 4.2), // polar
    };

    const updateCamera = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.position.y = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.z = spherical.radius * Math.cos(spherical.phi);
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    const dom = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      spherical.theta -= deltaX * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - deltaY * 0.01));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      updateCamera();
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(2.0, Math.min(8.0, spherical.radius + e.deltaY * 0.003));
      updateCamera();
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [theta, phi, r, size]);

  return (
    <div className="flex flex-col items-center select-none">
      {label && (
        <div className="flex items-center justify-between w-full px-3 py-1 mb-1 text-xs font-medium text-dark-text border-b border-border/60">
          <span>{label}</span>
          {purity !== undefined && (
            <span
              className={`px-2 py-0.5 rounded text-[11px] ${
                purity < 0.95 ? 'bg-soft-warm text-warm-accent font-semibold' : 'bg-soft-green text-primary-green'
              }`}
            >
              {purity < 0.95 ? `Mixed (r = ${(r || 0).toFixed(2)})` : 'Pure (r = 1.0)'}
            </span>
          )}
        </div>
      )}
      <div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing relative flex items-center justify-center rounded-lg overflow-hidden"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

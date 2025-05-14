
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function PanoramaViewer({ panoramaUrl, children, onRender, onCameraMount }) {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  let camera, scene, renderer;
  let isUserInteracting = false;
  let onPointerDownMouseX = 0, onPointerDownMouseY = 0;
  let lon = 0, onPointerDownLon = 0;
  let lat = 0, onPointerDownLat = 0;
  let phi = 0, theta = 0;

  useEffect(() => {
    if (!containerRef.current) return;

    const init = () => {
      const container = containerRef.current;

      camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1100);
      if (onCameraMount) {
        onCameraMount(camera);
      }
      
      scene = new THREE.Scene();

      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);

      const texture = new THREE.TextureLoader().load(panoramaUrl, () => setIsReady(true));
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      container.addEventListener('mousedown', onPointerDown);
      container.addEventListener('mousemove', onPointerMove);
      container.addEventListener('mouseup', onPointerUp);
      container.addEventListener('wheel', onDocumentMouseWheel);
      container.addEventListener('touchstart', onPointerDown);
      container.addEventListener('touchmove', onPointerMove);
      container.addEventListener('touchend', onPointerUp);

      window.addEventListener('resize', onWindowResize);
    };

    const onWindowResize = () => {
      const container = containerRef.current;
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const onPointerDown = (event) => {
      isUserInteracting = true;

      const clientX = event.clientX ?? event.touches[0].clientX;
      const clientY = event.clientY ?? event.touches[0].clientY;

      onPointerDownMouseX = clientX;
      onPointerDownMouseY = clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    const onPointerMove = (event) => {
      if (!isUserInteracting) return;

      const clientX = event.clientX ?? event.touches[0].clientX;
      const clientY = event.clientY ?? event.touches[0].clientY;

      lon = (onPointerDownMouseX - clientX) * 0.1 + onPointerDownLon;
      lat = (clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
    };

    const onPointerUp = () => {
      isUserInteracting = false;
    };

    const onDocumentMouseWheel = (event) => {
      const fov = camera.fov + event.deltaY * 0.05;
      camera.fov = THREE.MathUtils.clamp(fov, 30, 90);
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      requestAnimationFrame(animate);

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
      camera.position.y = 100 * Math.cos(phi);
      camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(scene.position);
      renderer.render(scene, camera);

      if (onRender) {
        onRender(camera, renderer);
      }
    };

    init();
    animate();

    return () => {
      const container = containerRef.current;
      if (container) {
        container.removeEventListener('mousedown', onPointerDown);
        container.removeEventListener('mousemove', onPointerMove);
        container.removeEventListener('mouseup', onPointerUp);
        container.removeEventListener('wheel', onDocumentMouseWheel);
        container.removeEventListener('touchstart', onPointerDown);
        container.removeEventListener('touchmove', onPointerMove);
        container.removeEventListener('touchend', onPointerUp);
      }
      window.removeEventListener('resize', onWindowResize);
      
      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, [panoramaUrl]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isReady && children}
    </div>
  );
}

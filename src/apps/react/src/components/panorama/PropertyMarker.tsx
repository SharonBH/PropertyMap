import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function PropertyMarker({ position, onClick, isActive }) {
  const markerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [screenPosition, setScreenPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const marker = document.createElement('div');
    marker.className = `absolute pointer-events-auto cursor-pointer transition-all duration-300 
      ${isActive ? 'scale-125' : 'scale-100'} 
      ${isVisible ? 'opacity-100' : 'opacity-0'}`;
    markerRef.current = marker;
    
    return () => {
      marker.remove();
    };
  }, [isActive]);

  const updatePosition = (camera, renderer) => {
    if (!markerRef.current) return;

    const vector = new THREE.Vector3(position.x, position.y, position.z);
    vector.project(camera);

    const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
    const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

    if (vector.z > 1) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
      setScreenPosition({ x, y });
    }
  };

  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.style.transform = `translate(${screenPosition.x}px, ${screenPosition.y}px)`;
  }, [screenPosition]);

  return (
    <div
      ref={markerRef}
      onClick={onClick}
      className={`absolute -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg
        ${isActive ? 'ring-4 ring-blue-500 z-50' : 'hover:ring-2 ring-blue-300'}
        ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      <div className="w-3 h-3 bg-blue-500 rounded-full" />
    </div>
  );
}
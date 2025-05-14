import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import PanoramaViewer from '../components/panorama/PanoramaViewer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CopyCheck, Info } from 'lucide-react';

export default function MarkerPositionerPage() {
  const [position, setPosition] = useState({ x: 0, y: 0, z: -300 });
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const markerRef = useRef(null);

  const panoramaUrl = "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=2000&q=80";

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !markerRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to normalized device coordinates (-1 to +1)
    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = -(y / rect.height) * 2 + 1;

    // Create a ray from the camera position
    const vector = new THREE.Vector3(normalizedX, normalizedY, 0.5);
    vector.unproject(window.camera);
    vector.sub(window.camera.position).normalize();

    // Calculate the intersection point with a sphere of radius 300
    const radius = 300;
    const a = vector.dot(vector);
    const b = 2 * vector.dot(window.camera.position);
    const c = window.camera.position.dot(window.camera.position) - radius * radius;
    const discriminant = b * b - 4 * a * c;

    if (discriminant >= 0) {
      const distance = (-b - Math.sqrt(discriminant)) / (2 * a);
      const intersection = window.camera.position.clone().add(vector.multiplyScalar(distance));
      
      setPosition({
        x: Math.round(intersection.x),
        y: Math.round(intersection.y),
        z: Math.round(intersection.z)
      });
    }
  };

  const copyToClipboard = () => {
    const positionString = JSON.stringify(position);
    navigator.clipboard.writeText(positionString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateMarkerPosition = (camera, renderer) => {
    if (!markerRef.current) return;

    const vector = new THREE.Vector3(position.x, position.y, position.z);
    vector.project(camera);
    
    const widthHalf = renderer.domElement.clientWidth / 2;
    const heightHalf = renderer.domElement.clientHeight / 2;
    
    const x = (vector.x * widthHalf) + widthHalf;
    const y = -(vector.y * heightHalf) + heightHalf;
    
    if (vector.z < 1) {
      markerRef.current.style.visibility = 'visible';
      markerRef.current.style.left = `${x}px`;
      markerRef.current.style.top = `${y}px`;
    } else {
      markerRef.current.style.visibility = 'hidden';
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row" dir="rtl">
      {/* Panorama View */}
      <div className="relative h-[60vh] md:h-screen md:flex-1">
        <PanoramaViewer 
          panoramaUrl={panoramaUrl}
          onRender={updateMarkerPosition}
          onCameraMount={(camera) => { window.camera = camera; }}
        >
          <div 
            className="absolute top-0 left-0 w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div
              ref={markerRef}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move"
            >
              <div className="bg-white rounded-full p-2 shadow-lg ring-2 ring-blue-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>
        </PanoramaViewer>

        {/* Instructions Overlay */}
        <Card className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="w-5 h-5" />
              ממשק מיקום סמנים
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-600 mb-4">
              גרור את הסמן למיקום הרצוי על הספירה הפנורמית.
              העתק את הקואורדינטות לשימוש בהגדרות הנכס.
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-sm font-medium">X</label>
                  <Input 
                    value={position.x} 
                    onChange={(e) => setPosition(prev => ({ ...prev, x: Number(e.target.value) }))}
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Y</label>
                  <Input 
                    value={position.y} 
                    onChange={(e) => setPosition(prev => ({ ...prev, y: Number(e.target.value) }))}
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Z</label>
                  <Input 
                    value={position.z} 
                    onChange={(e) => setPosition(prev => ({ ...prev, z: Number(e.target.value) }))}
                    type="number"
                  />
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <CopyCheck className="w-4 h-4 ml-2" />
                    הועתק!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 ml-2" />
                    העתק קואורדינטות
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
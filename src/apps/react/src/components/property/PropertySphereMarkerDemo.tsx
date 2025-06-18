import React, { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

interface PropertySphereMarkerDemoProps {
  panoramaUrl: string;
  yaw: number;
  pitch: number;
}

interface MinimalMarkersPlugin {
  addMarker: (marker: Record<string, unknown>) => void;
}

const PropertySphereMarkerDemo: React.FC<PropertySphereMarkerDemoProps> = ({ panoramaUrl, yaw, pitch }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Clear container before loading
    container.innerHTML = '';

    // Add error handler for image loading
    const handleError = (e: Event) => {
      console.error('[PropertySphereMarkerDemo] Error loading panorama image:', panoramaUrl, e);
      container.innerHTML = '<div style="color:red;padding:2rem;">Failed to load panorama image.<br>' + panoramaUrl + '</div>';
    };

    // Preload the image to check if it's valid
    const img = new window.Image();
    img.src = panoramaUrl;
    img.onerror = handleError;
    img.onload = () => {
      // Extra debug log
      console.log('[PropertySphereMarkerDemo] Image loaded, initializing viewer:', panoramaUrl);
      // Remove any previous viewer DOM nodes
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      setTimeout(() => {
        const viewer = new Viewer({
          container: container,
          panorama: panoramaUrl,
          defaultYaw: yaw,
          defaultPitch: pitch,
          navbar: ['zoom', 'fullscreen'],
          plugins: [[MarkersPlugin, {}]],
        });

        const markersPlugin = viewer.getPlugin(MarkersPlugin) as unknown as MinimalMarkersPlugin;
        markersPlugin.addMarker({
          id: "test-marker",
          position: { yaw, pitch },
          html: `<div class='demo-marker'></div>`,
          anchor: "bottom center",
          tooltip: "Test Marker"
        });
      }, 0);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
      container.innerHTML = '';
    };
  }, [panoramaUrl, yaw, pitch]);

  return (
    console.log("Rendering PropertySphereMarkerDemo with panoramaUrl:", panoramaUrl),
    <div className="property-sphere-demo-container">
      <div ref={containerRef} className="property-sphere-demo-viewer" />
    </div>
  );
};

export default PropertySphereMarkerDemo;

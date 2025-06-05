
import { useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { NeighborhoodResponse } from "@/api/homemapapi";

interface UseViewerInitializerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  neighborhood: NeighborhoodResponse;
  onViewerReady: (viewer: Viewer, markersPlugin: MarkersPlugin) => void;
}

export function useViewerInitializer({
  containerRef,
  neighborhood,
  onViewerReady
}: UseViewerInitializerProps) {
  const sphereViewer = useRef<Viewer | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  // Track the neighborhood ID to know when to recreate the viewer
  const prevNeighborhoodIdRef = useRef<string | null>(null);
  // Track whether we've already set up the viewer for this instance
  const viewerInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !neighborhood) return;

    // Only recreate the viewer if the neighborhood has changed or we haven't created one yet
    if (sphereViewer.current && prevNeighborhoodIdRef.current === neighborhood.id) {
      // If the viewer is already created for this neighborhood, just ensure the callback is called
      if (viewerReady && !viewerInitialized.current) {
        const markers = sphereViewer.current.getPlugin(MarkersPlugin) as MarkersPlugin;
        if (markers) {
          onViewerReady(sphereViewer.current, markers);
          viewerInitialized.current = true;
        }
      }
      return;
    }

    // Clean up previous viewer if it exists
    if (sphereViewer.current) {
      console.log("Destroying previous viewer");
      sphereViewer.current.destroy();
      viewerInitialized.current = false;
      setViewerReady(false);
    }

    console.log(`Creating new viewer for ${neighborhood.name}`);
    
    const panoramaUrls: Record<string, string> = {
      n1: "/assets/16.jpg",
      n2: "https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg",
      n3: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
      n4: "https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg",
      n5: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
      n6: "https://photo-sphere-viewer-data.netlify.app/assets/sphere-small.jpg",
      n7: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
    };

    const panoramaUrl = panoramaUrls[neighborhood.id] || 
      "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg";

    try {
      // Create a new viewer with the markers plugin directly in the plugins array
      const viewer = new Viewer({
        container: containerRef.current,
        panorama: panoramaUrl,
        caption: `Click anywhere to position the marker in ${neighborhood.name}`,
        navbar: ['zoom', 'fullscreen'],
        defaultYaw: 0,
        defaultPitch: 0,
        plugins: [
          [MarkersPlugin, { markers: [] }]
        ]
      });

      // Store the viewer reference
      sphereViewer.current = viewer;
      // Store the current neighborhood id to compare next time
      prevNeighborhoodIdRef.current = neighborhood.id;

      // Wait for the viewer to be ready
      viewer.addEventListener('ready', () => {
        console.log("Viewer is now ready");
        
        // Get the markers plugin instance from the viewer with proper type casting
        const markers = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;
        if (!markers) {
          console.error("Failed to get markers plugin");
          return;
        }
        
        setViewerReady(true);
        viewerInitialized.current = true;
        onViewerReady(viewer, markers);
      });
    } catch (error) {
      console.error("Error creating viewer:", error);
    }

    // Clean up function
    return () => {
      // Only destroy viewer when component unmounts or neighborhood changes
      if (sphereViewer.current) {
        console.log("Cleaning up viewer");
        sphereViewer.current.destroy();
        sphereViewer.current = null;
        prevNeighborhoodIdRef.current = null;
        viewerInitialized.current = false;
      }
      setViewerReady(false);
    };
  }, [containerRef, neighborhood.id, neighborhood.name, onViewerReady]);

  return { viewerReady };
}

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export const App: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "";

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [0, 0],
        zoom: 1,
        pitch: 45,
        bearing: 0,
        antialias: true,
        hash: false,
      });

      map.current.on("load", () => {
        // Edificios 3D
        map.current!.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 14,
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["linear"],
              ["get", "height"],
              0,
              "#e8dcc8",
              50,
              "#d4c4a8",
              100,
              "#bfa980",
              150,
              "#a89060",
              200,
              "#8c7848",
            ],
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["get", "height"],
              0,
              0,
              50,
              50,
              100,
              100,
              200,
              200,
            ],
            "fill-extrusion-base": [
              "case",
              ["has", "min_height"],
              ["get", "min_height"],
              0,
            ],
            "fill-extrusion-opacity": 0.95,
          },
        });

        // Ventanas en edificios
        map.current!.addLayer({
          id: "building-windows",
          source: "composite",
          "source-layer": "building",
          type: "fill-extrusion",
          minzoom: 17,
          paint: {
            "fill-extrusion-color": "#ffdd88",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["get", "height"],
              0,
              2,
              50,
              3,
              100,
              4,
              200,
              5,
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["get", "height"],
              0,
              0,
              50,
              1,
              100,
              2,
              200,
              3,
            ],
            "fill-extrusion-opacity": 0.6,
          },
        });

        // Canchas deportivas
        map.current!.addLayer({
          id: "sports-fields",
          type: "fill",
          source: "composite",
          "source-layer": "landuse",
          filter: ["==", "class", "sports"],
          minzoom: 15,
          paint: {
            "fill-color": "#4caf50",
            "fill-opacity": 0.7,
            "fill-outline-color": "#2e7d32",
          },
        });

        // Líneas de canchas
        map.current!.addLayer({
          id: "sports-field-lines",
          type: "line",
          source: "composite",
          "source-layer": "landuse",
          filter: ["==", "class", "sports"],
          minzoom: 17,
          paint: {
            "line-color": "#ffffff",
            "line-width": 2,
            "line-dasharray": [2, 1],
          },
        });

        // Canchas en 3D
        map.current!.addLayer({
          id: "sports-fields-3d",
          type: "fill-extrusion",
          source: "composite",
          "source-layer": "landuse",
          filter: ["==", "class", "sports"],
          minzoom: 16,
          paint: {
            "fill-extrusion-color": "#66bb6a",
            "fill-extrusion-height": 0.5,
            "fill-extrusion-opacity": 0.8,
          },
        });

        // Jardines
        map.current!.addLayer({
          id: "gardens",
          type: "fill",
          source: "composite",
          "source-layer": "landuse",
          filter: ["==", "class", "garden"],
          minzoom: 16,
          paint: {
            "fill-color": "#81c784",
            "fill-opacity": 0.6,
          },
        });

        // Piscinas
        map.current!.addLayer({
          id: "swimming-pools",
          type: "fill",
          source: "composite",
          "source-layer": "water",
          minzoom: 17,
          paint: {
            "fill-color": "#4fc3f7",
            "fill-opacity": 0.8,
            "fill-outline-color": "#0288d1",
          },
        });

        // Iluminación (propiedades válidas)
        map.current!.setLight({
          anchor: "map",
          position: [1.5, 85, 70],
          color: "#fff5e6",
          intensity: 0.9,
        });

        // Atmósfera (válido en versiones recientes)
        if (map.current!.setFog) {
          map.current!.setFog({
            range: [0.5, 5],
            color: "#e0e7ff",
            "high-color": "#b0c4ff",
            "horizon-blend": 0.2,
          });
        }
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        }),
        "top-right",
      );

      map.current.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: "metric",
        }),
        "bottom-left",
      );
    }

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
        }
        .mapboxgl-ctrl-logo {
          opacity: 0.5;
        }
        .mapboxgl-ctrl {
          border-radius: 12px !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
          backdrop-filter: blur(5px) !important;
          background: rgba(255,255,255,0.9) !important;
        }
        .mapboxgl-ctrl button {
          transition: all 0.2s ease !important;
          border-radius: 8px !important;
        }
        .mapboxgl-ctrl button:hover {
          background-color: #e0e0e0 !important;
          transform: scale(1.05) !important;
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      </div>
    </>
  );
};

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Estacion {
  nombre: string;
  color: string;
  geom: {
    wkt: string;
  };
}

interface Poste {
  id_linea: string;
  id_poste: string;
  geom: {
    wkt: string;
    type: string;
    coordinates: [number, number];
  };
}

interface Cable {
  id_linea: string;
  id_cable: string;
  geom: {
    wkt: string;
    type: string;
    coordinates: number[][];
  };
}

export const App: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [cables, setCables] = useState<Cable[]>([]);
  const [cargando, setCargando] = useState(true);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const cabinMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const animationFramesRef = useRef<number[]>([]);
  const selectedEstacionRef = useRef<string | null>(null);

  // Estado para el panel de capas
  const [capas, setCapas] = useState({
    estaciones: true,
    postes: true,
    cables: true,
    edificios3d: true,
    cabinas: true,
    terreno3d: true,
  });

  // Función para parsear polígono WKT a coordenadas GeoJSON
  const parsePoligonoToGeoJSON = (wkt: string): any => {
    const polygonMatch = wkt.match(/POLYGON\(\(([^)]+)\)\)/i);
    if (polygonMatch) {
      const coordsStr = polygonMatch[1];
      const puntos = coordsStr.split(",").map((punto) => {
        const [lng, lat] = punto.trim().split(" ");
        return [parseFloat(lng), parseFloat(lat)];
      });

      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [puntos],
        },
      };
    }
    return null;
  };

  // Función para parsear LineString WKT a GeoJSON
  const parseLineStringToGeoJSON = (wkt: string): any => {
    const lineMatch = wkt.match(/LINESTRING\(([^)]+)\)/i);
    if (lineMatch) {
      const coordsStr = lineMatch[1];
      const puntos = coordsStr.split(",").map((punto) => {
        const [lng, lat] = punto.trim().split(" ");
        return [parseFloat(lng), parseFloat(lat)];
      });

      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: puntos,
        },
      };
    }
    return null;
  };

  // Función para extraer coordenadas de POINT
  const extraerCoordenadasPoint = (wkt: string): [number, number] | null => {
    const pointMatch = wkt.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/i);
    if (pointMatch) {
      return [parseFloat(pointMatch[1]), parseFloat(pointMatch[2])];
    }
    return null;
  };

  // Función para calcular el centro del polígono
  const calcularCentroPoligono = (wkt: string): [number, number] => {
    const polygonMatch = wkt.match(/POLYGON\(\(([^)]+)\)\)/i);
    if (polygonMatch) {
      const coordsStr = polygonMatch[1];
      const puntos = coordsStr.split(",").map((punto) => {
        const [lng, lat] = punto.trim().split(" ");
        return { lng: parseFloat(lng), lat: parseFloat(lat) };
      });

      let sumLng = 0;
      let sumLat = 0;
      puntos.forEach((p) => {
        sumLng += p.lng;
        sumLat += p.lat;
      });

      return [sumLng / puntos.length, sumLat / puntos.length];
    }
    return [-68.1193, -16.4897];
  };

  // Calcular distancia entre dos puntos
  const calcularDistancia = (p1: number[], p2: number[]): number => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Interpolar entre dos puntos
  const interpolar = (p1: number[], p2: number[], t: number): number[] => {
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
  };

  // Mapa de colores para estaciones
  const colorMap: Record<string, string> = {
    MORADA: "#9b59b6",
    ROJA: "#e74c3c",
    AMARILLA: "#f1c40f",
    AZUL: "#3498db",
    VERDE: "#2ecc71",
    NARANJA: "#e67e22",
    CELESTE: "#1abc9c",
    BLANCA: "#ecf0f1",
    CAFE: "#8B4513",
    CAFÉ: "#8B4513",
    MARRON: "#8B4513",
    MARRÓN: "#8B4513",
    PLATEADA: "#bdc3c7",
  };

  // Mapa de id_linea a color (usando los IDs reales de las líneas)
  const lineaColorMap: Record<string, string> = {
    "724c2135-48c9-4869-a08a-2a49161ce8d0": "#9b59b6", // MORADA
    "57e79c0c-e419-4d62-a0b0-f5e6b8f81a50": "#e74c3c", // ROJA
    "d37ca4a6-846c-4bd3-ba66-811eec423599": "#f1c40f", // AMARILLA
    "d271a7ad-41fe-423e-b2a7-da737c79523b": "#2ecc71", // VERDE
    "63d4f288-adb3-4a76-a660-5a6b22077541": "#3498db", // AZUL
    "c4d01eef-0238-43ed-a339-8024269557ee": "#e67e22", // NARANJA
    "c39a1966-fcf1-4c93-b7ac-7186b5223a34": "#ecf0f1", // BLANCA
    "71937409-5b6a-4327-af51-d46a73a6cc13": "#1abc9c", // CELESTE
    "520dea26-7790-41ff-b02a-f9f812e6e3bf": "#8B4513", // CAFE
    "17cf317f-c28f-47a6-89c9-0c1d5bba668f": "#bdc3c7", // PLATEADA
  };

  // Guardar IDs de capas para poder toggle
  const layerIdsRef = useRef({
    estacionLayers: [] as string[],
    posteMarkers: [] as mapboxgl.Marker[],
    cableLayers: [] as string[],
    estacionMarkers: [] as mapboxgl.Marker[],
  });

  // Animación de cabinas con movimiento fluido usando requestAnimationFrame
  const animateCabins = (map: mapboxgl.Map, cables: Cable[]) => {
    // Limpiar animaciones anteriores
    if (cabinMarkersRef.current.length > 0) {
      cabinMarkersRef.current.forEach((marker) => marker.remove());
      cabinMarkersRef.current = [];
    }
    if (animationFramesRef.current.length > 0) {
      animationFramesRef.current.forEach((id) => cancelAnimationFrame(id));
      animationFramesRef.current = [];
    }

    if (!capas.cabinas) return;

    cables.forEach((cable, cableIdx) => {
      const coords = cable.geom.coordinates;
      if (!coords || coords.length < 2) return;

      // Usar id_linea directamente para el color
      const cableColor = lineaColorMap[cable.id_linea] || "#95a5a6";

      // Calcular longitud total del cable
      let longitudTotal = 0;
      const segmentLengths: number[] = [];
      for (let i = 0; i < coords.length - 1; i++) {
        const dist = calcularDistancia(coords[i], coords[i + 1]);
        segmentLengths.push(dist);
        longitudTotal += dist;
      }

      // Cantidad de cabinas por cable
      const numCabins = 8;

      for (let cabinIdx = 0; cabinIdx < numCabins; cabinIdx++) {
        const color = cableColor;

        const el = document.createElement("div");
        el.innerHTML = `
          <div style="
            width: 12px;
            height: 12px;
            background: ${color};
            border: 2px solid rgba(255,255,255,0.8);
            border-radius: 50%;
            box-shadow: 0 0 8px ${color}, 0 0 16px ${color}66;
            position: relative;
            transition: transform 0.3s ease;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 3px;
              height: 3px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `;

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: "center",
        })
          .setLngLat([coords[0][0], coords[0][1]])
          .addTo(map);

        cabinMarkersRef.current.push(marker);

        // Estado de la animación
        let progress = cabinIdx / numCabins;
        let direction = 1;
        const speed = 0.025;
        let lastTime = performance.now();

        const animate = (currentTime: number) => {
          if (!capas.cabinas) {
            return;
          }

          const deltaTime = (currentTime - lastTime) / 1000;
          lastTime = currentTime;

          progress += speed * direction * deltaTime * 0.5;

          if (progress >= 1) {
            progress = 1;
            direction = -1;
          } else if (progress <= 0) {
            progress = 0;
            direction = 1;
          }

          const targetDistance = progress * longitudTotal;
          let accumulatedDistance = 0;
          let segmentIndex = 0;
          let segmentProgress = 0;

          for (let i = 0; i < segmentLengths.length; i++) {
            if (accumulatedDistance + segmentLengths[i] >= targetDistance) {
              segmentIndex = i;
              segmentProgress =
                (targetDistance - accumulatedDistance) / segmentLengths[i];
              break;
            }
            accumulatedDistance += segmentLengths[i];
          }

          const startPoint = coords[segmentIndex];
          const endPoint =
            coords[Math.min(segmentIndex + 1, coords.length - 1)];
          const [lng, lat] = interpolar(startPoint, endPoint, segmentProgress);

          marker.setLngLat([lng, lat]);

          const animFrameId = requestAnimationFrame(animate);
          animationFramesRef.current.push(animFrameId);
        };

        const animFrameId = requestAnimationFrame(animate);
        animationFramesRef.current.push(animFrameId);
      }
    });
  };

  // Función para toggle capas
  const toggleCapa = (capa: keyof typeof capas) => {
    setCapas((prev) => {
      const newState = { ...prev, [capa]: !prev[capa] };

      if (capa === "cabinas" && map.current) {
        if (!newState.cabinas) {
          cabinMarkersRef.current.forEach((marker) => marker.remove());
          cabinMarkersRef.current = [];
          animationFramesRef.current.forEach((id) => cancelAnimationFrame(id));
          animationFramesRef.current = [];
        } else {
          animateCabins(map.current, cables);
        }
      }

      return newState;
    });
    if (!map.current) return;

    switch (capa) {
      case "estaciones":
        layerIdsRef.current.estacionLayers.forEach((layerId) => {
          const fillLayer = `${layerId}-fill`;
          const lineLayer = `${layerId}-line`;
          const extrusionLayer = `${layerId}-extrusion`;

          if (map.current?.getLayer(fillLayer)) {
            const visibility = !capas.estaciones ? "visible" : "none";
            map.current.setLayoutProperty(fillLayer, "visibility", visibility);
            map.current.setLayoutProperty(lineLayer, "visibility", visibility);
            map.current.setLayoutProperty(
              extrusionLayer,
              "visibility",
              visibility,
            );
          }
        });
        layerIdsRef.current.estacionMarkers.forEach((marker) => {
          marker.getElement().style.display = !capas.estaciones
            ? "block"
            : "none";
        });
        break;

      case "postes":
        layerIdsRef.current.posteMarkers.forEach((marker) => {
          marker.getElement().style.display = !capas.postes ? "block" : "none";
        });
        break;

      case "cables":
        layerIdsRef.current.cableLayers.forEach((layerId) => {
          const lineLayer = `${layerId}-line`;
          const glowLayer = `${layerId}-glow`;

          if (map.current?.getLayer(lineLayer)) {
            const visibility = !capas.cables ? "visible" : "none";
            map.current.setLayoutProperty(lineLayer, "visibility", visibility);
            map.current.setLayoutProperty(glowLayer, "visibility", visibility);
          }
        });
        break;

      case "edificios3d":
        if (map.current?.getLayer("3d-buildings")) {
          const visibility = !capas.edificios3d ? "visible" : "none";
          map.current.setLayoutProperty(
            "3d-buildings",
            "visibility",
            visibility,
          );
        }
        break;

      case "terreno3d":
        if (map.current?.getSource("mapbox-dem")) {
          if (!capas.terreno3d) {
            map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
          } else {
            map.current.setTerrain(null);
          }
        }
        if (map.current?.getLayer("sky")) {
          const visibility = !capas.terreno3d ? "visible" : "none";
          map.current.setLayoutProperty("sky", "visibility", visibility);
        }
        break;
    }
  };

  // Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log("Cargando estaciones, postes y cables...");
        const [estacionesRes, postesRes, cablesRes] = await Promise.all([
          fetch("http://localhost:3333/api/estaciones"),
          fetch("http://localhost:3333/api/poste"),
          fetch("http://localhost:3333/cable"),
        ]);

        const estacionesData = await estacionesRes.json();
        const postesData = await postesRes.json();
        const cablesData = await cablesRes.json();

        console.log("Estaciones:", estacionesData.length);
        console.log("Postes:", postesData.length);
        console.log("Cables:", cablesData.length);

        setEstaciones(estacionesData);
        setPostes(postesData);
        setCables(cablesData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (cargando || !mapContainer.current || estaciones.length === 0) {
      return;
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

    // Calcular centro
    let sumLng = 0,
      sumLat = 0,
      total = 0;
    estaciones.forEach((est) => {
      const [lng, lat] = calcularCentroPoligono(est.geom.wkt);
      sumLng += lng;
      sumLat += lat;
      total++;
    });
    const centro: [number, number] =
      total > 0 ? [sumLng / total, sumLat / total] : [-68.1193, -16.4897];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: centro,
      zoom: 14,
      pitch: 65,
      bearing: 25,
      antialias: true,
      maxPitch: 85,
      minZoom: 10,
    });

    map.current.on("style.load", () => {
      console.log("Estilo oscuro cargado");

      // ✅ AÑADIR TERRENO 3D (MONTAÑAS Y ELEVACIÓN)
      map.current!.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });

      // Activar el terreno 3D
      map.current!.setTerrain({
        source: "mapbox-dem",
        exaggeration: 1.5, // Exageración de altura (1.5 = 50% más alto)
      });

      // Añadir sky layer para efecto atmosférico
      map.current!.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
          "sky-atmosphere-color": "#1a1a3e",
          "sky-atmosphere-halo-color": "#2a2a5e",
        },
      });

      // Añadir edificios 3D usando la fuente composite del estilo dark
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
            "#1a1a2e",
            50,
            "#2a2a4e",
            100,
            "#3a3a5e",
            200,
            "#4a4a6e",
          ],
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            0,
            14.05,
            ["get", "height"],
          ],
          "fill-extrusion-base": [
            "case",
            ["has", "min_height"],
            ["get", "min_height"],
            0,
          ],
          "fill-extrusion-opacity": 0.8,
        },
      });

      // Configurar cámara para vista 3D
      map.current!.setLight({
        anchor: "map",
        color: "#ffffff",
        intensity: 0.5,
        position: [1.15, 210, 30],
      });

      // Añadir niebla para efecto de profundidad
      map.current!.setFog({
        color: "rgba(10, 10, 30, 0.8)",
        "high-color": "rgba(20, 20, 50, 0.5)",
        "horizon-blend": 0.1,
        "space-color": "rgba(10, 10, 25, 1)",
        "star-intensity": 0.5,
      });

      // Popup persistente para click
      const clickPopup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        offset: 25,
        maxWidth: "300px",
        className: "click-popup-dark",
      });

      const bounds = new mapboxgl.LngLatBounds();

      // ============ DIBUJAR CABLES ============
      cables.forEach((cable, idx) => {
        const geoJSON = parseLineStringToGeoJSON(cable.geom.wkt);
        if (!geoJSON) return;

        // Usar id_linea directamente
        const color = lineaColorMap[cable.id_linea] || "#95a5a6";

        const sourceId = `cable-${idx}`;
        const layerId = `cable-layer-${idx}`;

        map.current!.addSource(sourceId, { type: "geojson", data: geoJSON });

        // Capa de brillo base
        map.current!.addLayer({
          id: `${layerId}-glow`,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": color,
            "line-width": 10,
            "line-opacity": 0.15,
            "line-blur": 2,
          },
        });

        // Capa principal del cable
        map.current!.addLayer({
          id: `${layerId}-line`,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": color,
            "line-width": 2.5,
            "line-opacity": 0.7,
          },
        });

        layerIdsRef.current.cableLayers.push(layerId);

        geoJSON.geometry.coordinates.forEach((coord: number[]) =>
          bounds.extend([coord[0], coord[1]]),
        );
      });

      // ============ DIBUJAR ESTACIONES CON CLICK ============
      estaciones.forEach((estacion, idx) => {
        const geoJSON = parsePoligonoToGeoJSON(estacion.geom.wkt);
        if (!geoJSON) return;

        let color = colorMap[estacion.color.toUpperCase()] || "#95a5a6";
        const centroPoligono = calcularCentroPoligono(estacion.geom.wkt);
        const sourceId = `estacion-${idx}`;
        const layerId = `estacion-layer-${idx}`;

        map.current!.addSource(sourceId, { type: "geojson", data: geoJSON });

        // Relleno base
        map.current!.addLayer({
          id: `${layerId}-fill`,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": color,
            "fill-opacity": 0.2,
          },
        });

        // Borde neón
        map.current!.addLayer({
          id: `${layerId}-line`,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": color,
            "line-width": 3,
            "line-opacity": 0.6,
          },
        });

        // Extrusión 3D
        map.current!.addLayer({
          id: `${layerId}-extrusion`,
          type: "fill-extrusion",
          source: sourceId,
          paint: {
            "fill-extrusion-color": color,
            "fill-extrusion-height": 10,
            "fill-extrusion-opacity": 0.6,
          },
        });

        layerIdsRef.current.estacionLayers.push(layerId);

        // Click en la estación para mostrar popup persistente
        map.current!.on("click", `${layerId}-fill`, (e) => {
          const estacionId = `${estacion.nombre}-${idx}`;

          if (selectedEstacionRef.current === estacionId) {
            clickPopup.remove();
            selectedEstacionRef.current = null;
          } else {
            clickPopup.remove();
            selectedEstacionRef.current = estacionId;

            clickPopup
              .setLngLat([centroPoligono[0], centroPoligono[1]])
              .setHTML(
                `
                <div style="
                  background: linear-gradient(135deg, ${color}, ${color}dd);
                  color: white;
                  border-radius: 16px;
                  overflow: hidden;
                  min-width: 240px;
                ">
                  <div style="
                    padding: 16px;
                    background: rgba(0,0,0,0.2);
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                  ">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">
                      🚉 ${estacion.nombre}
                    </div>
                    <div style="font-size: 13px; opacity: 0.9;">
                      Línea ${estacion.color}
                    </div>
                  </div>
                  <div style="padding: 16px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                      <div>
                        <div style="font-size: 11px; opacity: 0.7;">TIPO</div>
                        <div style="font-weight: 500;">Metro</div>
                      </div>
                      <div>
                        <div style="font-size: 11px; opacity: 0.7;">ESTADO</div>
                        <div style="font-weight: 500; color: #4ade80;">Operativa</div>
                      </div>
                      <div>
                        <div style="font-size: 11px; opacity: 0.7;">ENTRADAS</div>
                        <div style="font-weight: 500;">3</div>
                      </div>
                      <div>
                        <div style="font-size: 11px; opacity: 0.7;">CONEXIONES</div>
                        <div style="font-weight: 500;">2 líneas</div>
                      </div>
                    </div>
                  </div>
                </div>
              `,
              )
              .addTo(map.current!);
          }
        });

        // Cambiar cursor al pasar sobre estaciones
        map.current!.on("mouseenter", `${layerId}-fill`, () => {
          map.current!.getCanvas().style.cursor = "pointer";
          map.current!.setPaintProperty(`${layerId}-fill`, "fill-opacity", 0.4);
          map.current!.setPaintProperty(
            `${layerId}-extrusion`,
            "fill-extrusion-height",
            15,
          );
        });

        map.current!.on("mouseleave", `${layerId}-fill`, () => {
          map.current!.getCanvas().style.cursor = "";
          if (selectedEstacionRef.current !== `${estacion.nombre}-${idx}`) {
            map.current!.setPaintProperty(
              `${layerId}-fill`,
              "fill-opacity",
              0.2,
            );
            map.current!.setPaintProperty(
              `${layerId}-extrusion`,
              "fill-extrusion-height",
              10,
            );
          }
        });

        // Marcador de estación
        const el = document.createElement("div");
        el.innerHTML = `
          <div style="
            width: 32px;
            height: 32px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px ${color}80, 0 0 40px ${color}40;
            cursor: pointer;
          ">
            <span style="font-size: 16px;">🚇</span>
          </div>`;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([centroPoligono[0], centroPoligono[1]])
          .addTo(map.current!);

        layerIdsRef.current.estacionMarkers.push(marker);

        geoJSON.geometry.coordinates[0].forEach((coord: number[]) =>
          bounds.extend([coord[0], coord[1]]),
        );
      });

      // ============ DIBUJAR POSTES ============
      postes.forEach((poste) => {
        const coords = extraerCoordenadasPoint(poste.geom.wkt);
        if (!coords) return;

        // Usar id_linea directamente en lugar de buscar estación cercana
        const colorPoste = lineaColorMap[poste.id_linea] || "#95a5a6";

        const el = document.createElement("div");
        el.innerHTML = `
          <div style="
            width: 18px;
            height: 18px;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid ${colorPoste};
            border-radius: 3px;
            transform: rotate(45deg);
            box-shadow: 0 0 15px ${colorPoste}80;
            cursor: pointer;
          ">
            <div style="
              width: 5px;
              height: 5px;
              background: ${colorPoste};
              border-radius: 50%;
              margin: 4px 0 0 4px;
              transform: rotate(-45deg);
              box-shadow: 0 0 6px ${colorPoste}cc;
            "></div>
          </div>`;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([coords[0], coords[1]])
          .addTo(map.current!);
        layerIdsRef.current.posteMarkers.push(marker);

        bounds.extend([coords[0], coords[1]]);
      });

      // Cerrar popup al hacer clic en el mapa
      map.current!.on("click", (e) => {
        const features = map.current!.queryRenderedFeatures(e.point, {
          layers: layerIdsRef.current.estacionLayers.map((id) => `${id}-fill`),
        });
        if (features.length === 0) {
          clickPopup.remove();
          selectedEstacionRef.current = null;
        }
      });

      // Iniciar animación de cabinas
      if (capas.cabinas) {
        setTimeout(() => {
          animateCabins(map.current!, cables);
        }, 1000);
      }

      if (estaciones.length > 0 || postes.length > 0 || cables.length > 0) {
        map.current!.fitBounds(bounds, {
          padding: 150,
          pitch: 65,
          bearing: 25,
          maxZoom: 16,
          duration: 2000,
        });
      }
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Permitir rotación para mejor experiencia 3D
    map.current.on("load", () => {
      map.current!.dragRotate.enable();
      map.current!.touchZoomRotate.enableRotation();
    });

    return () => {
      if (map.current) map.current.remove();
      if (popupRef.current) popupRef.current.remove();
      cabinMarkersRef.current.forEach((marker) => marker.remove());
      animationFramesRef.current.forEach((id) => cancelAnimationFrame(id));
    };
  }, [cargando, estaciones, postes, cables]);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          background: #0a0a1a;
        }
        
        .mapboxgl-ctrl-logo { opacity: 0.3; filter: invert(1); }
        
        .click-popup-dark .mapboxgl-popup-content { 
          padding: 0 !important; 
          background: transparent !important; 
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
          border: none !important;
          border-radius: 16px !important;
        }
        .click-popup-dark .mapboxgl-popup-tip { 
          border-top-color: rgba(0,0,0,0.8) !important;
        }
        .click-popup-dark .mapboxgl-popup-close-button {
          color: white !important;
          font-size: 18px !important;
          padding: 4px 8px !important;
          border-radius: 50% !important;
          top: 8px !important;
          right: 8px !important;
          background: rgba(0,0,0,0.3) !important;
        }
        
        .control-panel {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(10, 10, 30, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 20px;
          color: white;
          font-family: 'Segoe UI', system-ui, sans-serif;
          z-index: 1000;
          min-width: 200px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .control-panel h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          text-align: center;
          color: #a78bfa;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 700;
        }
        
        .control-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: rgba(139, 92, 246, 0.05);
        }
        
        .control-item:hover {
          background: rgba(139, 92, 246, 0.15);
          transform: translateX(-2px);
        }
        
        .control-item label {
          cursor: pointer;
          font-size: 13px;
          flex: 1;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        
        .control-item input {
          cursor: pointer;
          width: 20px;
          height: 20px;
          accent-color: #8b5cf6;
        }
        
        .color-badge {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          box-shadow: 0 0 10px currentColor;
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        hr {
          margin: 16px 0;
          border-color: rgba(139, 92, 246, 0.2);
        }
        
        .panel-footer {
          margin-top: 12px;
          text-align: center;
          font-size: 10px;
          color: #666;
          letter-spacing: 1px;
        }

        .mapboxgl-ctrl-group {
          background: rgba(10, 10, 30, 0.9) !important;
          border: 1px solid rgba(139, 92, 246, 0.3) !important;
        }
        
        .mapboxgl-ctrl-group button {
          filter: invert(1) !important;
        }
      `}</style>

      {/* Panel de control */}
      <div className="control-panel">
        <h3>🎛️ Control Panel</h3>
        <div className="control-item" onClick={() => toggleCapa("estaciones")}>
          <input
            type="checkbox"
            checked={capas.estaciones}
            onChange={() => {}}
          />
          <label>🏢 Estaciones</label>
          <div
            className="color-badge"
            style={{ background: "#9b59b6", boxShadow: "0 0 10px #9b59b6" }}
          ></div>
        </div>
        <div className="control-item" onClick={() => toggleCapa("postes")}>
          <input type="checkbox" checked={capas.postes} onChange={() => {}} />
          <label>⚡ Postes</label>
          <div
            className="color-badge"
            style={{ background: "#f39c12", boxShadow: "0 0 10px #f39c12" }}
          ></div>
        </div>
        <div className="control-item" onClick={() => toggleCapa("cables")}>
          <input type="checkbox" checked={capas.cables} onChange={() => {}} />
          <label>🔌 Cables</label>
          <div
            className="color-badge"
            style={{ background: "#e74c3c", boxShadow: "0 0 10px #e74c3c" }}
          ></div>
        </div>
        <div className="control-item" onClick={() => toggleCapa("cabinas")}>
          <input type="checkbox" checked={capas.cabinas} onChange={() => {}} />
          <label>🚡 Cabinas</label>
          <div
            className="color-badge"
            style={{ background: "#8b5cf6", boxShadow: "0 0 10px #8b5cf6" }}
          ></div>
        </div>
        <hr />
        <div className="control-item" onClick={() => toggleCapa("edificios3d")}>
          <input
            type="checkbox"
            checked={capas.edificios3d}
            onChange={() => {}}
          />
          <label>🏙️ Edificios 3D</label>
          <div
            className="color-badge"
            style={{ background: "#1a1a2e", boxShadow: "0 0 10px #1a1a2e" }}
          ></div>
        </div>
        <div className="control-item" onClick={() => toggleCapa("terreno3d")}>
          <input
            type="checkbox"
            checked={capas.terreno3d}
            onChange={() => {}}
          />
          <label>🏔️ Terreno 3D</label>
          <div
            className="color-badge"
            style={{ background: "#3b82f6", boxShadow: "0 0 10px #3b82f6" }}
          ></div>
        </div>
        <div className="panel-footer">⚡ Real-time • 3D Terrain</div>
      </div>

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
        {cargando && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              color: "#a78bfa",
              padding: "24px 48px",
              borderRadius: "20px",
              zIndex: 1000,
              border: "1px solid rgba(139, 92, 246, 0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              fontSize: "16px",
              fontWeight: "500",
              letterSpacing: "1px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏗️</div>
              Cargando mapa 3D...
            </div>
          </div>
        )}
        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      </div>
    </>
  );
};

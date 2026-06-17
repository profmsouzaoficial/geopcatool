import React, { useState, useMemo, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { RefreshCw, Map as MapIcon, Plus, Minus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Importe real adicionado
import rewind from '@turf/rewind';
import bbox from '@turf/bbox';
import center from '@turf/center';

interface BairroScore {
  bairro_nome: string;
  escore_geral: number;
}

interface InteractiveChoroplethDashboardProps {
  filterState: string;
  filterCity: string;
}

export function InteractiveChoroplethDashboard({ filterState, filterCity }: InteractiveChoroplethDashboardProps) {
  const [data, setData] = useState<BairroScore[]>([]); // Inicializa vazio
  const [selectedBairros, setSelectedBairros] = useState<string[]>([]);
  const [position, setPosition] = useState({ coordinates: [0, 0] as [number, number], zoom: 1.0 });
  const [initialCenter, setInitialCenter] = useState<[number, number]>([0, 0]);
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapScale, setMapScale] = useState(160000);

  // --------------------------------------------------------------------------
  // LÓGICA DO SUPABASE (Consulta tabela REAL)
  // --------------------------------------------------------------------------
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const query = supabase
          .from('survey_responses')
          .select('neighborhood, score')
          .not('neighborhood', 'is', null);

        if (filterState && filterState !== 'all') query.eq('state', filterState);
        if (filterCity && filterCity !== 'all') query.eq('city', filterCity);

        const [responsesRes, geoRes] = await Promise.all([
          query,
          supabase
            .from('geoJSON')
            .select('neighbour_shp')
            .eq('state', filterState)
            .eq('city', filterCity)
            .single()
        ]);
        
        if (!responsesRes.error && responsesRes.data) {
           // Agrupa para calcular a média
           const aggMap = new Map<string, {total: number, count: number}>();
           
           responsesRes.data.forEach(r => {
             if (!r.neighborhood || r.score === null) return;
             
             const current = aggMap.get(r.neighborhood) || {total: 0, count: 0};
             aggMap.set(r.neighborhood, {
               total: current.total + Number(r.score),
               count: current.count + 1
             });
           });
           
           const aggregatedData: BairroScore[] = [];
           aggMap.forEach((val, key) => {
             aggregatedData.push({
               bairro_nome: key,
               escore_geral: val.total / val.count
             });
           });
           
           setData(aggregatedData);
        }

        if (geoRes.data?.neighbour_shp) {
          const rawGeoData = geoRes.data.neighbour_shp;
          const mapData = rewind(rawGeoData, { reverse: true });
          setGeoData(mapData);

          const boundingBox = bbox(mapData);
          const mapCenter = center(mapData);
          const coords = mapCenter.geometry.coordinates as [number, number];
          setInitialCenter(coords);
          setPosition({ 
            coordinates: coords,
            zoom: 1.0 
          });

          // A heuristic for scale based on bbox size
          const width = boundingBox[2] - boundingBox[0];
          const height = boundingBox[3] - boundingBox[1];
          const maxDim = Math.max(width, height);
          
          if (maxDim > 0) {
             const scale = 360 / maxDim * 150; // Increased factor to fit better
             setMapScale(scale);
          }
        } else {
          setGeoData(null);
        }
      } catch (e) {
          console.error("Error loading map", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filterState, filterCity]);
  

  // --------------------------------------------------------------------------
  // LÓGICA DE CORES DO MAPA COROPLÉTICO 
  // --------------------------------------------------------------------------
  const getColor = (score: number) => {
    if (score >= 6.6) return "#22c55e"; // Verde (Adequado/Orientação Forte)
    if (score >= 5.0) return "#eab308"; // Amarelo (Atenção/Razoável)
    return "#ef4444";                   // Vermelho (Crítico/Vulnerável)
  };

  const mapData = useMemo(() => {
    const dataMap = new Map();
    data.forEach(d => dataMap.set(d.bairro_nome, d.escore_geral));
    return dataMap;
  }, [data]);

  // --------------------------------------------------------------------------
  // MANIPULAÇÃO DE CLIQUES E FILTRO CRUZADO (CROSS-FILTERING)
  // --------------------------------------------------------------------------
  const handleGeographyClick = (bairroNome: string) => {
    setSelectedBairros(prev => 
      prev.includes(bairroNome) 
        ? prev.filter(b => b !== bairroNome) // Remove se já existe
        : [...prev, bairroNome]              // Adiciona se não existe
    );
  };

  const handleClearSelection = () => {
    setSelectedBairros([]);
  };

  const handleZoomEnd = (pos: any) => {
    setPosition(pos);
  };

  const handleZoomIn = () => {
    setPosition((pos) => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 5) }));
  };

  const handleZoomOut = () => {
    setPosition((pos) => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 0.5) }));
  };

  return (
    <div className="flex flex-col bg-slate-50 p-2 sm:p-6 rounded-2xl h-[calc(100vh-90px)] min-h-[700px] shadow-sm border border-slate-200">
      
      {/* MÓDULO DO MAPA */}
      <div className="flex flex-col flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
         <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 z-10 w-full relative">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <MapIcon size={18} className="text-blue-700"/>
              Índice PCATool por Território (Gov. Valadares)
            </h3>
            {selectedBairros.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
                <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  {selectedBairros.length} selecionado{selectedBairros.length > 1 ? 's' : ''}
                </span>
                <button 
                  onClick={handleClearSelection}
                  className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 hover:bg-slate-200 rounded"
                >
                  <RefreshCw size={12} /> Limpar
                </button>
              </div>
            )}
         </div>
         
         <div className="flex-1 relative bg-blue-50/20 min-h-0 w-full">
           {loading ? (
             <div className="absolute inset-0 flex items-center justify-center">
               <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
             </div>
           ) : geoData ? (
             <>
             <ComposableMap
               projection="geoMercator"
               projectionConfig={{
                 scale: mapScale,
                 center: initialCenter
               }}
               style={{ width: "100%", height: "100%" }}
             >
             <ZoomableGroup 
               zoom={position.zoom} 
               center={position.coordinates} 
               onMoveEnd={handleZoomEnd} 
               minZoom={0.5} 
               maxZoom={5}
             >
               <Geographies geography={geoData}>
                 {({ geographies }) => 
                   geographies.map(geo => {
                     const bairroNome = geo.properties.NM_BAIRRO;
                     const isSelected = selectedBairros.includes(bairroNome);
                     const score = mapData.get(bairroNome);
                     const fillColor = score ? getColor(score) : "#ffffff";

                     return (
                       <Geography
                         key={geo.rsmKey}
                         geography={geo}
                         onClick={() => handleGeographyClick(bairroNome)}
                         style={{
                           default: {
                             fill: fillColor,
                             stroke: isSelected ? "#0f172a" : "#cbd5e1",
                             strokeWidth: isSelected ? 2 : 0.5,
                             outline: "none",
                             transition: "all 250ms"
                           },
                           hover: {
                             fill: fillColor,
                             stroke: "#0f172a",
                             strokeWidth: 2,
                             outline: "none",
                             cursor: "pointer",
                             opacity: 0.8
                           },
                           pressed: {
                             fill: fillColor,
                             stroke: "#000000",
                             strokeWidth: 3,
                             outline: "none"
                           }
                         }}
                       >
                         {/* Usa a tag title para um tooltip nativo básico do SVG */}
                         <title>
                            {bairroNome} - {score ? `Escore Geral: ${score.toFixed(1)} / 10` : 'S/ Dados'}
                         </title>
                       </Geography>
                     );
                   })
                 }
               </Geographies>
             </ZoomableGroup>
           </ComposableMap>

           {/* Legenda Customizada (Flutuante Topo/Horizontal) */}
           <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto bg-white/95 backdrop-blur-sm px-3 sm:px-5 py-2.5 rounded-2xl sm:rounded-full shadow-md border border-slate-200 text-[10px] sm:text-xs flex flex-wrap justify-center items-center gap-2 sm:gap-4 pointer-events-none z-10">
              <div className="font-bold text-slate-800 tracking-tight mr-1 hidden sm:block">Classificação:</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#22c55e]"></div> ≥ 6.6 (Adequado)</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#eab308]"></div> 5.0 - 6.5 (Atenção)</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ef4444]"></div> &lt; 5.0 (Vulnerável)</div>
              <div className="flex items-center gap-1.5 sm:ml-2 sm:pl-2 sm:border-l sm:border-slate-300"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffffff] border border-slate-300"></div> Sem dados</div>
           </div>

           {/* Zoom Controls */}
           <div className="absolute bottom-6 right-6 flex flex-col bg-white/95 backdrop-blur-sm shadow-md rounded-lg border border-slate-200 z-10">
             <button onClick={handleZoomIn} aria-label="Aumentar zoom" className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors rounded-t-lg">
               <Plus size={16} />
             </button>
             <div className="h-[1px] bg-slate-200 w-full" />
             <button onClick={handleZoomOut} aria-label="Diminuir zoom" className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors rounded-b-lg">
               <Minus size={16} />
             </button>
           </div>
           </>
           ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
               <MapIcon size={32} />
               <span className="font-medium text-sm text-center">Nenhum polígono (GeoJSON) encontrado para<br/>{filterCity} - {filterState} na base.</span>
             </div>
           )}
         </div>
      </div>
    </div>
  );
}

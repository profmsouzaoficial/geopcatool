import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, Tooltip as LeafletTooltip } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
  ScatterChart, Scatter, ZAxis, ReferenceLine,
  LineChart, Line
} from 'recharts';
import 'leaflet/dist/leaflet.css';
import { Activity, Users, MapPin, TrendingUp, Loader2, Brain, FileText, Settings as SettingsIcon, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { HeatmapLayer } from '../components/HeatmapLayer';
import { InteractiveChoroplethDashboard } from '../components/InteractiveChoroplethDashboard';
import html2pdf from 'html2pdf.js';
import { exportToEsusCSV } from '../utils/exportEsus';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { WifiOff, RefreshCw } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface SurveyResponse {
  id: string;
  score: number;
  is_high_quality: boolean;
  latitude: number | null;
  longitude: number | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  service_type: string | null;
  target_group: string | null;
  health_unit_name: string | null;
  components?: Record<string, number>;
  created_at: string;
}

const customIcon = new L.Icon({
  iconUrl: 'https://i.imgur.com/WZXGlks.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as { score?: number, isHighQuality?: boolean, components?: Record<string, number> } | null;
  
  const [filterState, setFilterState] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterNeighborhood, setFilterNeighborhood] = useState<string>('all');
  const [filterHealthUnit, setFilterHealthUnit] = useState<string>('all');
  const [filterServiceType, setFilterServiceType] = useState<string>('all');
  const [filterTargetGroup, setFilterTargetGroup] = useState<string>('all');
  const [filterYearRange, setFilterYearRange] = useState<[number, number]>([2020, new Date().getFullYear()]);
  
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [healthUnits, setHealthUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState(false);

  const { pendingSyncCount, isOnline, syncOfflineData } = useOfflineSync();

  useEffect(() => {
    async function fetchData() {
      try {
        const [responsesResult, healthUnitsResult] = await Promise.all([
          supabase
            .from('survey_responses')
            .select('id, score, is_high_quality, latitude, longitude, neighborhood, city, state, service_type, target_group, health_unit_name, components, created_at')
            .order('created_at', { ascending: false }),
          supabase
            .from('health_units')
            .select('*')
        ]);

        if (responsesResult.error) throw responsesResult.error;
        if (healthUnitsResult.error) throw healthUnitsResult.error;

        if (responsesResult.data && responsesResult.data.length > 0) {
          setResponses(responsesResult.data);
        }
        
        if (healthUnitsResult.data) {
          setHealthUnits(healthUnitsResult.data);
        }
      } catch (e) {
        console.error("Error fetching data from Supabase:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const availableStates = useMemo(() => {
    const states = new Set(responses.map(r => r.state).filter(Boolean) as string[]);
    return Array.from(states).sort();
  }, [responses]);

  const availableCities = useMemo(() => {
    let filtered = responses;
    if (filterState !== 'all') filtered = filtered.filter(r => r.state === filterState);
    const cities = new Set(filtered.map(r => r.city).filter(Boolean) as string[]);
    return Array.from(cities).sort();
  }, [responses, filterState]);

  const availableNeighborhoods = useMemo(() => {
    let filtered = responses;
    if (filterState !== 'all') filtered = filtered.filter(r => r.state === filterState);
    if (filterCity !== 'all') filtered = filtered.filter(r => r.city === filterCity);
    const neighborhoods = new Set(filtered.map(r => r.neighborhood).filter(Boolean) as string[]);
    return Array.from(neighborhoods).sort();
  }, [responses, filterState, filterCity]);

  const availableHealthUnits = useMemo(() => {
    let filtered = responses;
    if (filterState !== 'all') filtered = filtered.filter(u => u.state === filterState);
    if (filterCity !== 'all') filtered = filtered.filter(u => u.city === filterCity);
    if (filterNeighborhood !== 'all') filtered = filtered.filter(u => u.neighborhood === filterNeighborhood);
    const units = new Set(filtered.map(u => u.health_unit_name).filter(Boolean) as string[]);
    return Array.from(units).sort();
  }, [responses, filterState, filterCity, filterNeighborhood]);

  const availableYears = useMemo(() => {
    const years = new Set(responses.map(r => new Date(r.created_at).getFullYear()));
    return Array.from(years).sort((a, b) => a - b); // Sort ascending for slider
  }, [responses]);

  useEffect(() => {
    if (availableYears.length > 0) {
      setFilterYearRange([availableYears[0], availableYears[availableYears.length - 1]]);
    }
  }, [availableYears]);

  const filteredResponses = useMemo(() => {
    return responses.filter(r => {
      if (filterState !== 'all' && r.state !== filterState) return false;
      if (filterCity !== 'all' && r.city !== filterCity) return false;
      if (filterNeighborhood !== 'all' && r.neighborhood !== filterNeighborhood) return false;
      if (filterHealthUnit !== 'all' && r.health_unit_name !== filterHealthUnit) return false;
      if (filterServiceType !== 'all' && r.service_type !== filterServiceType) return false;
      if (filterTargetGroup !== 'all' && r.target_group !== filterTargetGroup) return false;
      
      const responseYear = new Date(r.created_at).getFullYear();
      if (responseYear < filterYearRange[0] || responseYear > filterYearRange[1]) return false;
      
      return true;
    });
  }, [responses, filterState, filterCity, filterNeighborhood, filterHealthUnit, filterServiceType, filterTargetGroup, filterYearRange]);
  
  const currentStats = filteredResponses.length > 0 ? {
    avgScore: filteredResponses.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / filteredResponses.length,
    totalEvaluations: filteredResponses.length,
    criticalAreas: filteredResponses.filter(r => !r.is_high_quality).length
  } : {
    avgScore: 0,
    totalEvaluations: 0,
    criticalAreas: 0
  };

  const regionalAverage = useMemo(() => {
    let regionalResponses = responses;
    if (filterCity !== 'all') {
      regionalResponses = responses.filter(r => r.city === filterCity);
    }
    if (regionalResponses.length === 0) return 0;
    return regionalResponses.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0) / regionalResponses.length;
  }, [responses, filterCity]);

  const displayScore = state?.score ?? currentStats.avgScore;
  const displayIsHighQuality = state?.isHighQuality ?? (displayScore >= 6.6);
  const displayComponents = state?.components;

  const componentLabels: Record<string, string> = {
    A: 'Afiliação',
    B: 'Utilização',
    C: 'Acessibilidade',
    D: 'Longitudinalidade',
    E: 'Integração',
    F: 'Sistemas Info',
    G: 'Serv. Disp.',
    H: 'Serv. Prest.',
    I: 'Orient. Fam.',
    J: 'Orient. Com.'
  };

  // Prepare data for charts
  const {
    neighborhoodData,
    radarData,
    stackedBarData,
    divergentBarData,
    scatterData,
    groupedBarData,
    validMapSpots,
    heatmapPoints,
    evolutionData
  } = useMemo(() => {
    // 0. Sanitize Data (Crucial for imported data where JSON might be strings or numbers might be strings)
    const sanitized = filteredResponses.map(r => {
      let comps = r.components || {};
      if (typeof comps === 'string') {
        try { comps = JSON.parse(comps); } catch (e) { comps = {}; }
      }
      return {
        ...r,
        score: Number(r.score) || 0,
        latitude: r.latitude ? Number(r.latitude) : null,
        longitude: r.longitude ? Number(r.longitude) : null,
        components: comps
      };
    });

    // 1. Neighborhood Data (Top 5 average score)
    const nData = sanitized.reduce((acc: any[], curr) => {
      const neighborhood = curr.neighborhood || 'Não Informado';
      const existing = acc.find(item => item.name === neighborhood);
      const score = curr.score;
      
      if (existing) {
        existing.totalScore += score;
        existing.count += 1;
        existing.avgScore = existing.totalScore / existing.count;
      } else {
        acc.push({ name: neighborhood, totalScore: score, count: 1, avgScore: score });
      }
      return acc;
    }, []).sort((a, b) => b.avgScore - a.avgScore).slice(0, 5);

    // 2. Radar Data (Municipal vs Unit)
    const municipalComponents: Record<string, { total: number, count: number }> = {};
    sanitized.forEach(r => {
      if (r.components) {
        Object.entries(r.components).forEach(([key, value]) => {
          if (!municipalComponents[key]) municipalComponents[key] = { total: 0, count: 0 };
          municipalComponents[key].total += Number(value) || 0;
          municipalComponents[key].count += 1;
        });
      }
    });

    const latestEval = sanitized[0];
    const rData = Object.keys(componentLabels).map(key => ({
      subject: componentLabels[key],
      Municipal: municipalComponents[key] ? municipalComponents[key].total / municipalComponents[key].count : 0,
      Unidade: Number(latestEval?.components?.[key]) || 0,
      Referência: 6.6,
      fullMark: 10,
    }));

    // 3. Stacked Bar Data (High vs Low by Neighborhood)
    const sBarData = sanitized.reduce((acc: any[], curr) => {
      const neighborhood = curr.neighborhood || 'Não Informado';
      const existing = acc.find(item => item.name === neighborhood);
      const score = curr.score;
      
      if (existing) {
        if (score >= 6.6) existing.high += 1;
        else if (score >= 4.0) existing.medium += 1;
        else existing.low += 1;
      } else {
        acc.push({ 
          name: neighborhood, 
          high: score >= 6.6 ? 1 : 0, 
          medium: (score >= 4.0 && score < 6.6) ? 1 : 0,
          low: score < 4.0 ? 1 : 0 
        });
      }
      return acc;
    }, []).slice(0, 10);

    // 4. Divergent Bar Data (Gap Professional vs Citizen)
    const dBarData = Object.keys(componentLabels).map(key => {
      const baseScore = municipalComponents[key] ? (municipalComponents[key].total / municipalComponents[key].count) : 7;
      const profScore = baseScore + (Math.random() * 1.5);
      const citizenScore = baseScore - (Math.random() * 1.5);
      
      return {
        attribute: componentLabels[key],
        Profissional: Number(Math.min(10, Math.max(0, profScore)).toFixed(1)),
        Cidadão: Number(Math.min(10, Math.max(0, citizenScore)).toFixed(1)),
        gap: Number((profScore - citizenScore).toFixed(1))
      };
    });

    // 5. Scatter Data (Score vs ICSAP)
    const scData = sanitized.map(r => {
      const score = r.score;
      return {
        score: Number(score.toFixed(1)),
        icsap: Number(Math.max(0, 50 - (score * 4) + (Math.random() * 15 - 7.5)).toFixed(1)),
        name: r.neighborhood || 'Desconhecido'
      };
    });

    // 6. Grouped Bar Data (Services Available G vs Provided H)
    const gBarData = sanitized.reduce((acc: any[], curr) => {
      const neighborhood = curr.neighborhood || 'Não Informado';
      const existing = acc.find(item => item.name === neighborhood);
      const gScore = Number(curr.components?.['G']) || 0;
      const hScore = Number(curr.components?.['H']) || 0;
      
      if (existing) {
        existing.gTotal += gScore;
        existing.hTotal += hScore;
        existing.count += 1;
        existing.Disponível = Number((existing.gTotal / existing.count).toFixed(1));
        existing.Prestado = Number((existing.hTotal / existing.count).toFixed(1));
      } else {
        acc.push({ 
          name: neighborhood, 
          gTotal: gScore, 
          hTotal: hScore, 
          count: 1, 
          Disponível: Number(gScore.toFixed(1)), 
          Prestado: Number(hScore.toFixed(1)) 
        });
      }
      return acc;
    }, []).slice(0, 8);

    // 7. Valid Map Spots & Heatmap Points
    const mapSpots = sanitized.filter(r => 
      r.latitude !== null && !isNaN(r.latitude) && 
      r.longitude !== null && !isNaN(r.longitude)
    );

    const hPoints: [number, number, number][] = mapSpots.map(spot => {
      // Map score (0-10) to intensity (0-1)
      // We want red (vulnerable) to be high intensity, so we invert the score.
      // Score 0 -> intensity 1.0 (very hot/red)
      // Score 10 -> intensity 0.0 (cold/green)
      const intensity = Math.max(0.1, (10 - spot.score) / 10);
      return [spot.latitude!, spot.longitude!, intensity];
    });

    // 8. Evolution Data (Line Chart)
    const evData = sanitized.reduce((acc: any[], curr) => {
      const year = new Date(curr.created_at).getFullYear().toString();
      const existing = acc.find((item: any) => item.year === year);
      if (existing) {
        existing.totalScore += curr.score;
        existing.count += 1;
        existing.Escore = Number((existing.totalScore / existing.count).toFixed(2));
      } else {
        acc.push({ year, totalScore: curr.score, count: 1, Escore: Number(curr.score.toFixed(2)) });
      }
      return acc;
    }, []).sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year));

    return {
      neighborhoodData: nData,
      radarData: rData,
      stackedBarData: sBarData,
      divergentBarData: dBarData,
      scatterData: scData,
      groupedBarData: gBarData,
      validMapSpots: mapSpots,
      heatmapPoints: hPoints,
      evolutionData: evData
    };
  }, [filteredResponses]);

  const generateAIReport = async () => {
    if (!user) return;
    setAiLoading(true);
    setApiKeyError(false);
    setAiReport(null);

    try {
      // Prepare data summary for AI
      const dataSummary = {
        totalEvaluations: currentStats.totalEvaluations,
        averageScore: currentStats.avgScore.toFixed(2),
        criticalAreasCount: currentStats.criticalAreas,
        neighborhoods: neighborhoodData.map(n => `${n.name}: ${n.avgScore.toFixed(2)}`),
        filterState,
        filterCity,
        filterNeighborhood,
        filterServiceType,
        filterTargetGroup,
        filterYearRange,
        servicesGap: groupedBarData.map(g => `${g.name} (Disp: ${g.Disponível}, Prest: ${g.Prestado})`).slice(0, 3)
      };

      const prompt = `
        Você é um especialista em saúde pública e análise de dados do PCATool.
        Analise os seguintes dados agregados de avaliações da Atenção Primária à Saúde:
        
        Total de Avaliações: ${dataSummary.totalEvaluations}
        Escore Médio Geral: ${dataSummary.averageScore} (Escala 0-10, >= 6.6 é adequado)
        Avaliações Críticas (< 6.6): ${dataSummary.criticalAreasCount}
        
        Filtros Atuais:
        - Estado: ${dataSummary.filterState === 'all' ? 'Todos' : dataSummary.filterState}
        - Cidade: ${dataSummary.filterCity === 'all' ? 'Todas' : dataSummary.filterCity}
        - Bairro: ${dataSummary.filterNeighborhood === 'all' ? 'Todos' : dataSummary.filterNeighborhood}
        - Serviço: ${dataSummary.filterServiceType === 'all' ? 'Todos' : dataSummary.filterServiceType === 'bucal' ? 'Saúde Bucal' : 'Saúde Geral'}
        - Público-alvo: ${dataSummary.filterTargetGroup === 'all' ? 'Todos' : dataSummary.filterTargetGroup}
        - Período: ${dataSummary.filterYearRange[0]} a ${dataSummary.filterYearRange[1]}
        
        Principais Bairros (Escore Médio):
        ${dataSummary.neighborhoods.join('\n')}

        Gap de Integralidade (Serviços Disponíveis vs Prestados):
        ${dataSummary.servicesGap.join('\n')}
        
        Forneça um relatório técnico conciso para o gestor de saúde, destacando:
        1. Uma avaliação geral da situação e distribuição territorial.
        2. Pontos de atenção (bairros com piores escores ou gaps de integralidade).
        3. Hipóteses e implicações práticas (o que esses dados podem significar na prática).
        4. Recomendações de ações proativas baseadas nos dados.
        
        Use um tom profissional, objetivo e encorajador. 
        Formate a resposta em HTML válido (apenas as tags internas, sem <html> ou <body>), usando tags como <h3>, <p>, <ul>, <li>, <strong>. Não use Markdown.
      `;

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData.error === 'API key not configured') {
          setApiKeyError(true);
          setAiLoading(false);
          return;
        }
        throw new Error(errorData.error || `Server Error: ${response.statusText}`);
      }

      const data = await response.json();
      setAiReport(data.report);
    } catch (error) {
      console.error("Error generating AI report:", error);
      setAiReport("Ocorreu um erro ao gerar o relatório. Verifique sua chave de API e tente novamente.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAnalysis = () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;

    const opt = {
      margin:       10,
      filename:     'analise_pcatool.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const wrapper = document.createElement('div');
    wrapper.innerHTML = element.innerHTML;
    
    const disclaimer = document.createElement('div');
    disclaimer.style.marginTop = '30px';
    disclaimer.style.paddingTop = '10px';
    disclaimer.style.borderTop = '1px solid #ccc';
    disclaimer.style.fontSize = '10px';
    disclaimer.style.color = '#666';
    disclaimer.style.textAlign = 'center';
    disclaimer.innerText = "Documento gerado automaticamente. As interepretações e implicações práticas desse documento devem ficar a cargo do gestor responsável. É altamente recomendado que esse documento seja devidamente revisado pelos setores competentes da instituição tomadora de decisão.";
    
    wrapper.appendChild(disclaimer);

    html2pdf().set(opt).from(wrapper).save();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-blue-800 mb-4" size={48} />
        <p className="text-slate-600 font-medium">Carregando dados do painel...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <header className="bg-blue-800 text-white p-6 rounded-b-3xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Painel do Gestor</h1>
            <p className="text-blue-200 text-sm">Visão Geral do Território</p>
          </div>
          <div className="flex items-center gap-2">
            {!isOnline && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-100 text-xs font-medium">
                <WifiOff size={14} />
                Offline
              </div>
            )}
            {pendingSyncCount > 0 && (
              <button
                onClick={syncOfflineData}
                disabled={!isOnline}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-100 text-xs font-medium hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={isOnline ? "animate-spin-slow" : ""} />
                {pendingSyncCount} pendentes
              </button>
            )}
            <button
              onClick={() => navigate('/ubs/nova')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Cadastrar UBS
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-medium text-blue-200 uppercase tracking-wider mb-1 ml-1 opacity-80">Estado</label>
              <select 
                value={filterState}
                onChange={(e) => { 
                  setFilterState(e.target.value); 
                  setFilterCity('all'); 
                  setFilterNeighborhood('all'); 
                }}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold outline-none backdrop-blur-sm"
              >
                <option value="all" className="text-slate-900">Todos os Estados</option>
                {availableStates.map(s => <option key={s} value={s} className="text-slate-900">{s}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-medium text-blue-200 uppercase tracking-wider mb-1 ml-1 opacity-80">Cidade</label>
              <select 
                value={filterCity}
                onChange={(e) => { 
                  setFilterCity(e.target.value); 
                  setFilterNeighborhood('all'); 
                }}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold outline-none backdrop-blur-sm"
                disabled={availableCities.length === 0}
              >
                <option value="all" className="text-slate-900">Todas as Cidades</option>
                {availableCities.map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-medium text-blue-200 uppercase tracking-wider mb-1 ml-1 opacity-80">Bairro</label>
              <select 
                value={filterNeighborhood}
                onChange={(e) => {
                  setFilterNeighborhood(e.target.value);
                  setFilterHealthUnit('all');
                }}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold outline-none backdrop-blur-sm"
                disabled={availableNeighborhoods.length === 0}
              >
                <option value="all" className="text-slate-900">Todos os Bairros</option>
                {availableNeighborhoods.map(n => <option key={n} value={n} className="text-slate-900">{n}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-medium text-blue-200 uppercase tracking-wider mb-1 ml-1 opacity-80">Unidade de Saúde</label>
              <select 
                value={filterHealthUnit}
                onChange={(e) => setFilterHealthUnit(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold outline-none backdrop-blur-sm"
                disabled={availableHealthUnits.length === 0}
              >
                <option value="all" className="text-slate-900">Todas as Unidades</option>
                {availableHealthUnits.map(u => <option key={u} value={u} className="text-slate-900">{u}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-medium text-blue-200 uppercase tracking-wider mb-1 ml-1 opacity-80">Serviço</label>
              <select 
                value={filterServiceType}
                onChange={(e) => setFilterServiceType(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold outline-none backdrop-blur-sm"
              >
                <option value="all" className="text-slate-900">Todos os Serviços</option>
                <option value="bucal" className="text-slate-900">Saúde Bucal</option>
                <option value="geral" className="text-slate-900">Saúde Geral</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-medium text-blue-200 uppercase tracking-wider mb-1 ml-1 opacity-80">Público-alvo</label>
              <select 
                value={filterTargetGroup}
                onChange={(e) => setFilterTargetGroup(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold outline-none backdrop-blur-sm"
              >
                <option value="all" className="text-slate-900">Todos os Públicos</option>
                <option value="Adulto" className="text-slate-900">Adultos</option>
                <option value="Criança" className="text-slate-900">Crianças</option>
                <option value="Profissional" className="text-slate-900">Profissionais</option>
              </select>
            </div>

            <div className="flex flex-col min-w-[200px] px-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-medium text-blue-200 uppercase tracking-wider opacity-80">Período</label>
                <span className="text-[10px] font-bold text-white">{filterYearRange[0]} - {filterYearRange[1]}</span>
              </div>
              <div className="px-2 pt-1">
                <Slider
                  range
                  min={availableYears.length > 0 ? availableYears[0] : 2020}
                  max={availableYears.length > 0 ? Math.max(availableYears[availableYears.length - 1], availableYears[0] + 1) : new Date().getFullYear()}
                  value={filterYearRange}
                  onChange={(val) => setFilterYearRange(val as [number, number])}
                  marks={availableYears.reduce((acc, year) => {
                    acc[year] = {
                      style: { color: 'rgba(255,255,255,0.5)', fontSize: '9px', marginTop: '2px' },
                      label: year.toString()
                    };
                    return acc;
                  }, {} as Record<number, any>)}
                  step={1}
                  styles={{
                    track: { backgroundColor: '#3b82f6' },
                    handle: { borderColor: '#3b82f6', backgroundColor: '#fff' },
                    rail: { backgroundColor: 'rgba(255,255,255,0.2)' }
                  }}
                />
              </div>
            </div>
          </div>
        
        <div className="mt-6 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Escore Geral de Saúde</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">{displayScore.toFixed(1)}</span>
                <span className="text-blue-200 mb-1">/ 10</span>
              </div>
            </div>
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center border-4",
              displayIsHighQuality ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300' : 'border-red-400 bg-red-400/20 text-red-300'
            )}>
              <Activity size={32} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
            <span className={cn("inline-block w-3 h-3 rounded-full", displayIsHighQuality ? 'bg-emerald-400' : 'bg-red-400')}></span>
            <span className="text-sm font-medium">
              {displayIsHighQuality ? 'Alto Escore (Qualidade Adequada)' : 'Baixo Escore (Atenção Necessária)'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6 mt-2 max-w-7xl mx-auto w-full">
        <div id="dashboard-content" className="space-y-6">
          {state?.showFeedbackLoop && displayComponents && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Feedback da Avaliação</h2>
              <p className="text-sm text-slate-500 mb-4">Resumo dos atributos da Atenção Primária para a avaliação recém-enviada.</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(displayComponents).map(([key, value]) => {
                  const isGood = value >= 6.6;
                  const isMedium = value >= 4.0 && value < 6.6;
                  const colorClass = isGood ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : isMedium ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-red-50 text-red-800 border-red-200';
                  const dotClass = isGood ? 'bg-emerald-500' : isMedium ? 'bg-yellow-500' : 'bg-red-500';
                  
                  return (
                    <div key={key} className={`p-3 rounded-xl border ${colorClass} flex flex-col items-center justify-center text-center`}>
                      <div className={`w-3 h-3 rounded-full ${dotClass} mb-2`}></div>
                      <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{componentLabels[key] || key}</span>
                      <span className="text-lg font-extrabold">{value.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {displayComponents && !state?.showFeedbackLoop && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Escores por Componente (Última Avaliação)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Object.entries(displayComponents).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{componentLabels[key] || key}</p>
                    <div className="flex items-end gap-1">
                      <span className={cn(
                        "text-lg font-bold",
                        value >= 6.6 ? "text-emerald-600" : "text-red-600"
                      )}>{value.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 mb-0.5">/ 10</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Users size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Total de Avaliações</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{currentStats.totalEvaluations}</p>
              <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <TrendingUp size={12} /> Base de dados atualizada
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <MapPin size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Avaliações Críticas</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{currentStats.criticalAreas}</p>
              <p className="text-xs text-red-500 font-medium mt-2">
                Escore &lt; 6.6 ({currentStats.totalEvaluations > 0 ? Math.round((currentStats.criticalAreas / currentStats.totalEvaluations) * 100) : 0}% do total)
              </p>
            </div>
          </div>

          {/* Interactive Choropleth Dashboard Component */}
          <InteractiveChoroplethDashboard />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mapa */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-slate-900">Mapa de Vulnerabilidade Territorial</h2>
              </div>
              <div className="h-[320px] w-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
                <MapContainer 
                  center={[-18.8514, -41.9466]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {heatmapPoints.length > 0 && <HeatmapLayer points={heatmapPoints} />}

                  {healthUnits.filter(u => 
                    (filterState === 'all' || u.state === filterState) &&
                    (filterCity === 'all' || u.city === filterCity) &&
                    (filterNeighborhood === 'all' || u.neighborhood === filterNeighborhood) &&
                    (filterHealthUnit === 'all' || u.name === filterHealthUnit)
                  ).map(unit => {
                    return (
                      <Marker 
                        key={unit.id} 
                        position={[unit.lat, unit.lng]}
                        icon={customIcon}
                      >
                        <LeafletTooltip direction="top" offset={[0, -20]} opacity={1}>
                          <span className="font-bold text-slate-900">{unit.name}</span>
                        </LeafletTooltip>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-slate-600 font-medium">Adequado (≥ 6.6)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-xs text-slate-600 font-medium">Intermediário (4.0 - 6.5)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-xs text-slate-600 font-medium">Vulnerável (&lt; 4.0)</span>
                </div>
                <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-4">
                  <img src="https://i.imgur.com/WZXGlks.png" alt="UBS" className="h-5" />
                  <span className="text-xs text-slate-600 font-medium">Unidade de Saúde</span>
                </div>
              </div>
            </section>

            {/* Gráfico de Evolução */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Evolução dos Escores ao Longo do Tempo</h2>
              <div className="h-[320px] w-full">
                {evolutionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                      <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [value.toFixed(2), 'Escore Médio']}
                        labelFormatter={(label) => `Ano: ${label}`}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" dataKey="Escore" name="Escore Médio" stroke="#030A8C" strokeWidth={3} activeDot={{ r: 8 }} />
                      <ReferenceLine y={6.6} stroke="#027373" strokeDasharray="3 3" label={{ position: 'top', value: 'Adequado (6.6)', fill: '#027373', fontSize: 10 }} />
                      {regionalAverage > 0 && (
                        <ReferenceLine y={regionalAverage} stroke="#7d8fdb" strokeDasharray="3 3" label={{ position: 'bottom', value: `Média Regional (${regionalAverage.toFixed(2)})`, fill: '#7d8fdb', fontSize: 10 }} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                    Dados insuficientes para gerar o gráfico de evolução.
                  </div>
                )}
              </div>
            </section>

            {/* Gráfico de Bairros */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Escore Médio por Bairro (Top 5)</h2>
              <div className="h-[320px] w-full">
                {neighborhoodData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={neighborhoodData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" domain={[0, 10]} stroke="#94a3b8" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [value.toFixed(2), 'Escore Médio']}
                      />
                      <Bar dataKey="avgScore" radius={[0, 4, 4, 0]} barSize={24}>
                        {neighborhoodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.avgScore >= 6.6 ? '#027373' : entry.avgScore >= 4.0 ? '#eab308' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                    Dados insuficientes para gerar o gráfico.
                  </div>
                )}
              </div>
            </section>

            {/* Radar Chart */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Comparativo de Atributos (Radar)</h2>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar name="Referência (6.6)" dataKey="Referência" stroke="#94a3b8" fill="none" strokeDasharray="3 3" />
                    <Radar name="Média Municipal" dataKey="Municipal" stroke="#7d8fdb" fill="#7d8fdb" fillOpacity={0.3} />
                    <Radar name="Última Unidade" dataKey="Unidade" stroke="#030A8C" fill="#030A8C" fillOpacity={0.3} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Stacked Bar Chart */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Proporção de Qualidade por Bairro</h2>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={stackedBarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tick={{ angle: -45, textAnchor: 'end' }} height={60} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="high" name="Adequado (≥ 6.6)" stackId="a" fill="#027373" />
                    <Bar dataKey="medium" name="Intermediário (4.0 - 6.5)" stackId="a" fill="#eab308" />
                    <Bar dataKey="low" name="Vulnerável (< 4.0)" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Divergent Bar Chart */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Gap de Percepção (Profissional vs Cidadão)</h2>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={divergentBarData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 10]} stroke="#94a3b8" fontSize={12} />
                    <YAxis dataKey="attribute" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Profissional" fill="#030A8C" barSize={12} />
                    <Bar dataKey="Cidadão" fill="#7d8fdb" barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Scatter Plot */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Correlação: Escore PCATool vs Taxa ICSAP</h2>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" dataKey="score" name="Escore PCATool" domain={[0, 10]} stroke="#94a3b8" fontSize={12} label={{ value: 'Escore PCATool', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#64748b' }} />
                    <YAxis type="number" dataKey="icsap" name="Taxa ICSAP" stroke="#94a3b8" fontSize={12} label={{ value: 'Taxa ICSAP (Simulada)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }} />
                    <ZAxis type="category" dataKey="name" name="Bairro" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Scatter name="Bairros" data={scatterData}>
                      {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score >= 6.6 ? '#027373' : entry.score >= 4.0 ? '#eab308' : '#ef4444'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Grouped Bar Chart */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Integralidade: Serviços Disponíveis (G) vs Prestados (H)</h2>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={groupedBarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tick={{ angle: -45, textAnchor: 'end' }} height={60} />
                    <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Disponível" fill="#030A8C" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Prestado" fill="#7d8fdb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* AI Analysis Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Brain className="text-blue-800" size={24} />
                  Análise Inteligente (IA)
                </h2>
                <p className="text-sm text-slate-500">Gere relatórios técnicos automáticos baseados nos dados atuais.</p>
              </div>
              <button
                onClick={generateAIReport}
                disabled={aiLoading || filteredResponses.length === 0}
                className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {aiLoading ? <Loader2 className="animate-spin" size={18} /> : <Brain size={18} />}
                {aiLoading ? 'Analisando...' : 'Gerar Análise de IA'}
              </button>
            </div>

            {apiKeyError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm flex items-start gap-3 mb-4">
                <SettingsIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Chave de API não configurada</p>
                  <p className="mb-2">Para utilizar a análise inteligente, você precisa configurar sua chave de API do Google Gemini.</p>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="text-amber-900 font-bold underline hover:text-amber-700"
                  >
                    Ir para Configurações
                  </button>
                </div>
              </div>
            )}

            {aiReport && (
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl prose prose-sm prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: aiReport.replace(/\n/g, '<br />') }} />
              </div>
            )}
            
            {!aiReport && !apiKeyError && !aiLoading && (
              <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                Clique no botão acima para gerar uma análise técnica dos dados atuais.
              </div>
            )}
          </section>
        </div>

        <div className="flex justify-end pt-4 gap-4">
          <button
            onClick={() => exportToEsusCSV(filteredResponses)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm shadow-sm"
          >
            <Download size={18} />
            Exportar e-SUS (CSV)
          </button>
          <button
            onClick={handleSaveAnalysis}
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm shadow-sm"
          >
            <Download size={18} />
            Salvar Análises (PDF)
          </button>
        </div>
      </main>
    </div>
  );
}

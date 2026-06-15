import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Info, MapPin, CheckCircle2, ChevronLeft, ChevronRight, WifiOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { calculatePCAToolScore } from '../lib/calculator';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { 
  QUESTIONS_CRIANCA_EXTENSA,
  QUESTIONS_CRIANCA_REDUZIDA,
  QUESTIONS_ADULTO_EXTENSA,
  QUESTIONS_ADULTO_REDUZIDA,
  QUESTIONS_PROFISSIONAL_EXTENSA,
  QUESTIONS_BUCAL_EXTENSA,
  Question 
} from '../constants/questions';

export function Questionnaire() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isOnline, saveOfflineResponse } = useOfflineSync();
  const state = location.state as any;
  const inventory = state?.inventory;
  const targetGroup = state?.targetGroup || 'Adulto';
  const version = state?.version || 'Reduzida';
  const serviceType = inventory?.serviceType || 'geral';

  // Determine which questions to use
  let QUESTIONS: Question[] = [];
  if (targetGroup === 'Criança') {
    if (version === 'Extensa') {
      QUESTIONS = QUESTIONS_CRIANCA_EXTENSA;
    } else {
      QUESTIONS = QUESTIONS_CRIANCA_REDUZIDA;
    }
  } else if (targetGroup === 'Adulto') {
    if (version === 'Extensa') {
      QUESTIONS = QUESTIONS_ADULTO_EXTENSA;
    } else {
      QUESTIONS = QUESTIONS_ADULTO_REDUZIDA;
    }
  } else if (targetGroup === 'Profissional') {
    QUESTIONS = QUESTIONS_PROFISSIONAL_EXTENSA;
  } else if (targetGroup === 'Bucal') {
    QUESTIONS = QUESTIONS_BUCAL_EXTENSA;
  }

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | string)[]>(Array(QUESTIONS.length).fill(0));
  const [textValue, setTextValue] = useState('');
  const [gpsLocation, setGpsLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Reset text value when moving to a new question
    const currentAnswer = answers[currentQ];
    if (typeof currentAnswer === 'string') {
      setTextValue(currentAnswer);
    } else {
      setTextValue('');
    }
  }, [currentQ]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setGpsLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  const getNextQuestionIndex = (currentIndex: number, currentAnswers: (number | string)[]) => {
    const q = QUESTIONS[currentIndex];
    const getIdx = (code: string) => QUESTIONS.findIndex(item => item.code === code);

    const safeIdx = (code: string, fallback: number) => {
      const idx = getIdx(code);
      return idx !== -1 ? idx : fallback;
    };

    if (targetGroup !== 'Profissional') {
      if (q.code === 'A1' && (currentAnswers[currentIndex] === 2 || currentAnswers[currentIndex] === 9)) return safeIdx('A2', currentIndex + 1);
      if (q.code === 'A1.2') return safeIdx('A2', currentIndex + 1);
      
      if (q.code === 'A2') {
        const a2 = currentAnswers[currentIndex];
        if (a2 === 2 || a2 === 9 || a2 === 1) return safeIdx('A3', currentIndex + 1);
        if (a2 === 3) return safeIdx('A2.1', currentIndex + 1);
      }
      if (q.code === 'A2.2') return safeIdx('A3', currentIndex + 1);
      
      if (q.code === 'A3') {
        const a3 = currentAnswers[currentIndex];
        if (a3 === 2 || a3 === 9) {
          const a1Idx = getIdx('A1');
          const a2Idx = getIdx('A2');
          const a1 = a1Idx !== -1 ? currentAnswers[a1Idx] : null;
          const a2 = a2Idx !== -1 ? currentAnswers[a2Idx] : null;
          if ((a1 === 2 || a1 === 9) && (a2 === 2 || a2 === 9)) return safeIdx('A4', currentIndex + 1);
          return safeIdx('A5', currentIndex + 1);
        }
        if (a3 === 1 || a3 === 4 || a3 === 5) return safeIdx('A5', currentIndex + 1);
        if (a3 === 3) return safeIdx('A3.1', currentIndex + 1);
      }
      if (q.code === 'A3.2') return safeIdx('A5', currentIndex + 1);
      if (q.code === 'A4') return safeIdx('A4.1', currentIndex + 1);
      if (q.code === 'A4.1') return safeIdx('A5', currentIndex + 1);
      if (q.code === 'A5') return safeIdx('B1', currentIndex + 1);
    }
    
    if (q.code === 'E1' && (currentAnswers[currentIndex] === 2 || currentAnswers[currentIndex] === 9)) {
      const nextIdx = QUESTIONS.findIndex((item, idx) => idx > currentIndex && !item.code.startsWith('E'));
      return nextIdx !== -1 ? nextIdx : currentIndex + 1;
    }

    return currentIndex + 1;
  };

  const getPrevQuestionIndex = (currentIndex: number, currentAnswers: (number | string)[]) => {
    const q = QUESTIONS[currentIndex];
    const getIdx = (code: string) => QUESTIONS.findIndex(item => item.code === code);

    const safeIdx = (code: string, fallback: number) => {
      const idx = getIdx(code);
      return idx !== -1 ? idx : fallback;
    };

    if (targetGroup !== 'Profissional') {
      if (q.code === 'A2') {
        const a1Idx = getIdx('A1');
        const a1 = a1Idx !== -1 ? currentAnswers[a1Idx] : null;
        if (a1 === 2 || a1 === 9) return safeIdx('A1', currentIndex - 1);
        return safeIdx('A1.2', currentIndex - 1);
      }

      if (q.code === 'A3') {
        const a2Idx = getIdx('A2');
        const a2 = a2Idx !== -1 ? currentAnswers[a2Idx] : null;
        if (a2 === 2 || a2 === 9 || a2 === 1) return safeIdx('A2', currentIndex - 1);
        return safeIdx('A2.2', currentIndex - 1);
      }

      if (q.code === 'A4') return safeIdx('A3', currentIndex - 1);
      if (q.code === 'A4.1') return safeIdx('A4', currentIndex - 1);
      
      if (q.code === 'A5') {
        const a3Idx = getIdx('A3');
        const a3 = a3Idx !== -1 ? currentAnswers[a3Idx] : null;
        if (a3 === 3) return safeIdx('A3.2', currentIndex - 1);
        
        const a1Idx = getIdx('A1');
        const a2Idx = getIdx('A2');
        const a1 = a1Idx !== -1 ? currentAnswers[a1Idx] : null;
        const a2 = a2Idx !== -1 ? currentAnswers[a2Idx] : null;
        
        if ((a1 === 2 || a1 === 9) && (a2 === 2 || a2 === 9) && (a3 === 2 || a3 === 9)) return safeIdx('A4.1', currentIndex - 1);
        return safeIdx('A3', currentIndex - 1);
      }

      if (q.code === 'B1') return safeIdx('A5', currentIndex - 1);
    }

    const prevQ = QUESTIONS[currentIndex - 1];
    if (prevQ && prevQ.code.startsWith('E') && prevQ.code !== 'E1') {
      const e1Idx = getIdx('E1');
      const e1 = e1Idx !== -1 ? currentAnswers[e1Idx] : null;
      if (e1 === 2 || e1 === 9) return e1Idx;
    }

    return currentIndex - 1;
  };

  const handleAnswer = (value: number | string) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = value;
    setAnswers(newAnswers);
    
    const q = QUESTIONS[currentQ];

    // Auto advance after a short delay for non-text questions
    if (q.type !== 'text' && currentQ < QUESTIONS.length - 1) {
      setTimeout(() => {
        const nextQ = getNextQuestionIndex(currentQ, newAnswers);
        if (nextQ !== -1 && nextQ < QUESTIONS.length) {
          setCurrentQ(nextQ);
        }
      }, 300);
    }
  };

  const isQuestionSkipped = (index: number, currentAnswers: (number | string)[]) => {
    const q = QUESTIONS[index];
    const getIdx = (code: string) => QUESTIONS.findIndex(item => item.code === code);

    if (q.code === 'A1.1' || q.code === 'A1.2') {
      const a1 = currentAnswers[getIdx('A1')];
      if (a1 === 2 || a1 === 9) return true;
    }

    if (q.code === 'A2.1' || q.code === 'A2.2') {
      const a2 = currentAnswers[getIdx('A2')];
      if (a2 === 1 || a2 === 2 || a2 === 9) return true;
    }

    if (q.code === 'A3.1' || q.code === 'A3.2') {
      const a3 = currentAnswers[getIdx('A3')];
      if (a3 !== 3) return true;
    }

    if (q.code === 'A4' || q.code === 'A4.1') {
      const a1 = currentAnswers[getIdx('A1')];
      const a2 = currentAnswers[getIdx('A2')];
      const a3 = currentAnswers[getIdx('A3')];
      if (!((a1 === 2 || a1 === 9) && (a2 === 2 || a2 === 9) && (a3 === 2 || a3 === 9))) return true;
    }

    if (['E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'].includes(q.code)) {
      const e1 = currentAnswers[getIdx('E1')];
      if (e1 === 2 || e1 === 9) return true;
    }

    return false;
  };

  const handleFinish = async (finalAnswers: (number | string)[] = answers) => {
    if (finalAnswers.some((a, i) => {
      if (isQuestionSkipped(i, finalAnswers)) return false;
      return a === 0 || a === '';
    })) {
      alert("Por favor, responda todas as perguntas obrigatórias.");
      return;
    }

    const { score, isHighQuality, components } = calculatePCAToolScore(
      finalAnswers as number[], 
      QUESTIONS,
      version,
      targetGroup
    );
    
    // Prioritize geocoded location from address if available, otherwise use browser GPS
    const finalLat = inventory?.latitude ? parseFloat(inventory.latitude) : gpsLocation?.lat;
    const finalLng = inventory?.longitude ? parseFloat(inventory.longitude) : gpsLocation?.lng;
    
    try {
      // Map components to semantic columns based on target group
      let score_afiliacao = null;
      let score_acesso_utilizacao = null;
      let score_acesso_acessibilidade = null;
      let score_longitudinalidade = null;
      let score_coordenacao_cuidados = null;
      let score_coordenacao_sistemas = null;
      let score_integralidade_disponiveis = null;
      let score_integralidade_prestados = null;
      let score_orientacao_familiar = null;
      let score_orientacao_comunitaria = null;

      if (targetGroup === 'Profissional') {
        score_acesso_acessibilidade = components['A'] || null;
        score_longitudinalidade = components['B'] || null;
        score_coordenacao_cuidados = components['C'] || null;
        score_coordenacao_sistemas = components['D'] || null;
        score_integralidade_disponiveis = components['E'] || null;
        score_integralidade_prestados = components['F'] || null;
        score_orientacao_familiar = components['G'] || null;
        score_orientacao_comunitaria = components['H'] || null;
      } else {
        // Adulto, Criança, Bucal (Pacientes)
        score_afiliacao = components['A'] || null;
        score_acesso_utilizacao = components['B'] || null;
        score_acesso_acessibilidade = components['C'] || null;
        score_longitudinalidade = components['D'] || null;
        score_coordenacao_cuidados = components['E'] || null;
        score_coordenacao_sistemas = components['F'] || null;
        score_integralidade_disponiveis = components['G'] || null;
        score_integralidade_prestados = components['H'] || null;
        score_orientacao_familiar = components['I'] || null;
        score_orientacao_comunitaria = components['J'] || null;
      }

      const responseData = {
        user_id: user?.id,
        health_unit_name: inventory?.healthUnitName,
        registration_number: inventory?.registrationNumber,
        birth_date: inventory?.birthDate,
        age: inventory?.age ? parseInt(inventory.age) : null,
        education_level: inventory?.educationLevel,
        monthly_income: inventory?.monthlyIncome,
        cep: inventory?.cep,
        street: inventory?.street,
        neighborhood: inventory?.neighborhood,
        city: inventory?.city,
        state: inventory?.state,
        distance_to_ubs: inventory?.distanceToUbs,
        transport_mode: inventory?.transportMode,
        service_type: serviceType,
        target_group: targetGroup,
        version: version,
        answers: finalAnswers,
        question_codes: QUESTIONS.map(q => q.code),
        score,
        is_high_quality: isHighQuality,
        components,
        latitude: finalLat,
        longitude: finalLng,
        score_afiliacao,
        score_acesso_utilizacao,
        score_acesso_acessibilidade,
        score_longitudinalidade,
        score_coordenacao_cuidados,
        score_coordenacao_sistemas,
        score_integralidade_disponiveis,
        score_integralidade_prestados,
        score_orientacao_familiar,
        score_orientacao_comunitaria
      };

      if (isOnline) {
        await supabase.from('survey_responses').insert([responseData]);
      } else {
        saveOfflineResponse(responseData);
      }
    } catch (e) {
      console.error("Failed to save response", e);
    }

    navigate('/dashboard', { state: { score, isHighQuality, components, showFeedbackLoop: true } });
  };

  const q = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-blue-100">
        <div className="flex items-center p-4 justify-between w-full">
          <button onClick={() => navigate(-1)} className="text-blue-800 flex w-10 h-10 items-center justify-center rounded-full hover:bg-blue-50 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="text-center flex-1">
            <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">PCATool {version}</h2>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <MapPin size={14} className="text-emerald-600" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {gpsLocation ? `GPS: ${gpsLocation.lat.toFixed(2)}, ${gpsLocation.lng.toFixed(2)}` : 'Buscando GPS...'}
              </span>
              {!isOnline && (
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-amber-600 ml-2">
                  <WifiOff size={12} /> Offline
                </span>
              )}
            </div>
          </div>
          <button className="text-blue-800 flex w-10 h-10 items-center justify-center rounded-full hover:bg-blue-50 transition-colors">
            <Info size={24} />
          </button>
        </div>
        
        <div className="w-full px-4 pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-blue-800 font-bold text-xs uppercase tracking-widest">Módulo {serviceType === 'bucal' ? 'Saúde Bucal' : 'Saúde Geral'}</span>
                <p className="text-slate-900 text-base font-semibold leading-none">{targetGroup}</p>
              </div>
              <p className="text-slate-500 text-xs font-medium italic">Questão {currentQ + 1} de {QUESTIONS.length}</p>
            </div>
            <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
              <div className="h-full rounded-full bg-blue-800 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full p-4 overflow-y-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 mb-6">
          <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider mb-3">Item {currentQ + 1} - {q.code}</span>
          <h3 className="text-slate-900 text-xl font-bold leading-snug mb-4">{q.text}</h3>
          <p className="text-slate-500 text-sm leading-relaxed italic">{q.desc}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-8">
          {q.type === 'text' ? (
            <div className="space-y-4">
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onBlur={() => handleAnswer(textValue)}
                className="w-full p-4 rounded-xl border-2 border-blue-100 focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all min-h-[120px]"
                placeholder="Digite sua resposta aqui..."
              />
              <p className="text-xs text-slate-400 italic">Sua resposta será salva automaticamente ao sair do campo ou clicar em próxima.</p>
            </div>
          ) : q.type === 'filter' ? (
            [
              { val: 1, label: "Sim" },
              { val: 2, label: "Não" },
              { val: 9, label: "Não sei / Não lembro" }
            ].map((option) => (
              <button 
                key={option.val}
                onClick={() => handleAnswer(option.val)}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                  answers[currentQ] === option.val 
                    ? "border-blue-800 bg-blue-50" 
                    : "border-blue-100 bg-white hover:border-blue-800 hover:bg-blue-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "flex w-10 h-10 items-center justify-center rounded-lg font-bold transition-colors",
                    answers[currentQ] === option.val
                      ? "bg-blue-800 text-white"
                      : "bg-blue-100 text-blue-800 group-hover:bg-blue-800 group-hover:text-white"
                  )}>
                    {option.val}
                  </span>
                  <span className="font-medium text-slate-700">{option.label}</span>
                </div>
                <CheckCircle2 className={cn(
                  "transition-opacity",
                  answers[currentQ] === option.val ? "opacity-100 text-blue-800" : "opacity-0 group-hover:opacity-100 text-blue-800"
                )} />
              </button>
            ))
          ) : q.type === 'a2_filter' ? (
            [
              { val: 2, label: "Não" },
              { val: 1, label: "Sim, o(a) mesmo serviço de saúde/médico(a)/enfermeiro(a) referido(a) no item A1" },
              { val: 3, label: "Sim, um(a) serviço de saúde/médico(a)/enfermeiro(a) diferente do(a) referido(a) no item A1" },
              { val: 9, label: "Não sei / Não lembro" }
            ].map((option) => (
              <button 
                key={option.val}
                onClick={() => handleAnswer(option.val)}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                  answers[currentQ] === option.val 
                    ? "border-blue-800 bg-blue-50" 
                    : "border-blue-100 bg-white hover:border-blue-800 hover:bg-blue-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "flex w-10 h-10 items-center justify-center rounded-lg font-bold transition-colors shrink-0",
                    answers[currentQ] === option.val
                      ? "bg-blue-800 text-white"
                      : "bg-blue-100 text-blue-800 group-hover:bg-blue-800 group-hover:text-white"
                  )}>
                    {option.val === 9 ? '?' : option.val === 3 ? '3' : option.val}
                  </span>
                  <span className="font-medium text-slate-700">{option.label}</span>
                </div>
                <CheckCircle2 className={cn(
                  "transition-opacity shrink-0 ml-2",
                  answers[currentQ] === option.val ? "opacity-100 text-blue-800" : "opacity-0 group-hover:opacity-100 text-blue-800"
                )} />
              </button>
            ))
          ) : q.type === 'a3_filter' ? (
            [
              { val: 2, label: "Não" },
              { val: 1, label: "Sim, o(a) mesmo(a) referido(a) nos itens A1 e A2" },
              { val: 4, label: "Sim, somente o(a) mesmo(a) referido(a) no item A1" },
              { val: 5, label: "Sim, somente o(a) mesmo(a) referido(a) no item A2" },
              { val: 3, label: "Sim, diferente do(s) referido(s) nos itens A1 e A2" },
              { val: 9, label: "Não sei / Não lembro" }
            ].map((option) => (
              <button 
                key={option.val}
                onClick={() => handleAnswer(option.val)}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                  answers[currentQ] === option.val 
                    ? "border-blue-800 bg-blue-50" 
                    : "border-blue-100 bg-white hover:border-blue-800 hover:bg-blue-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "flex w-10 h-10 items-center justify-center rounded-lg font-bold transition-colors shrink-0",
                    answers[currentQ] === option.val
                      ? "bg-blue-800 text-white"
                      : "bg-blue-100 text-blue-800 group-hover:bg-blue-800 group-hover:text-white"
                  )}>
                    {option.val === 9 ? '?' : option.val}
                  </span>
                  <span className="font-medium text-slate-700">{option.label}</span>
                </div>
                <CheckCircle2 className={cn(
                  "transition-opacity shrink-0 ml-2",
                  answers[currentQ] === option.val ? "opacity-100 text-blue-800" : "opacity-0 group-hover:opacity-100 text-blue-800"
                )} />
              </button>
            ))
          ) : (
            <>
              {[
                { val: 1, label: "Com certeza não" },
                { val: 2, label: "Provavelmente não" },
                { val: 3, label: "Provavelmente sim" },
                { val: 4, label: "Com certeza sim" }
              ].map((option) => (
                <button 
                  key={option.val}
                  onClick={() => handleAnswer(option.val)}
                  className={cn(
                    "group flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                    answers[currentQ] === option.val 
                      ? "border-blue-800 bg-blue-50" 
                      : "border-blue-100 bg-white hover:border-blue-800 hover:bg-blue-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "flex w-10 h-10 items-center justify-center rounded-lg font-bold transition-colors",
                      answers[currentQ] === option.val
                        ? "bg-blue-800 text-white"
                        : "bg-blue-100 text-blue-800 group-hover:bg-blue-800 group-hover:text-white"
                    )}>
                      {option.val}
                    </span>
                    <span className="font-medium text-slate-700">{option.label}</span>
                  </div>
                  <CheckCircle2 className={cn(
                    "transition-opacity",
                    answers[currentQ] === option.val ? "opacity-100 text-blue-800" : "opacity-0 group-hover:opacity-100 text-blue-800"
                  )} />
                </button>
              ))}
              
              <div className="my-2 border-t border-dashed border-blue-200"></div>
              
              <button 
                onClick={() => handleAnswer(9)}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                  answers[currentQ] === 9
                    ? "border-slate-400 bg-slate-100"
                    : "border-slate-200 bg-slate-50 hover:border-slate-400"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "flex w-10 h-10 items-center justify-center rounded-lg font-bold",
                    answers[currentQ] === 9 ? "bg-slate-400 text-white" : "bg-slate-200 text-slate-600"
                  )}>9</span>
                  <span className="font-medium text-slate-600">Não sei / Não lembro</span>
                </div>
                {answers[currentQ] === 9 && <CheckCircle2 className="text-slate-500" />}
              </button>
            </>
          )}
        </div>

        <div className="flex gap-4 mb-10">
          <button 
            onClick={() => {
              const prevQ = getPrevQuestionIndex(currentQ, answers);
              if (prevQ >= 0) {
                setCurrentQ(prevQ);
              }
            }}
            disabled={currentQ === 0}
            className="flex-1 py-4 px-6 rounded-xl border-2 border-blue-800 text-blue-800 font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} /> Anterior
          </button>
          
          {currentQ < QUESTIONS.length - 1 ? (
            <button 
              onClick={() => {
                const q = QUESTIONS[currentQ];
                let currentAnswers = [...answers];
                if (q.type === 'text') {
                  handleAnswer(textValue);
                  currentAnswers[currentQ] = textValue;
                }
                const nextQ = getNextQuestionIndex(currentQ, currentAnswers);
                if (nextQ !== -1 && nextQ < QUESTIONS.length) {
                  setCurrentQ(nextQ);
                }
              }}
              disabled={q.type === 'text' ? textValue.trim() === '' : answers[currentQ] === 0}
              className="flex-1 py-4 px-6 rounded-xl bg-blue-800 text-white font-bold hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-800/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              onClick={() => {
                let finalAnswers = [...answers];
                if (q.type === 'text') {
                  handleAnswer(textValue);
                  finalAnswers[currentQ] = textValue;
                }
                handleFinish(finalAnswers);
              }}
              disabled={q.type === 'text' ? textValue.trim() === '' : answers[currentQ] === 0}
              className="flex-1 py-4 px-6 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finalizar
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

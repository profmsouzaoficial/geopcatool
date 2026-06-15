import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, UserSquare2, Users, Stethoscope, ArrowRight, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Inventory() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectionState = location.state as { targetGroup: string; version: string } | null;
  
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [healthUnits, setHealthUnits] = useState<{ id: string, name: string }[]>([]);
  const [formData, setFormData] = useState({
    healthUnitName: '',
    registrationNumber: '',
    birthDate: '',
    age: '',
    educationLevel: '',
    monthlyIncome: '',
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    distanceToUbs: '',
    transportMode: '',
    serviceType: selectionState?.targetGroup === 'Bucal' ? 'bucal' : 'geral'
  });

  // Fetch health units from Supabase
  useEffect(() => {
    const fetchHealthUnits = async () => {
      try {
        const { data, error } = await supabase
          .from('health_units')
          .select('id, name')
          .order('name');
          
        if (data && !error) {
          setHealthUnits(data);
        }
      } catch (error) {
        console.error('Error fetching health units:', error);
      }
    };
    
    fetchHealthUnits();
  }, []);

  // Calculate age automatically when birthDate changes
  useEffect(() => {
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.birthDate]);

  // Fetch address from viaCEP when CEP has 8 digits
  useEffect(() => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      const fetchAddress = async () => {
        setIsSearchingCep(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          
          if (!data.erro) {
            const newAddress = {
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf
            };

            setFormData(prev => ({
              ...prev,
              ...newAddress
            }));

            // Geocode the address using Nominatim (OpenStreetMap) - FREE
            try {
              const query = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brasil`;
              const nominatimResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
              );
              const nominatimData = await nominatimResponse.json();
              
              if (nominatimData && nominatimData.length > 0) {
                setFormData(prev => ({
                  ...prev,
                  latitude: nominatimData[0].lat,
                  longitude: nominatimData[0].lon
                }));
              }
            } catch (geoError) {
              console.error('Erro na geocodificação Nominatim:', geoError);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        } finally {
          setIsSearchingCep(false);
        }
      };
      
      fetchAddress();
    }
  }, [formData.cep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/questionnaire', { 
      state: { 
        inventory: formData,
        targetGroup: selectionState?.targetGroup,
        version: selectionState?.version
      } 
    });
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-blue-100 px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-50 transition-colors">
          <ArrowLeft className="text-blue-800" size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900">GeoPCATool</h1>
          <p className="text-xs text-slate-500">Inventário Sócio-Demográfico</p>
        </div>
      </header>

      <main className="w-full px-4 py-6 space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <h2 className="text-base font-semibold text-slate-900">Progresso do Inventário</h2>
            <span className="text-sm font-medium text-blue-800">1 / 4</span>
          </div>
          <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-800 w-1/4 rounded-full"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
              <UserSquare2 className="text-blue-800" size={24} />
              <h3 className="text-xl font-bold text-slate-900">I. Identificação</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Nome da Unidade de Saúde onde está sendo realizada a entrevista *</span>
                <select 
                  name="healthUnitName"
                  value={formData.healthUnitName}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="" disabled>Selecione a Unidade de Saúde</option>
                  {healthUnits.map(unit => (
                    <option key={unit.id} value={unit.name}>{unit.name}</option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Registro *</span>
                <input 
                  type="text" 
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required 
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all" 
                  placeholder="Digite o número do registro" 
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Tipo de Avaliação *</span>
                <select 
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required 
                  disabled={selectionState?.targetGroup === 'Bucal'}
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="bucal">Saúde Bucal</option>
                  <option value="geral">Saúde Geral</option>
                </select>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
              <Users className="text-blue-800" size={24} />
              <h3 className="text-xl font-bold text-slate-900">II. Perfil sociodemográfico</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Data de Nascimento *</span>
                <input 
                  type="date" 
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required 
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all" 
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Idade *</span>
                <input 
                  type="number" 
                  name="age"
                  value={formData.age}
                  readOnly
                  required 
                  placeholder="00" 
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed" 
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Escolaridade *</span>
                <select 
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  required 
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Fundamental incompleto">Fundamental incompleto</option>
                  <option value="Fundamental completo">Fundamental completo</option>
                  <option value="Médio incompleto">Médio incompleto</option>
                  <option value="Médio completo">Médio completo</option>
                  <option value="Superior incompleto">Superior incompleto</option>
                  <option value="Superior completo">Superior completo</option>
                  <option value="Pós-graduação">Pós-graduação</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Renda familiar mensal *</span>
                <select 
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  required 
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Até 1 SM">Até 1 SM</option>
                  <option value="1-2 SM">1-2 SM</option>
                  <option value="2-3 SM">2-3 SM</option>
                  <option value="3-5 SM">3-5 SM</option>
                  <option value="Mais de 5 SM">Mais de 5 SM</option>
                </select>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
              <MapPin className="text-blue-800" size={24} />
              <h3 className="text-xl font-bold text-slate-900">III. Localização</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">CEP *</span>
                <div className="relative">
                  <input 
                    type="text" 
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    required 
                    maxLength={9}
                    placeholder="00000-000" 
                    className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all" 
                  />
                  {isSearchingCep && (
                    <div className="absolute right-3 top-3">
                      <Loader2 className="animate-spin text-blue-800" size={20} />
                    </div>
                  )}
                </div>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Bairro *</span>
                <input 
                  type="text" 
                  name="neighborhood"
                  value={formData.neighborhood}
                  readOnly
                  required 
                  placeholder="Preenchido via CEP" 
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed" 
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Rua *</span>
                <input 
                  type="text" 
                  name="street"
                  value={formData.street}
                  readOnly
                  required 
                  placeholder="Preenchido via CEP" 
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed" 
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Cidade/UF *</span>
                <input 
                  type="text" 
                  value={formData.city ? `${formData.city} - ${formData.state}` : ''}
                  readOnly
                  required 
                  placeholder="Preenchido via CEP" 
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed" 
                />
              </label>
              {formData.latitude && (
                <div className="md:col-span-2 flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                  <MapPin size={14} />
                  <span>Localização capturada: {formData.latitude}, {formData.longitude}</span>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
              <Stethoscope className="text-blue-800" size={24} />
              <h3 className="text-xl font-bold text-slate-900">IV. Acesso a Serviços</h3>
            </div>
            <div className="space-y-6">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Distância até a UBS mais próxima *</span>
                <select 
                  name="distanceToUbs"
                  value={formData.distanceToUbs}
                  onChange={handleChange}
                  required 
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Menos de 500m">Menos de 500m</option>
                  <option value="500m-1km">500m-1km</option>
                  <option value="1-2km">1-2km</option>
                  <option value="Mais de 2km">Mais de 2km</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Meio de transporte usual para serviços de saúde *</span>
                <select 
                  name="transportMode"
                  value={formData.transportMode}
                  onChange={handleChange}
                  required 
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none transition-all"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="A pé">A pé</option>
                  <option value="Transporte público">Transporte público</option>
                  <option value="Veículo próprio">Veículo próprio</option>
                  <option value="Outro">Outro</option>
                </select>
              </label>
            </div>
          </section>

          <div className="pt-4 pb-12">
            <button type="submit" className="w-full h-14 bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-800/20 hover:bg-blue-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <span>Continuar para o Questionário</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

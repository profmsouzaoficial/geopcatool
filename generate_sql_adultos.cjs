const fs = require('fs');
const Papa = require('papaparse');
const crypto = require('crypto');

// The CSV file content
const csvContent = fs.readFileSync('dados.csv', 'utf-8');

const parsed = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true
});

const rows = parsed.data;

// Generate UUIDs
function uuidv4() {
  return crypto.randomUUID();
}

// Helper to parse Likert answers
function parseAnswer(str) {
  if (!str) return 0;
  if (typeof str !== 'string') return 0;
  
  // Handle A1, A2, A3 specific text answers
  if (str.includes('Sim  (Siga para A1.1)') || str.includes('Sim (Siga para A1.1)')) return 4;
  if (str.includes('Não (Passe para A2)') || str.includes('Não (Passe para A3)') || str.includes('Não (Passe para ‘AFILIAÇÃO’)')) return 1;
  if (str.includes('Sim, o(a) mesmo serviço de saúde bucal/dentista referido(a) no item A1')) return 4;
  if (str.includes('Sim, um(a) serviço de saúde bucal/dentista diferente')) return 3;
  if (str.includes('Sim, o(a) mesmo(a) referido(a) nos itens A1 e A2')) return 4;
  if (str.includes('Sim, somente o(a) mesmo(a) referido(a) no item A1')) return 4;
  if (str.includes('Sim, somente o(a) mesmo(a) referido(a) no item A2')) return 4;

  const match = str.match(/^\((\d)\)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

// We need to map the questions to components for ADULTO EXTENSA
// The CSV headers are different for Adulto
// A1 to A7 -> A (Acesso - Acessibilidade)
// B1 to B13 -> B (Longitudinalidade)
// C1 to C5 -> C (Coordenação - Integração de Cuidados)
// D1 to D3 -> D (Coordenação - Sistemas de Informação)
// E1 to E23 -> E (Integralidade - Serviços Disponíveis)
// F1 to F7 -> F (Integralidade - Serviços Prestados)
// G1 to G4 -> G (Orientação Familiar)
// H1 to H13 -> H (Orientação Comunitária)
// I1 to I6 -> I (Competência Cultural)

const components = {
  A: ['A1', 'A2', 'A3'],
  B: ['B1', 'B2', 'B3'],
  C: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12'],
  D: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15'],
  E: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'],
  F: ['F1', 'F2', 'F3'],
  G: ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16', 'G17', 'G18', 'G19', 'G20', 'G21', 'G22', 'G23'],
  H: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9'],
  I: ['I1', 'I2', 'I3'],
  J: ['J1', 'J2', 'J3', 'J4', 'J5', 'J6']
};

// Negative items for Adulto
const negativeItems = ['A7', 'C9', 'C10', 'C11', 'C12', 'D14', 'D15'];

let sql = `INSERT INTO survey_responses (
  id, created_at, registration_number, birth_date, age, education_level, monthly_income,
  service_type, target_group, version, answers, question_codes, score, is_high_quality,
  components, score_afiliacao, score_acesso_utilizacao, score_acesso_acessibilidade,
  score_longitudinalidade, score_coordenacao_cuidados, score_coordenacao_sistemas,
  score_integralidade_disponiveis, score_integralidade_prestados, score_orientacao_familiar,
  score_orientacao_comunitaria
) VALUES \n`;

const values = [];

for (const row of rows) {
  const id = uuidv4();
  
  // Parse date
  const timestampStr = row['Timestamp'];
  let created_at = new Date().toISOString();
  if (timestampStr) {
    const [datePart, timePart] = timestampStr.split(' ');
    const [m, d, y] = datePart.split('/');
    created_at = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')} ${timePart}`;
  }

  const registration_number = row['Registro: '] || row['Registro:'] || null;
  
  let birth_date = null;
  const birthDateStr = row['Data de Nascimento: '] || row['Data de Nascimento:'];
  if (birthDateStr) {
    const parts = birthDateStr.split('/');
    if (parts.length === 3) {
      birth_date = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }
  }

  const ageStr = row['Idade: '] || row['Idade:'];
  const age = ageStr ? parseInt(ageStr.replace(/\D/g, ''), 10) : null;
  
  const education_level = row['Escolaridade: '] || row['Escolaridade:'] || null;
  const monthly_income = row['Renda familiar (mensal): '] || row['Renda familiar (mensal):'] || null;
  const service_type = row['Nome da Unidade de Saúde onde está sendo realizada a entrevista'] || null;

  // Extract answers
  const answers = [];
  const question_codes = [];
  
  const processed = {};

  for (const comp of Object.keys(components)) {
    for (const code of components[comp]) {
      // Find the column that starts with the code
      const colName = Object.keys(row).find(k => k.startsWith(code + '.') || k === code);
      if (colName) {
        const val = parseAnswer(row[colName]);
        answers.push(val);
        question_codes.push(code);
        
        let calcVal = val;
        if (calcVal === 9) calcVal = 2; // Rule: 9 becomes 2
        
        if (negativeItems.includes(code) && calcVal !== 0) {
          if (calcVal === 4) calcVal = 1;
          else if (calcVal === 3) calcVal = 2;
          else if (calcVal === 2) calcVal = 3;
          else if (calcVal === 1) calcVal = 4;
        }
        
        processed[code] = { original: val, calc: calcVal };
      }
    }
  }

  // Calculate scores
  const componentScores = {};
  for (const comp of Object.keys(components)) {
    const codes = components[comp];
    const items = codes.map(c => processed[c]).filter(p => p && p.calc !== 0);
    
    if (items.length === 0) continue;
    
    const nines = items.filter(p => p.original === 9).length;
    if (nines >= items.length / 2) {
      continue; // Missing
    }
    
    const sum = items.reduce((acc, curr) => acc + curr.calc, 0);
    componentScores[comp] = sum / items.length;
  }

  // Special calculation for Afiliação (A) for patients
  let scoreA = null;
  const a1 = processed['A1']?.calc;
  const a2 = processed['A2']?.calc;
  const a3 = processed['A3']?.calc;

  if (a1 === 1) {
    scoreA = 1;
  } else if (a1 >= 2 && a2 === 1 && a3 === 1) {
    scoreA = 2;
  } else if (a1 >= 2 && a2 >= 2 && a3 === 1) {
    scoreA = 3;
  } else if (a1 >= 2 && a2 >= 2 && a3 >= 2) {
    scoreA = 4;
  } else if (a1 >= 2 && a2 === 1 && a3 >= 2) {
    scoreA = 3;
  }
  
  if (scoreA !== null) {
    componentScores['A'] = scoreA;
  }

  // Essential score: A, B, C, D, E, F, G, H
  const essentialKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const validEssential = essentialKeys.map(k => componentScores[k]).filter(s => s !== undefined);
  const essentialMean = validEssential.length > 0 ? validEssential.reduce((a, b) => a + b, 0) / validEssential.length : 0;

  // General score: A, B, C, D, E, F, G, H, I, J
  const generalKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const validGeneral = generalKeys.map(k => componentScores[k]).filter(s => s !== undefined);
  const generalMean = validGeneral.length > 0 ? validGeneral.reduce((a, b) => a + b, 0) / validGeneral.length : 0;

  const finalScore = ((generalMean - 1) / 3) * 10;
  const is_high_quality = finalScore >= 6.6;

  const componentsJson = {};
  for (const [k, v] of Object.entries(componentScores)) {
    componentsJson[k] = Number(((v - 1) / 3 * 10).toFixed(2));
  }

  const escapeStr = (str) => str ? "'" + str.replace(/'/g, "''") + "'" : "NULL";

  values.push(`(
    '${id}', '${created_at}', ${escapeStr(registration_number)}, ${escapeStr(birth_date)}, ${age !== null ? age : 'NULL'}, ${escapeStr(education_level)}, ${escapeStr(monthly_income)},
    ${escapeStr(service_type)}, 'Adulto', 'Extensa', '${JSON.stringify(answers)}', '${JSON.stringify(question_codes)}', ${finalScore.toFixed(2)}, ${is_high_quality},
    '${JSON.stringify(componentsJson)}', 
    ${componentsJson['A'] !== undefined ? componentsJson['A'] : 'NULL'}, -- score_afiliacao
    ${componentsJson['B'] !== undefined ? componentsJson['B'] : 'NULL'}, -- score_acesso_utilizacao
    ${componentsJson['C'] !== undefined ? componentsJson['C'] : 'NULL'}, -- score_acesso_acessibilidade
    ${componentsJson['D'] !== undefined ? componentsJson['D'] : 'NULL'}, -- score_longitudinalidade
    ${componentsJson['E'] !== undefined ? componentsJson['E'] : 'NULL'}, -- score_coordenacao_cuidados
    ${componentsJson['F'] !== undefined ? componentsJson['F'] : 'NULL'}, -- score_coordenacao_sistemas
    ${componentsJson['G'] !== undefined ? componentsJson['G'] : 'NULL'}, -- score_integralidade_disponiveis
    ${componentsJson['H'] !== undefined ? componentsJson['H'] : 'NULL'}, -- score_integralidade_prestados
    ${componentsJson['I'] !== undefined ? componentsJson['I'] : 'NULL'}, -- score_orientacao_familiar
    ${componentsJson['J'] !== undefined ? componentsJson['J'] : 'NULL'}  -- score_orientacao_comunitaria
  )`);
}

sql += values.join(',\n') + ';';

fs.writeFileSync('insert_data_adultos.sql', sql);
console.log('SQL generated successfully for adultos.');

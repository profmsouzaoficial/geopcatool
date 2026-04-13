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
  const match = str.match(/^\((\d)\)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

// We need to map the questions to components
// A1 to A7 -> A
// B1 to B13 -> B
// C1 to C5 -> C
// D1 to D3 -> D
// E1 to E23 -> E
// F1 to F7 -> F
// G1 to G4 -> G
// H1 to H13 -> H
// I1 to I6 -> I

const components = {
  A: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'],
  B: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13'],
  C: ['C1', 'C2', 'C3', 'C4', 'C5'],
  D: ['D1', 'D2', 'D3'],
  E: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18', 'E19', 'E20', 'E21', 'E22', 'E23'],
  F: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'],
  G: ['G1', 'G2', 'G3', 'G4'],
  H: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13'],
  I: ['I1', 'I2', 'I3', 'I4', 'I5', 'I6']
};

// Negative items for Professional Bucal?
// A7: "Na média, os pacientes precisam esperar mais de 30 minutos..."
const negativeItems = ['A7'];

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
  // Timestamp format: 6/16/2025 14:42:58
  const timestampStr = row['Timestamp'];
  let created_at = new Date().toISOString();
  if (timestampStr) {
    const [datePart, timePart] = timestampStr.split(' ');
    const [m, d, y] = datePart.split('/');
    created_at = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')} ${timePart}`;
  }

  const registration_number = row['Registro (CRO, CPF, ETC):'] || null;
  
  // Birth date: 3/3/1967
  let birth_date = null;
  if (row['Data de Nascimento']) {
    const parts = row['Data de Nascimento'].split('/');
    if (parts.length === 3) {
      birth_date = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }
  }

  const ageStr = row['Idade'] ? row['Idade'].replace(/\D/g, '') : null;
  const age = ageStr ? parseInt(ageStr, 10) : null;
  
  const education_level = row['Escolaridade'] || null;
  const monthly_income = row['Renda familiar (mensal)'] || null;

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

  // Essential score: A, B, C, D, E, F
  const essentialKeys = ['A', 'B', 'C', 'D', 'E', 'F'];
  const validEssential = essentialKeys.map(k => componentScores[k]).filter(s => s !== undefined);
  const essentialMean = validEssential.length > 0 ? validEssential.reduce((a, b) => a + b, 0) / validEssential.length : 0;

  // General score: A, B, C, D, E, F, G, H, I
  const generalKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const validGeneral = generalKeys.map(k => componentScores[k]).filter(s => s !== undefined);
  const generalMean = validGeneral.length > 0 ? validGeneral.reduce((a, b) => a + b, 0) / validGeneral.length : 0;

  const finalScore = ((generalMean - 1) / 3) * 10;
  const is_high_quality = finalScore >= 6.6;

  const componentsJson = {};
  for (const [k, v] of Object.entries(componentScores)) {
    componentsJson[k] = Number(((v - 1) / 3 * 10).toFixed(2));
  }

  const escapeStr = (str) => str ? "'" + str.replace(/'/g, "''") + "'" : "NULL";
  
  const service_type = row['Nome da Unidade de Saúde onde está sendo realizada a entrevista'] || null;

  values.push(`(
    '${id}', '${created_at}', ${escapeStr(registration_number)}, ${escapeStr(birth_date)}, ${age !== null ? age : 'NULL'}, ${escapeStr(education_level)}, ${escapeStr(monthly_income)},
    ${escapeStr(service_type)}, 'Profissional', 'Extensa', '${JSON.stringify(answers)}', '${JSON.stringify(question_codes)}', ${finalScore.toFixed(2)}, ${is_high_quality},
    '${JSON.stringify(componentsJson)}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    ${componentsJson['A'] !== undefined ? componentsJson['A'] : 'NULL'}, -- score_acesso_acessibilidade
    ${componentsJson['B'] !== undefined ? componentsJson['B'] : 'NULL'}, -- score_longitudinalidade
    ${componentsJson['C'] !== undefined ? componentsJson['C'] : 'NULL'}, -- score_coordenacao_cuidados
    ${componentsJson['D'] !== undefined ? componentsJson['D'] : 'NULL'}, -- score_coordenacao_sistemas
    ${componentsJson['E'] !== undefined ? componentsJson['E'] : 'NULL'}, -- score_integralidade_disponiveis
    ${componentsJson['F'] !== undefined ? componentsJson['F'] : 'NULL'}, -- score_integralidade_prestados
    ${componentsJson['G'] !== undefined ? componentsJson['G'] : 'NULL'}, -- score_orientacao_familiar
    ${componentsJson['H'] !== undefined ? componentsJson['H'] : 'NULL'}  -- score_orientacao_comunitaria
  )`);
}

sql += values.join(',\n') + ';';

fs.writeFileSync('insert_data.sql', sql);
console.log('SQL generated successfully.');

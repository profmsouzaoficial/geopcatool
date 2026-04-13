INSERT INTO survey_responses (
  id, created_at, registration_number, birth_date, age, education_level, monthly_income,
  service_type, target_group, version, answers, question_codes, score, is_high_quality,
  components, score_afiliacao, score_acesso_utilizacao, score_acesso_acessibilidade,
  score_longitudinalidade, score_coordenacao_cuidados, score_coordenacao_sistemas,
  score_integralidade_disponiveis, score_integralidade_prestados, score_orientacao_familiar,
  score_orientacao_comunitaria
) VALUES 
(
    'd8f764cb-6139-476d-9639-fd083e51ff05', '2025-06-16 14:42:58', '035365 - ', '1967-03-03', 58, '3 Grau e Ensino Superior ', '10 salários mínimos',
    'ESF São Paulo 1 e 2', 'Profissional', 'Extensa', '[3,4,1,1,1,3,1,4,4,4,1,4,4,4,4,3,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,3,3,4,4,4,4,4,4,1,1,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,1,1,1,1,4,9,1,1,1,3,4,4,4,3,4,4,3]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 8.19, true,
    '{"A":4.76,"B":8.97,"C":10,"D":8.89,"E":8.84,"F":9.52,"G":10,"H":3.85,"I":8.89}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    4.76, -- score_acesso_acessibilidade
    8.97, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    8.89, -- score_coordenacao_sistemas
    8.84, -- score_integralidade_disponiveis
    9.52, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    3.85  -- score_orientacao_comunitaria
  ),
(
    '228a418f-5bed-4e6f-8d2f-1a6ef14e7915', '2025-06-23 13:58:31', 'MG 10000629', '1953-12-01', 71, 'Pós Graduado ', '10 salários mínimos',
    'ESF Lurdes', 'Profissional', 'Extensa', '[4,3,1,1,1,3,3,4,4,4,3,4,4,1,1,3,4,1,4,4,4,4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,4,1,1,4,4,1,1,1,1,4,1,1,1,1,1,4,4,1,1,3,1]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 6.78, true,
    '{"A":3.81,"B":7.18,"C":10,"D":6.67,"E":9.13,"F":10,"G":7.5,"H":2.31,"I":4.44}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    3.81, -- score_acesso_acessibilidade
    7.18, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    6.67, -- score_coordenacao_sistemas
    9.13, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    7.5, -- score_orientacao_familiar
    2.31  -- score_orientacao_comunitaria
  ),
(
    '062c2f18-9143-4667-bfd8-70bb3f776f15', '2025-06-24 8:28:24', '23736', '1954-05-19', 51, 'Ensino médio completo ', '6 Salários mínimos',
    'ESF JK 1 e 2 ', 'Profissional', 'Extensa', '[4,4,1,1,1,4,1,4,4,4,1,4,4,4,1,1,4,4,1,4,1,1,1,1,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,4,4,1,1,3,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5"]', 7.15, true,
    '{"A":5.71,"B":6.92,"C":2,"D":6.67,"E":10,"F":10,"G":10,"H":7.69,"I":5.33}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    5.71, -- score_acesso_acessibilidade
    6.92, -- score_longitudinalidade
    2, -- score_coordenacao_cuidados
    6.67, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    7.69  -- score_orientacao_comunitaria
  ),
(
    '5f2ddeb2-e3c5-44cb-802f-f39d7c54259e', '2025-06-25 15:05:21', 'MG 50133', '1993-07-01', 31, 'Superior completo ', '6 salários mínimos',
    'ESF Santa Teresinha', 'Profissional', 'Extensa', '[4,4,4,1,1,4,3,4,4,4,4,4,4,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,4,4,4,4,4,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5"]', 9.26, true,
    '{"A":6.19,"B":9.49,"C":10,"D":10,"E":10,"F":10,"G":10,"H":7.69,"I":10}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    6.19, -- score_acesso_acessibilidade
    9.49, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    7.69  -- score_orientacao_comunitaria
  ),
(
    '4f76600f-00d4-494a-9961-b29fa4a153d4', '2025-08-12 13:16:40', '074405', '2002-01-11', 23, 'Superior completo ', '7 Salários Mínimos',
    'ESF Santos Dumont 1 e 2 ', 'Profissional', 'Extensa', '[4,4,9,1,1,4,4,4,4,4,3,4,4,3,1,1,3,1,4,3,4,4,4,4,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,3,4,1,4,4,1,4,4,4,9,4,4,4,1,4,4,3,4,3,1,4,4,4,3,4,4,4,1,9,9,3,4,9,1,4,4,4,4,9]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 6.94, true,
    '{"A":4.76,"B":6.67,"C":8,"D":6.67,"E":8.55,"F":7.62,"G":5.83,"H":7.18,"I":7.22}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    4.76, -- score_acesso_acessibilidade
    6.67, -- score_longitudinalidade
    8, -- score_coordenacao_cuidados
    6.67, -- score_coordenacao_sistemas
    8.55, -- score_integralidade_disponiveis
    7.62, -- score_integralidade_prestados
    5.83, -- score_orientacao_familiar
    7.18  -- score_orientacao_comunitaria
  ),
(
    '394b6a0b-0e3e-433a-8da8-669aebe73186', '2025-08-12 14:02:40', '45217', '1996-09-17', 38, 'Superior completo', '4 salários mínimos',
    'ESF Sir 1 e 2', 'Profissional', 'Extensa', '[4,1,3,1,1,4,4,4,4,4,1,4,4,4,3,4,4,2,1,4,4,4,3,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,1,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,1,4,4,2,1,4,1,1,4,4,3,4,4,4,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 8.31, true,
    '{"A":3.81,"B":7.69,"C":8.67,"D":10,"E":8.99,"F":10,"G":10,"H":6.15,"I":9.44}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    3.81, -- score_acesso_acessibilidade
    7.69, -- score_longitudinalidade
    8.67, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    8.99, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    6.15  -- score_orientacao_comunitaria
  ),
(
    'cca95c27-9e68-40a3-b8e8-b49ae7528240', '2025-08-20 13:43:06', 'MG 60031', '1997-08-26', 27, 'Ensino superior completo ', '4 salários mínimos',
    'ESF Centro e São Tarcísio', 'Profissional', 'Extensa', '[4,4,1,1,1,4,1,4,4,4,4,4,4,4,4,3,4,3,4,4,3,4,4,1,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,1,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,1,4,4,4,1,1,4,4,1,3,1,1,1,3,3,4,4,4,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 7.78, true,
    '{"A":5.71,"B":9.49,"C":7.33,"D":6.67,"E":8.99,"F":10,"G":7.5,"H":4.87,"I":9.44}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    5.71, -- score_acesso_acessibilidade
    9.49, -- score_longitudinalidade
    7.33, -- score_coordenacao_cuidados
    6.67, -- score_coordenacao_sistemas
    8.99, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    7.5, -- score_orientacao_familiar
    4.87  -- score_orientacao_comunitaria
  ),
(
    '0436aae3-8bc9-40dc-bc9a-09dd04e55a1d', '2025-09-10 8:29:32', '28796', '1980-07-08', 45, 'Superior Completo', '3 salários mínimos',
    'UAPS Vila Mariana', 'Profissional', 'Extensa', '[4,1,1,1,1,3,1,1,4,3,1,1,3,1,1,1,4,4,4,4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,1,4,4,4,4,3,4,4,4,4,3,1,4,4,4,4,4,4,4,1]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 7.79, true,
    '{"A":3.81,"B":4.87,"C":8,"D":10,"E":9.71,"F":10,"G":6.67,"H":8.72,"I":8.33}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    3.81, -- score_acesso_acessibilidade
    4.87, -- score_longitudinalidade
    8, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    9.71, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    6.67, -- score_orientacao_familiar
    8.72  -- score_orientacao_comunitaria
  ),
(
    '7a80a7ff-f56c-4da3-89d6-d2fd88176e94', '2025-09-16 14:07:19', '10294', '1960-03-30', 65, 'Superior completo', '10 salários mínimos',
    'EAP Vila Mariana ', 'Profissional', 'Extensa', '[4,1,1,1,1,4,1,3,4,4,1,4,4,1,1,1,1,4,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,4,4,3,4,3,4,4,4,4,4,4,4,4,4,2,3,4,4,1,1,4,9,1,9,1,3,4,1,1,1,1,1,4,4,1,1,1]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 6.78, true,
    '{"A":4.29,"B":5.9,"C":8,"D":10,"E":9.42,"F":10,"G":7.5,"H":2.56,"I":3.33}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    4.29, -- score_acesso_acessibilidade
    5.9, -- score_longitudinalidade
    8, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    9.42, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    7.5, -- score_orientacao_familiar
    2.56  -- score_orientacao_comunitaria
  ),
(
    '798f057e-568c-4bf5-ba0c-e48e325f0316', '2025-10-07 13:16:23', '16894', '1968-12-02', 56, 'Pós Graduada ', '3 salários mínimos',
    'ESF São Pedro ', 'Profissional', 'Extensa', '[4,4,1,4,4,4,4,4,4,3,1,4,4,3,2,4,4,4,2,4,1,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,4,1,4,4,4,4,4,4,4,1,4,4,4,4,4,4,4,4,3,1,1,4,4,1,1,1,1,4,4,1,4,4,4,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 8.00, true,
    '{"A":7.14,"B":7.69,"C":6,"D":10,"E":9.13,"F":8.57,"G":10,"H":5.13,"I":8.33}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    7.14, -- score_acesso_acessibilidade
    7.69, -- score_longitudinalidade
    6, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    9.13, -- score_integralidade_disponiveis
    8.57, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    5.13  -- score_orientacao_comunitaria
  ),
(
    '6b557d00-1377-42d8-9133-56d090361b3c', '2025-10-07 14:38:38', '51327', '1993-02-22', 32, 'Superior completo ', '4 salários mínimos',
    'ESF São Pedro', 'Profissional', 'Extensa', '[4,4,1,4,4,4,4,4,4,4,1,4,4,3,2,4,4,4,3,4,1,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,4,1,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,3,1,1,4,4,1,1,1,1,4,4,3,4,4,4,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 8.29, true,
    '{"A":7.14,"B":8.21,"C":6,"D":10,"E":9.13,"F":9.52,"G":10,"H":5.13,"I":9.44}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    7.14, -- score_acesso_acessibilidade
    8.21, -- score_longitudinalidade
    6, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    9.13, -- score_integralidade_disponiveis
    9.52, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    5.13  -- score_orientacao_comunitaria
  ),
(
    '1e7b5229-9396-44d3-89d9-0ea680f845a1', '2025-11-04 14:09:29', 'MG 54262', '1995-07-05', 30, 'Pós Graduação', '3 salários mínimos',
    'ESF Santa Rita 2', 'Profissional', 'Extensa', '[3,9,1,1,1,3,1,3,4,3,2,4,3,2,4,3,3,2,3,4,3,4,4,3,4,3,3,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,3,4,3,3,4,3,4,4,4,4,4,4,4,4,4,4,4,3,4,2,4,4,4,3,3,3,3,4,4,3,4,4,4,9,4,3,3,9,3]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 7.64, true,
    '{"A":3.81,"B":6.92,"C":8.67,"D":7.78,"E":9.28,"F":10,"G":7.5,"H":8.72,"I":6.11}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    3.81, -- score_acesso_acessibilidade
    6.92, -- score_longitudinalidade
    8.67, -- score_coordenacao_cuidados
    7.78, -- score_coordenacao_sistemas
    9.28, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    7.5, -- score_orientacao_familiar
    8.72  -- score_orientacao_comunitaria
  ),
(
    'ebd0c8c1-b0b0-4138-be0b-bf30978dafd4', '2026-03-03 8:40:47', '70646', '1997-03-24', 28, 'Superior completo ', '3 Salários mínimos',
    'ESF Santa Rita 3', 'Profissional', 'Extensa', '[4,1,4,4,4,4,1,1,4,4,1,4,4,1,1,4,1,1,4,4,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,4,4,4,4,1,4,4,1,4,1,4,1,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,1,1,4,4,9,4,1,1,4,4,1,4,1,4,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 8.03, true,
    '{"A":8.57,"B":5.38,"C":8.67,"D":10,"E":7.39,"F":10,"G":9.17,"H":6.41,"I":6.67}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    8.57, -- score_acesso_acessibilidade
    5.38, -- score_longitudinalidade
    8.67, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    7.39, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    9.17, -- score_orientacao_familiar
    6.41  -- score_orientacao_comunitaria
  ),
(
    'c845ede9-0e81-4e34-9a3c-4343d85c3a1f', '2026-03-17 8:08:11', '41164', '1987-04-16', 38, 'superior completo ', '3 salários mínimos',
    'ESF Caic 1 ', 'Profissional', 'Extensa', '[4,1,1,1,1,4,1,4,4,4,1,3,4,2,1,2,3,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,4,4,4,3,4,4,4,4,4,4,1,4,4,1,4,4,4,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 8.37, true,
    '{"A":4.29,"B":5.38,"C":10,"D":10,"E":10,"F":10,"G":8.33,"H":8.97,"I":8.33}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    4.29, -- score_acesso_acessibilidade
    5.38, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    8.33, -- score_orientacao_familiar
    8.97  -- score_orientacao_comunitaria
  ),
(
    '684682b2-f667-4718-bd75-e777714d18c2', '2026-03-17 9:16:35', '20075', '1972-07-02', 53, 'Pós Graduada ', 'Não quis informar',
    'ESF Altinópolis 1', 'Profissional', 'Extensa', '[4,1,1,1,1,4,1,4,4,4,1,4,4,4,2,4,4,4,4,4,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,4,4,3,4,4,1,9,4,1,4,4,2,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 8.51, true,
    '{"A":4.29,"B":8.72,"C":8.67,"D":10,"E":10,"F":10,"G":10,"H":7.69,"I":7.22}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    4.29, -- score_acesso_acessibilidade
    8.72, -- score_longitudinalidade
    8.67, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    7.69  -- score_orientacao_comunitaria
  ),
(
    '3ac481b7-9810-4490-b81f-63cc00b35981', '2026-03-17 9:44:06', '105152', '1994-06-29', 31, 'Pós graduado ', '3 salários mínimos',
    'ESF Altinopolis 2', 'Profissional', 'Extensa', '[4,1,1,1,1,4,1,4,4,4,1,4,4,3,1,1,4,4,3,4,1,4,4,2,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,9,3,4,4,4,4,4,2,1,4,3,4,4,3,1,1,4,3,4,3,4,4,3]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 7.73, true,
    '{"A":4.29,"B":7.18,"C":6.67,"D":10,"E":9.86,"F":9.05,"G":7.5,"H":6.67,"I":8.33}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    4.29, -- score_acesso_acessibilidade
    7.18, -- score_longitudinalidade
    6.67, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    9.86, -- score_integralidade_disponiveis
    9.05, -- score_integralidade_prestados
    7.5, -- score_orientacao_familiar
    6.67  -- score_orientacao_comunitaria
  ),
(
    '2b0bc878-d7d8-4773-a869-92087d4809a8', '2026-03-31 9:21:11', '19966', '1972-04-27', 53, 'MESTRANDA', '>10 SALARIOS',
    'ESF MÃE DE DEUS 2', 'Profissional', 'Extensa', '[3,2,2,3,2,3,2,3,3,3,2,3,3,3,2,3,3,3,3,3,2,3,9,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,4,3,3,2,2,2,3,3,4,2,2,3,3,3,2,2,2,3,3]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5"]', 5.89, false,
    '{"A":5.24,"B":6.15,"C":4.67,"D":6.67,"E":6.67,"F":6.67,"G":6.67,"H":5.64,"I":4.67}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    5.24, -- score_acesso_acessibilidade
    6.15, -- score_longitudinalidade
    4.67, -- score_coordenacao_cuidados
    6.67, -- score_coordenacao_sistemas
    6.67, -- score_integralidade_disponiveis
    6.67, -- score_integralidade_prestados
    6.67, -- score_orientacao_familiar
    5.64  -- score_orientacao_comunitaria
  ),
(
    'bdd02bbf-eeee-45cb-9e71-accb25d99cb6', '2026-03-31 13:33:11', '75950', '2002-06-10', 23, 'Superior completo ', '5',
    'Santa Rita 6 ', 'Profissional', 'Extensa', '[4,3,9,9,4,4,2,3,4,4,3,3,3,3,9,3,9,3,3,3,9,3,4,3,4,4,3,3,4,3,4,4,4,4,4,4,3,3,4,4,4,4,4,4,4,4,4,3,4,3,4,3,4,4,4,4,4,4,3,4,4,9,4,4,4,4,4,3,3,3,3,3,3,3,3,9,3,3,4,3,3]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 7.76, true,
    '{"A":7.14,"B":6.67,"C":7.33,"D":7.78,"E":9.28,"F":9.52,"G":7.5,"H":7.95,"I":6.67}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    7.14, -- score_acesso_acessibilidade
    6.67, -- score_longitudinalidade
    7.33, -- score_coordenacao_cuidados
    7.78, -- score_coordenacao_sistemas
    9.28, -- score_integralidade_disponiveis
    9.52, -- score_integralidade_prestados
    7.5, -- score_orientacao_familiar
    7.95  -- score_orientacao_comunitaria
  ),
(
    'dd723809-0f37-43fa-bb97-17f1b27cade6', '2026-04-07 8:26:42', '1763', '1967-11-08', 58, 'Pós Graduado', '3 salários mínimos',
    'ESF Altinópolis 3', 'Profissional', 'Extensa', '[4,1,1,1,1,4,1,3,4,4,1,4,4,2,3,2,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,4,4,4,4,4,4,4,4,4,4,3,3,4,4,3,4,1,2,4,3,4,1,4,3,1,1,4,4,4,4,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 8.24, true,
    '{"A":4.29,"B":6.15,"C":10,"D":10,"E":9.71,"F":10,"G":8.33,"H":5.64,"I":10}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    4.29, -- score_acesso_acessibilidade
    6.15, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    9.71, -- score_integralidade_disponiveis
    10, -- score_integralidade_prestados
    8.33, -- score_orientacao_familiar
    5.64  -- score_orientacao_comunitaria
  ),
(
    'a5024934-f2ed-44a2-91dc-96b474413376', '2026-04-07 9:11:43', '50966', '1991-04-09', 34, 'Pós Graduada ', '10 salários mínimos ',
    'ESF Altinopolis 4', 'Profissional', 'Extensa', '[4,4,1,1,1,4,1,4,4,4,1,4,4,4,1,4,4,1,4,4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,4,4,4,1,4,4,4,1,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,1,1,1,4,1,1,4,4,1,1,4,4,4,4,4,4]', '["A1","A2","A3","A4","A5","A6","A7","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22","E23","F1","F2","F3","F4","F5","F6","F7","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13","I1","I2","I3","I4","I5","I6"]', 8.25, true,
    '{"A":5.71,"B":7.69,"C":8,"D":10,"E":8.7,"F":9.52,"G":10,"H":4.62,"I":10}', 
    NULL, -- score_afiliacao (A is Acessibilidade for professionals)
    NULL, -- score_acesso_utilizacao
    5.71, -- score_acesso_acessibilidade
    7.69, -- score_longitudinalidade
    8, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    8.7, -- score_integralidade_disponiveis
    9.52, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    4.62  -- score_orientacao_comunitaria
  );
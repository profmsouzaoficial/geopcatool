INSERT INTO survey_responses (
  id, created_at, registration_number, birth_date, age, education_level, monthly_income,
  service_type, target_group, version, answers, question_codes, score, is_high_quality,
  components, score_afiliacao, score_acesso_utilizacao, score_acesso_acessibilidade,
  score_longitudinalidade, score_coordenacao_cuidados, score_coordenacao_sistemas,
  score_integralidade_disponiveis, score_integralidade_prestados, score_orientacao_familiar,
  score_orientacao_comunitaria
) VALUES 
(
    '027fdb5b-ef1d-4dc9-a32c-ecf7b65c90dd', '2025-06-16 14:42:58', NULL, NULL, NULL, NULL, NULL,
    'ESF São Paulo 1 e 2', 'Adulto', 'Extensa', '[3,4,1,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,3,3,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,1,4,9,1,4,4,3]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.61, true,
    '{"A":6.67,"B":10,"C":10,"D":8.89,"E":9.33,"F":10,"G":10,"H":3.7,"I":8.89}', 
    6.67, -- score_afiliacao
    10, -- score_acesso_utilizacao
    10, -- score_acesso_acessibilidade
    8.89, -- score_longitudinalidade
    9.33, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    3.7, -- score_integralidade_prestados
    8.89, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '87bd53d5-0d30-4249-b48a-0c49ae4d3566', '2025-06-23 13:58:31', NULL, NULL, NULL, NULL, NULL,
    'ESF Lurdes', 'Adulto', 'Extensa', '[4,3,1,4,4,4,4,4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,1,4,4,4,4,4,4,4,1,1,4,4,1,1,1,1,4,1,4,4,1]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 7.76, true,
    '{"A":6.67,"B":10,"C":10,"D":6.67,"E":9,"F":10,"G":7.5,"H":3.33,"I":6.67}', 
    6.67, -- score_afiliacao
    10, -- score_acesso_utilizacao
    10, -- score_acesso_acessibilidade
    6.67, -- score_longitudinalidade
    9, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    7.5, -- score_integralidade_disponiveis
    3.33, -- score_integralidade_prestados
    6.67, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '0f6d48fd-21ac-4db0-9dd2-e62bd296e115', '2025-06-24 8:28:24', NULL, NULL, NULL, NULL, NULL,
    'ESF JK 1 e 2 ', 'Adulto', 'Extensa', '[4,4,1,4,4,4,1,1,1,1,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,3]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 7.38, true,
    '{"A":6.67,"B":10,"C":2,"D":6.67,"E":10,"F":10,"G":10,"H":8.89,"I":2.22}', 
    6.67, -- score_afiliacao
    10, -- score_acesso_utilizacao
    2, -- score_acesso_acessibilidade
    6.67, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    8.89, -- score_integralidade_prestados
    2.22, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '39a193eb-362a-4b2c-b9de-eb42e258e711', '2025-06-25 15:05:21', NULL, NULL, NULL, NULL, NULL,
    'ESF Santa Teresinha', 'Adulto', 'Extensa', '[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,4,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 9.88, true,
    '{"A":10,"B":10,"C":10,"D":10,"E":10,"F":10,"G":10,"H":8.89,"I":10}', 
    10, -- score_afiliacao
    10, -- score_acesso_utilizacao
    10, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    8.89, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '8ef0c196-1a5a-4bcc-bdf2-b863fc1f484f', '2025-08-12 13:16:40', NULL, NULL, NULL, NULL, NULL,
    'ESF Santos Dumont 1 e 2 ', 'Adulto', 'Extensa', '[4,4,9,4,4,4,4,4,4,4,1,1,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,3,4,3,1,4,4,4,3,4,4,4,1,9,1,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.08, true,
    '{"A":10,"B":10,"C":8,"D":6.67,"E":10,"F":7.78,"G":5.83,"H":7.78,"I":6.67}', 
    10, -- score_afiliacao
    10, -- score_acesso_utilizacao
    8, -- score_acesso_acessibilidade
    6.67, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    7.78, -- score_coordenacao_sistemas
    5.83, -- score_integralidade_disponiveis
    7.78, -- score_integralidade_prestados
    6.67, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '21d84161-7600-4d3c-b69d-2fab98a59a9a', '2025-08-12 14:02:40', NULL, NULL, NULL, NULL, NULL,
    'ESF Sir 1 e 2', 'Adulto', 'Extensa', '[4,1,3,4,4,4,4,4,3,4,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,1,4,4,2,1,4,3,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.99, true,
    '{"A":6.67,"B":10,"C":8.67,"D":10,"E":10,"F":10,"G":10,"H":6.67,"I":8.89}', 
    6.67, -- score_afiliacao
    10, -- score_acesso_utilizacao
    8.67, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    6.67, -- score_integralidade_prestados
    8.89, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '250d1fbd-eace-4986-95d6-cf03699e7a03', '2025-08-20 13:43:06', NULL, NULL, NULL, NULL, NULL,
    'ESF Centro e São Tarcísio', 'Adulto', 'Extensa', '[4,4,1,4,4,4,3,4,4,1,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,4,4,4,1,1,4,4,1,3,3,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.15, true,
    '{"A":6.67,"B":10,"C":7.33,"D":6.67,"E":10,"F":10,"G":7.5,"H":6.3,"I":8.89}', 
    6.67, -- score_afiliacao
    10, -- score_acesso_utilizacao
    7.33, -- score_acesso_acessibilidade
    6.67, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    7.5, -- score_integralidade_disponiveis
    6.3, -- score_integralidade_prestados
    8.89, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    'd45b00d8-6d9e-4d20-8e8f-64c7842a8e7b', '2025-09-10 8:29:32', NULL, NULL, NULL, NULL, NULL,
    'UAPS Vila Mariana', 'Adulto', 'Extensa', '[4,1,1,1,4,3,4,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,2,4,4,4,4,3,4,1,4,4,4,4,3,4,4,4,4,4,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.06, true,
    '{"A":3.33,"B":5.56,"C":8,"D":10,"E":9.33,"F":10,"G":6.67,"H":9.63,"I":10}', 
    3.33, -- score_afiliacao
    5.56, -- score_acesso_utilizacao
    8, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    9.33, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    6.67, -- score_integralidade_disponiveis
    9.63, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    'a65fcb62-58bb-4e55-8c44-a205d87c0219', '2025-09-16 14:07:19', NULL, NULL, NULL, NULL, NULL,
    'EAP Vila Mariana ', 'Adulto', 'Extensa', '[4,1,1,3,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,3,4,4,1,1,4,9,1,9,1,3,4,1,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 7.57, true,
    '{"A":3.33,"B":8.89,"C":8,"D":10,"E":10,"F":10,"G":7.5,"H":3.7,"I":6.67}', 
    3.33, -- score_afiliacao
    8.89, -- score_acesso_utilizacao
    8, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    7.5, -- score_integralidade_disponiveis
    3.7, -- score_integralidade_prestados
    6.67, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '5058928c-ca86-4f64-b26b-f81c1c3f9335', '2025-10-07 13:16:23', NULL, NULL, NULL, NULL, NULL,
    'ESF São Pedro ', 'Adulto', 'Extensa', '[4,4,1,4,4,3,1,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,1,1,4,4,1,1,1,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.16, true,
    '{"A":6.67,"B":8.89,"C":6,"D":10,"E":10,"F":10,"G":10,"H":5.19,"I":6.67}', 
    6.67, -- score_afiliacao
    8.89, -- score_acesso_utilizacao
    6, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    5.19, -- score_integralidade_prestados
    6.67, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '40013cc8-bf85-47be-9847-1920e296cb60', '2025-10-07 14:38:38', NULL, NULL, NULL, NULL, NULL,
    'ESF São Pedro', 'Adulto', 'Extensa', '[4,4,1,4,4,4,1,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,1,1,4,4,1,1,3,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.53, true,
    '{"A":6.67,"B":10,"C":6,"D":10,"E":10,"F":10,"G":10,"H":5.19,"I":8.89}', 
    6.67, -- score_afiliacao
    10, -- score_acesso_utilizacao
    6, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    5.19, -- score_integralidade_prestados
    8.89, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    'cfc281af-e078-4fd7-93cd-9356a961c526', '2025-11-04 14:09:29', NULL, NULL, NULL, NULL, NULL,
    'ESF Santa Rita 2', 'Adulto', 'Extensa', '[3,9,1,3,4,3,3,4,4,3,4,3,3,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,3,4,2,4,4,4,3,3,3,3,4,4,9,4,3]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.14, true,
    '{"A":6.67,"B":7.78,"C":8.67,"D":7.78,"E":9.67,"F":10,"G":7.5,"H":8.52,"I":6.67}', 
    6.67, -- score_afiliacao
    7.78, -- score_acesso_utilizacao
    8.67, -- score_acesso_acessibilidade
    7.78, -- score_longitudinalidade
    9.67, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    7.5, -- score_integralidade_disponiveis
    8.52, -- score_integralidade_prestados
    6.67, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    'fcc7b4b9-626f-42f2-869b-3c0c3a1573e9', '2026-03-03 8:40:47', NULL, NULL, NULL, NULL, NULL,
    'ESF Santa Rita 3', 'Adulto', 'Extensa', '[4,1,4,1,4,4,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,4,4,4,3,4,4,4,4,4,4,1,1,4,4,9,4,1,4,1]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 7.73, true,
    '{"A":6.67,"B":6.67,"C":8.67,"D":10,"E":8,"F":10,"G":9.17,"H":7.04,"I":3.33}', 
    6.67, -- score_afiliacao
    6.67, -- score_acesso_utilizacao
    8.67, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    8, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    9.17, -- score_integralidade_disponiveis
    7.04, -- score_integralidade_prestados
    3.33, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    'f17f5de4-43b5-4a87-b8aa-f811e2acb639', '2026-03-17 8:08:11', NULL, NULL, NULL, NULL, NULL,
    'ESF Caic 1 ', 'Adulto', 'Extensa', '[4,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,4,4,4,3,4,4,4,4,4,1,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.66, true,
    '{"A":3.33,"B":10,"C":10,"D":10,"E":10,"F":10,"G":8.33,"H":9.63,"I":6.67}', 
    3.33, -- score_afiliacao
    10, -- score_acesso_utilizacao
    10, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    8.33, -- score_integralidade_disponiveis
    9.63, -- score_integralidade_prestados
    6.67, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '619070bb-b337-466c-991b-9fc615d01992', '2026-03-17 9:16:35', NULL, NULL, NULL, NULL, NULL,
    'ESF Altinópolis 1', 'Adulto', 'Extensa', '[4,1,1,4,4,4,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,4,4,3,4,1,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.58, true,
    '{"A":3.33,"B":10,"C":8.67,"D":10,"E":10,"F":10,"G":10,"H":8.52,"I":6.67}', 
    3.33, -- score_afiliacao
    10, -- score_acesso_utilizacao
    8.67, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    8.52, -- score_integralidade_prestados
    6.67, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '6e3b6346-80dc-4a17-b153-94cd93bc376f', '2026-03-17 9:44:06', NULL, NULL, NULL, NULL, NULL,
    'ESF Altinopolis 2', 'Adulto', 'Extensa', '[4,1,1,4,4,4,1,4,4,2,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,9,3,4,4,4,4,4,2,1,4,3,4,4,3,4,3]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.08, true,
    '{"A":3.33,"B":10,"C":6.67,"D":10,"E":9.67,"F":10,"G":7.5,"H":7.78,"I":7.78}', 
    3.33, -- score_afiliacao
    10, -- score_acesso_utilizacao
    6.67, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    9.67, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    7.5, -- score_integralidade_disponiveis
    7.78, -- score_integralidade_prestados
    7.78, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '702addd4-ba96-40e1-9c1d-52caf69e4ce8', '2026-03-31 9:21:11', NULL, NULL, NULL, NULL, NULL,
    'ESF MÃE DE DEUS 2', 'Adulto', 'Extensa', '[3,2,2,3,3,3,2,3,9,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,4,3,3,2,2,2,3,3,4,2,2,2,2]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 6.32, false,
    '{"A":10,"B":6.67,"C":4.67,"D":6.67,"E":6.67,"F":6.67,"G":6.67,"H":5.56,"I":3.33}', 
    10, -- score_afiliacao
    6.67, -- score_acesso_utilizacao
    4.67, -- score_acesso_acessibilidade
    6.67, -- score_longitudinalidade
    6.67, -- score_coordenacao_cuidados
    6.67, -- score_coordenacao_sistemas
    6.67, -- score_integralidade_disponiveis
    5.56, -- score_integralidade_prestados
    3.33, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '3050dc56-6bce-49be-a89b-726db82429a1', '2026-03-31 13:33:11', NULL, NULL, NULL, NULL, NULL,
    'Santa Rita 6 ', 'Adulto', 'Extensa', '[4,3,9,3,4,4,9,3,4,3,4,4,3,3,4,3,4,4,4,4,4,4,3,3,3,4,4,3,4,4,9,4,4,4,4,4,3,3,3,3,9,3,3]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.16, true,
    '{"A":10,"B":8.89,"C":7.33,"D":7.78,"E":9,"F":8.89,"G":7.5,"H":8.52,"I":5.56}', 
    10, -- score_afiliacao
    8.89, -- score_acesso_utilizacao
    7.33, -- score_acesso_acessibilidade
    7.78, -- score_longitudinalidade
    9, -- score_coordenacao_cuidados
    8.89, -- score_coordenacao_sistemas
    7.5, -- score_integralidade_disponiveis
    8.52, -- score_integralidade_prestados
    5.56, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '0d65aa0c-d4a3-4e15-9c8c-e08aa3254072', '2026-04-07 8:26:42', NULL, NULL, NULL, NULL, NULL,
    'ESF Altinópolis 3', 'Adulto', 'Extensa', '[4,1,1,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,4,4,3,4,1,2,4,3,4,1,4,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.54, true,
    '{"A":3.33,"B":8.89,"C":10,"D":10,"E":10,"F":10,"G":8.33,"H":6.3,"I":10}', 
    3.33, -- score_afiliacao
    8.89, -- score_acesso_utilizacao
    10, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    8.33, -- score_integralidade_disponiveis
    6.3, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  ),
(
    '63d2e4a2-5814-47f2-89eb-ab7f8389dba1', '2026-04-07 9:11:43', NULL, NULL, NULL, NULL, NULL,
    'ESF Altinopolis 4', 'Adulto', 'Extensa', '[4,4,1,4,4,4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,4,1,1,4,4,4]', '["A1","A2","A3","B1","B2","B3","C1","C2","C3","C4","C5","D1","D2","D3","E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","F1","F2","F3","G1","G2","G3","G4","H1","H2","H3","H4","H5","H6","H7","H8","H9","I1","I2","I3"]', 8.79, true,
    '{"A":6.67,"B":10,"C":8,"D":10,"E":10,"F":10,"G":10,"H":4.44,"I":10}', 
    6.67, -- score_afiliacao
    10, -- score_acesso_utilizacao
    8, -- score_acesso_acessibilidade
    10, -- score_longitudinalidade
    10, -- score_coordenacao_cuidados
    10, -- score_coordenacao_sistemas
    10, -- score_integralidade_disponiveis
    4.44, -- score_integralidade_prestados
    10, -- score_orientacao_familiar
    NULL  -- score_orientacao_comunitaria
  );
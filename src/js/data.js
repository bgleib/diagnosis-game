/**
 * Medical Data Schema & Initial Prehospital Dataset
 */

export const SYMPTOMS = {
  // Chest Pain / Cardiac Symptoms
  substernal_chest_pain: {
    id: "substernal_chest_pain",
    name: "Substernal Crushing Chest Pain",
    category: "History"
  },
  pleuritic_chest_pain: {
    id: "pleuritic_chest_pain",
    name: "Sharp Pleuritic Chest Pain",
    category: "History"
  },
  radiation_to_arm_jaw: {
    id: "radiation_to_arm_jaw",
    name: "Pain Radiation to Left Arm or Jaw",
    category: "History"
  },
  diaphoresis: {
    id: "diaphoresis",
    name: "Profuse Diaphoresis",
    category: "Physical Exam"
  },
  st_elevation: {
    id: "st_elevation",
    name: "ST-Segment Elevation",
    category: "ECG"
  },
  st_depression_t_wave_inversion: {
    id: "st_depression_t_wave_inversion",
    name: "ST-Depression / T-Wave Inversion",
    category: "ECG"
  },
  s1q3t3_pattern: {
    id: "s1q3t3_pattern",
    name: "Right Ventricular Strain (S1Q3T3)",
    category: "ECG"
  },
  sinus_tachycardia: {
    id: "sinus_tachycardia",
    name: "Sinus Tachycardia (>100 bpm)",
    category: "Vitals"
  },
  hypotension: {
    id: "hypotension",
    name: "Hypotension (SBP < 90 mmHg)",
    category: "Vitals"
  },
  asymmetric_bp: {
    id: "asymmetric_bp",
    name: "Blood Pressure Differential > 20 mmHg Between Arms",
    category: "Vitals"
  },
  tearing_back_pain: {
    id: "tearing_back_pain",
    name: "Tearing Discomfort Radiating to Back",
    category: "History"
  },
  epigastric_burning: {
    id: "epigastric_burning",
    name: "Epigastric Burning Pain",
    category: "History"
  },
  chest_wall_tenderness: {
    id: "chest_wall_tenderness",
    name: "Reproducible Chest Wall Tenderness",
    category: "Physical Exam"
  },

  // Respiratory Symptoms
  wheezing: {
    id: "wheezing",
    name: "Bilateral Expiratory Wheezing",
    category: "Auscultation"
  },
  crackles_rales: {
    id: "crackles_rales",
    name: "Bilateral Basilar Crackles (Rales)",
    category: "Auscultation"
  },
  absent_breath_sounds_unilateral: {
    id: "absent_breath_sounds_unilateral",
    name: "Unilaterally Decreased Breath Sounds",
    category: "Auscultation"
  },
  hypoxemia: {
    id: "hypoxemia",
    name: "Hypoxemia (SpO2 < 90%)",
    category: "Vitals"
  },
  hypercapnia_etco2: {
    id: "hypercapnia_etco2",
    name: "Elevated ETCO2 / Shark-Fin Capnogram",
    category: "Diagnostics"
  },
  fever: {
    id: "fever",
    name: "Fever (Temp > 38.0°C / 100.4°F)",
    category: "Vitals"
  },
  productive_cough: {
    id: "productive_cough",
    name: "Productive Cough with Purulent Sputum",
    category: "History"
  },

  // AMS & Neurological Symptoms
  hypoglycemia_blood: {
    id: "hypoglycemia_blood",
    name: "Low Blood Glucose (< 60 mg/dL)",
    category: "Diagnostics"
  },
  facial_droop: {
    id: "facial_droop",
    name: "Unilateral Facial Droop",
    category: "Neurological"
  },
  arm_drift: {
    id: "arm_drift",
    name: "Unilateral Arm Drift / Weakness",
    category: "Neurological"
  },
  slurred_speech: {
    id: "slurred_speech",
    name: "Dysarthria / Slurred Speech",
    category: "Neurological"
  },
  miotic_pupils: {
    id: "miotic_pupils",
    name: "Pinpoint Pupils (Miosis)",
    category: "Physical Exam"
  },
  bradypnea: {
    id: "bradypnea",
    name: "Severe Respiratory Depression (RR < 8)",
    category: "Vitals"
  },
  post_ictal_state: {
    id: "post_ictal_state",
    name: "Confusion / Lethargy Following Tonic-Clonic Seizure",
    category: "History"
  },

  // Abdominal Symptoms
  rlq_rebound_tenderness: {
    id: "rlq_rebound_tenderness",
    name: "Right Lower Quadrant Rebound Tenderness",
    category: "Physical Exam"
  },
  ruq_tenderness_murphys: {
    id: "ruq_tenderness_murphys",
    name: "Right Upper Quadrant Tenderness (Murphy's Sign)",
    category: "Physical Exam"
  },
  flank_pain_colicky: {
    id: "flank_pain_colicky",
    name: "Severe Colicky Flank Pain Radiating to Groin",
    category: "History"
  },
  pulsatile_abdominal_mass: {
    id: "pulsatile_abdominal_mass",
    name: "Pulsatile Abdominal Mass",
    category: "Physical Exam"
  }
};

export const DIAGNOSES = {
  // Chest Pain Differential
  stemi: {
    id: "stemi",
    name: "Acute ST-Elevation Myocardial Infarction (STEMI)",
    chiefComplaintId: "chest_pain",
    prior: 0.30,
    description: "Acute complete coronary artery occlusion requiring immediate catheterization.",
    symptomProbabilities: {
      substernal_chest_pain: 0.85,
      radiation_to_arm_jaw: 0.65,
      diaphoresis: 0.70,
      st_elevation: 0.90,
      st_depression_t_wave_inversion: 0.15,
      hypotension: 0.20,
      sinus_tachycardia: 0.35,
      tearing_back_pain: 0.02,
      epigastric_burning: 0.20,
      chest_wall_tenderness: 0.05
    }
  },
  nstemi_unstable_angina: {
    id: "nstemi_unstable_angina",
    name: "NSTEMI / Unstable Angina",
    chiefComplaintId: "chest_pain",
    prior: 0.25,
    description: "Partial coronary ischemia without immediate transmural ST-elevation.",
    symptomProbabilities: {
      substernal_chest_pain: 0.80,
      radiation_to_arm_jaw: 0.55,
      diaphoresis: 0.50,
      st_elevation: 0.05,
      st_depression_t_wave_inversion: 0.75,
      hypotension: 0.10,
      sinus_tachycardia: 0.25,
      epigastric_burning: 0.25,
      chest_wall_tenderness: 0.05
    }
  },
  pulmonary_embolism: {
    id: "pulmonary_embolism",
    name: "Acute Pulmonary Embolism (PE)",
    chiefComplaintId: "chest_pain",
    prior: 0.15,
    description: "Thromboembolism obstructing pulmonary arteries, impairing gas exchange.",
    symptomProbabilities: {
      pleuritic_chest_pain: 0.75,
      substernal_chest_pain: 0.20,
      hypoxemia: 0.70,
      sinus_tachycardia: 0.80,
      s1q3t3_pattern: 0.30,
      st_depression_t_wave_inversion: 0.25,
      diaphoresis: 0.40,
      hypotension: 0.15
    }
  },
  aortic_dissection: {
    id: "aortic_dissection",
    name: "Acute Aortic Dissection",
    chiefComplaintId: "chest_pain",
    prior: 0.05,
    description: "Tear in the aortic intima causing blood flow between vessel layers.",
    symptomProbabilities: {
      tearing_back_pain: 0.85,
      substernal_chest_pain: 0.40,
      asymmetric_bp: 0.65,
      hypotension: 0.30,
      diaphoresis: 0.70,
      sinus_tachycardia: 0.60
    }
  },
  gerd_esophageal: {
    id: "gerd_esophageal",
    name: "Gastroesophageal Reflux / Esophageal Spasm",
    chiefComplaintId: "chest_pain",
    prior: 0.15,
    description: "Non-cardiac chest pain originating from gastrointestinal acid irritation.",
    symptomProbabilities: {
      epigastric_burning: 0.85,
      substernal_chest_pain: 0.40,
      diaphoresis: 0.10,
      st_elevation: 0.02,
      st_depression_t_wave_inversion: 0.02
    }
  },
  costochondritis: {
    id: "costochondritis",
    name: "Costochondritis / Musculoskeletal Chest Pain",
    chiefComplaintId: "chest_pain",
    prior: 0.10,
    description: "Benign inflammation of costochondral joint cartilage.",
    symptomProbabilities: {
      chest_wall_tenderness: 0.90,
      pleuritic_chest_pain: 0.60,
      substernal_chest_pain: 0.20,
      diaphoresis: 0.02
    }
  },

  // Shortness of Breath Differential
  acute_copd_asthma: {
    id: "acute_copd_asthma",
    name: "Asthma / COPD Exacerbation",
    chiefComplaintId: "shortness_of_breath",
    prior: 0.35,
    description: "Bronchospasm and airway hyper-reactivity causing obstructive distress.",
    symptomProbabilities: {
      wheezing: 0.90,
      hypoxemia: 0.75,
      hypercapnia_etco2: 0.80,
      sinus_tachycardia: 0.65,
      crackles_rales: 0.10
    }
  },
  acute_pulmonary_edema: {
    id: "acute_pulmonary_edema",
    name: "Acute Pulmonary Edema (CHF)",
    chiefComplaintId: "shortness_of_breath",
    prior: 0.30,
    description: "Fluid overload in pulmonary alveoli due to acute left heart failure.",
    symptomProbabilities: {
      crackles_rales: 0.90,
      hypoxemia: 0.85,
      diaphoresis: 0.75,
      sinus_tachycardia: 0.70,
      wheezing: 0.25,
      st_depression_t_wave_inversion: 0.35
    }
  },
  pneumonia: {
    id: "pneumonia",
    name: "Pneumonia",
    chiefComplaintId: "shortness_of_breath",
    prior: 0.20,
    description: "Infectious parenchymal lung consolidation.",
    symptomProbabilities: {
      fever: 0.80,
      productive_cough: 0.85,
      pleuritic_chest_pain: 0.50,
      hypoxemia: 0.65,
      crackles_rales: 0.70,
      absent_breath_sounds_unilateral: 0.20
    }
  },
  tension_pneumothorax: {
    id: "tension_pneumothorax",
    name: "Tension Pneumothorax",
    chiefComplaintId: "shortness_of_breath",
    prior: 0.15,
    description: "Air trapping in pleural space under pressure, compromising venous return.",
    symptomProbabilities: {
      absent_breath_sounds_unilateral: 0.90,
      hypoxemia: 0.85,
      hypotension: 0.70,
      sinus_tachycardia: 0.85,
      pleuritic_chest_pain: 0.75
    }
  },

  // Altered Mental Status Differential
  hypoglycemia: {
    id: "hypoglycemia",
    name: "Severe Hypoglycemia",
    chiefComplaintId: "altered_mental_status",
    prior: 0.30,
    description: "Critically low plasma glucose impairing cerebral function.",
    symptomProbabilities: {
      hypoglycemia_blood: 0.98,
      diaphoresis: 0.80,
      sinus_tachycardia: 0.60
    }
  },
  acute_ischemic_stroke: {
    id: "acute_ischemic_stroke",
    name: "Acute Ischemic Stroke",
    chiefComplaintId: "altered_mental_status",
    prior: 0.30,
    description: "Focal cerebral ischemia from vascular thromboembolism.",
    symptomProbabilities: {
      facial_droop: 0.80,
      arm_drift: 0.85,
      slurred_speech: 0.80,
      hypoglycemia_blood: 0.02
    }
  },
  opioid_overdose: {
    id: "opioid_overdose",
    name: "Acute Opioid Toxicity / Overdose",
    chiefComplaintId: "altered_mental_status",
    prior: 0.20,
    description: "Central nervous system and respiratory depression from opioid agonism.",
    symptomProbabilities: {
      bradypnea: 0.95,
      miotic_pupils: 0.90,
      hypoxemia: 0.85
    }
  },
  post_ictal_seizure: {
    id: "post_ictal_seizure",
    name: "Post-Ictal State (Seizure)",
    chiefComplaintId: "altered_mental_status",
    prior: 0.20,
    description: "Transient post-epileptic encephalopathy.",
    symptomProbabilities: {
      post_ictal_state: 0.90,
      sinus_tachycardia: 0.50,
      hypoxemia: 0.20
    }
  },

  // Abdominal Pain Differential
  acute_appendicitis: {
    id: "acute_appendicitis",
    name: "Acute Appendicitis",
    chiefComplaintId: "abdominal_pain",
    prior: 0.35,
    description: "Inflammation and potential perforation of the vermiform appendix.",
    symptomProbabilities: {
      rlq_rebound_tenderness: 0.85,
      fever: 0.60,
      sinus_tachycardia: 0.40
    }
  },
  acute_cholecystitis: {
    id: "acute_cholecystitis",
    name: "Acute Cholecystitis",
    chiefComplaintId: "abdominal_pain",
    prior: 0.25,
    description: "Gallbladder inflammation, typically secondary to cystic duct obstruction.",
    symptomProbabilities: {
      ruq_tenderness_murphys: 0.85,
      fever: 0.55,
      sinus_tachycardia: 0.35
    }
  },
  renal_colic: {
    id: "renal_colic",
    name: "Renal Colic (Nephrolithiasis)",
    chiefComplaintId: "abdominal_pain",
    prior: 0.25,
    description: "Ureteral obstruction by renal calculus causing severe spasmodic pain.",
    symptomProbabilities: {
      flank_pain_colicky: 0.90,
      diaphoresis: 0.60,
      sinus_tachycardia: 0.50
    }
  },
  ruptured_aaa: {
    id: "ruptured_aaa",
    name: "Ruptured Abdominal Aortic Aneurysm (AAA)",
    chiefComplaintId: "abdominal_pain",
    prior: 0.15,
    description: "Surgical emergency: transmural disruption of abdominal aortic aneurysm.",
    symptomProbabilities: {
      pulsatile_abdominal_mass: 0.70,
      hypotension: 0.80,
      diaphoresis: 0.85,
      sinus_tachycardia: 0.80,
      flank_pain_colicky: 0.30
    }
  }
};

export const CHIEF_COMPLAINTS = {
  chest_pain: {
    id: "chest_pain",
    name: "Chest Pain / Discomfort",
    description: "A 58-year-old patient reports sudden onset chest discomfort. EMS called to scene.",
    diagnoses: ["stemi", "nstemi_unstable_angina", "pulmonary_embolism", "aortic_dissection", "gerd_esophageal", "costochondritis"]
  },
  shortness_of_breath: {
    id: "shortness_of_breath",
    name: "Shortness of Breath / Dyspnea",
    description: "A 64-year-old patient presents with acute onset dyspnea and respiratory distress.",
    diagnoses: ["acute_copd_asthma", "acute_pulmonary_edema", "pneumonia", "tension_pneumothorax"]
  },
  altered_mental_status: {
    id: "altered_mental_status",
    name: "Altered Mental Status / Lethargy",
    description: "A 45-year-old patient found lethargic and minimally responsive by family.",
    diagnoses: ["hypoglycemia", "acute_ischemic_stroke", "opioid_overdose", "post_ictal_seizure"]
  },
  abdominal_pain: {
    id: "abdominal_pain",
    name: "Acute Abdominal Pain",
    description: "A 38-year-old patient complains of severe, sudden-onset abdominal pain.",
    diagnoses: ["acute_appendicitis", "acute_cholecystitis", "renal_colic", "ruptured_aaa"]
  }
};

export const INVESTIGATIONS = {
  hpi_interview: {
    id: "hpi_interview",
    name: "Focused HPI & History",
    category: "History",
    description: "Targeted history taking regarding onset, character, radiation, and past history.",
    symptomPerformance: {
      substernal_chest_pain: { sensitivity: 0.95, specificity: 0.95 },
      pleuritic_chest_pain: { sensitivity: 0.90, specificity: 0.95 },
      radiation_to_arm_jaw: { sensitivity: 0.92, specificity: 0.95 },
      tearing_back_pain: { sensitivity: 0.90, specificity: 0.98 },
      epigastric_burning: { sensitivity: 0.88, specificity: 0.90 },
      productive_cough: { sensitivity: 0.92, specificity: 0.95 },
      post_ictal_state: { sensitivity: 0.85, specificity: 0.90 },
      flank_pain_colicky: { sensitivity: 0.92, specificity: 0.92 }
    }
  },
  primary_survey_vitals: {
    id: "primary_survey_vitals",
    name: "Primary Survey & Full Vitals",
    category: "Vitals",
    description: "Measurement of HR, BP (bilateral), RR, SpO2, and Body Temperature.",
    symptomPerformance: {
      sinus_tachycardia: { sensitivity: 0.98, specificity: 0.95 },
      hypotension: { sensitivity: 0.98, specificity: 0.98 },
      asymmetric_bp: { sensitivity: 0.90, specificity: 0.95 },
      hypoxemia: { sensitivity: 0.98, specificity: 0.98 },
      fever: { sensitivity: 0.95, specificity: 0.98 },
      bradypnea: { sensitivity: 0.95, specificity: 0.98 }
    }
  },
  physical_exam_general: {
    id: "physical_exam_general",
    name: "General Physical Inspection",
    category: "Physical Exam",
    description: "Targeted inspection for skin perfusion, diaphoresis, pupil response, and chest palpation.",
    symptomPerformance: {
      diaphoresis: { sensitivity: 0.90, specificity: 0.92 },
      chest_wall_tenderness: { sensitivity: 0.88, specificity: 0.90 },
      miotic_pupils: { sensitivity: 0.95, specificity: 0.95 }
    }
  },
  thoracic_auscultation: {
    id: "thoracic_auscultation",
    name: "Thoracic & Lung Auscultation",
    category: "Auscultation",
    description: "Stethoscope examination of breath sounds across bilateral lung fields.",
    symptomPerformance: {
      wheezing: { sensitivity: 0.88, specificity: 0.92 },
      crackles_rales: { sensitivity: 0.85, specificity: 0.90 },
      absent_breath_sounds_unilateral: { sensitivity: 0.90, specificity: 0.95 }
    }
  },
  ecg_12lead: {
    id: "ecg_12lead",
    name: "12-Lead Diagnostic ECG",
    category: "Diagnostics",
    description: "Prehospital 12-lead electrocardiography.",
    symptomPerformance: {
      st_elevation: { sensitivity: 0.95, specificity: 0.98 },
      st_depression_t_wave_inversion: { sensitivity: 0.88, specificity: 0.92 },
      s1q3t3_pattern: { sensitivity: 0.75, specificity: 0.95 },
      sinus_tachycardia: { sensitivity: 0.99, specificity: 0.99 }
    }
  },
  poc_blood_glucose: {
    id: "poc_blood_glucose",
    name: "Point-of-Care Blood Glucose Test",
    category: "Diagnostics",
    description: "Fingerstick glucometer blood glucose measurement.",
    symptomPerformance: {
      hypoglycemia_blood: { sensitivity: 0.98, specificity: 0.99 }
    }
  },
  etco2_capnography: {
    id: "etco2_capnography",
    name: "Continuous Waveform Capnography",
    category: "Diagnostics",
    description: "Measurement of exhaled carbon dioxide levels and waveform pattern.",
    symptomPerformance: {
      hypercapnia_etco2: { sensitivity: 0.92, specificity: 0.95 },
      bradypnea: { sensitivity: 0.90, specificity: 0.95 }
    }
  },
  stroke_scale_fast: {
    id: "stroke_scale_fast",
    name: "Prehospital Stroke Assessment (FAST)",
    category: "Neurological",
    description: "Standardized examination of facial droop, arm drift, and speech clarity.",
    symptomPerformance: {
      facial_droop: { sensitivity: 0.92, specificity: 0.92 },
      arm_drift: { sensitivity: 0.90, specificity: 0.92 },
      slurred_speech: { sensitivity: 0.92, specificity: 0.90 }
    }
  },
  abdominal_palpation: {
    id: "abdominal_palpation",
    name: "Abdominal Palpation Exam",
    category: "Physical Exam",
    description: "Targeted four-quadrant abdominal palpation and peritoneal sign testing.",
    symptomPerformance: {
      rlq_rebound_tenderness: { sensitivity: 0.88, specificity: 0.90 },
      ruq_tenderness_murphys: { sensitivity: 0.85, specificity: 0.88 },
      pulsatile_abdominal_mass: { sensitivity: 0.75, specificity: 0.95 }
    }
  }
};

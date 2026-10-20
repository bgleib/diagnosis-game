import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../src/js/engine.js';
import { DIAGNOSES, INVESTIGATIONS, CHIEF_COMPLAINTS } from '../src/js/data.js';

test('GameEngine - Patient Generation in Realistic & Unicorn modes', () => {
  const pRealistic = GameEngine.generatePatient({ chiefComplaintId: 'chest_pain', mode: 'realistic' });
  assert.equal(pRealistic.chiefComplaint.id, 'chest_pain');
  assert.ok(pRealistic.trueDiagnosis);
  assert.ok(pRealistic.trueSymptoms);

  const pUnicorn = GameEngine.generatePatient({ chiefComplaintId: 'chest_pain', mode: 'unicorn' });
  assert.equal(pUnicorn.chiefComplaint.id, 'chest_pain');
  assert.ok(pUnicorn.trueDiagnosis);
});

test('GameEngine - Bayesian Probability Updating', () => {
  const patient = GameEngine.generatePatient({ chiefComplaintId: 'chest_pain', mode: 'realistic' });

  // Force a specific true diagnosis for deterministic test
  patient.trueDiagnosis = DIAGNOSES.stemi;
  patient.trueSymptoms = { st_elevation: true };

  const initialPosteriors = GameEngine.calculatePosteriorProbabilities(patient);
  const stemiInitial = initialPosteriors.find(p => p.diagnosis.id === 'stemi').posterior;

  // Run 12-Lead ECG
  GameEngine.runInvestigation(patient, 'ecg_12lead');

  const updatedPosteriors = GameEngine.calculatePosteriorProbabilities(patient);
  const stemiUpdated = updatedPosteriors.find(p => p.diagnosis.id === 'stemi').posterior;

  // Posterior for STEMI should rise significantly after ST elevation is detected
  assert.ok(stemiUpdated > stemiInitial);

  // Total posterior sum must equal 1.0
  const total = updatedPosteriors.reduce((sum, p) => sum + p.posterior, 0);
  assert.ok(Math.abs(total - 1.0) < 1e-5);
});

test('GameEngine - Scoring and Evaluation', () => {
  const patient = GameEngine.generatePatient({ chiefComplaintId: 'chest_pain', mode: 'realistic' });

  // Submit correct diagnosis
  const resultCorrect = GameEngine.submitDiagnosis(patient, patient.trueDiagnosis.id);
  assert.equal(resultCorrect.isCorrect, true);
  assert.ok(resultCorrect.score >= 100);

  // New patient - submit incorrect diagnosis
  const patient2 = GameEngine.generatePatient({ chiefComplaintId: 'chest_pain', mode: 'realistic' });
  const wrongDiagId = patient2.chiefComplaint.diagnoses.find(id => id !== patient2.trueDiagnosis.id);
  const resultWrong = GameEngine.submitDiagnosis(patient2, wrongDiagId);
  assert.equal(resultWrong.isCorrect, false);
  assert.equal(resultWrong.score, 0);
});

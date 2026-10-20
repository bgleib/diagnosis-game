/**
 * Medical Diagnostic Game Engine
 */

import { CHIEF_COMPLAINTS, DIAGNOSES, SYMPTOMS, INVESTIGATIONS } from './data.js';

export class GameEngine {
  /**
   * Generates a new patient case.
   * @param {Object} options
   * @param {string} [options.chiefComplaintId] - Specific chief complaint, or random if null.
   * @param {string} [options.mode='realistic'] - 'realistic' (weighted by prior) or 'unicorn' (uniform random).
   * @param {Function} [options.rng=Math.random] - Custom PRNG for testability.
   * @returns {Object} Patient case state object.
   */
  static generatePatient({ chiefComplaintId = null, mode = 'realistic', rng = Math.random } = {}) {
    // 1. Select Chief Complaint
    const ccKeys = Object.keys(CHIEF_COMPLAINTS);
    const selectedCCId = chiefComplaintId && CHIEF_COMPLAINTS[chiefComplaintId]
      ? chiefComplaintId
      : ccKeys[Math.floor(rng() * ccKeys.length)];

    const chiefComplaint = CHIEF_COMPLAINTS[selectedCCId];
    const candidateDiagnosisIds = chiefComplaint.diagnoses;

    // 2. Select Hidden Diagnosis based on Mode
    let chosenDiagnosisId;
    if (mode === 'unicorn') {
      // Uniform random selection
      const idx = Math.floor(rng() * candidateDiagnosisIds.length);
      chosenDiagnosisId = candidateDiagnosisIds[idx];
    } else {
      // Realistic mode: weighted selection by prior probability
      const candidateObjects = candidateDiagnosisIds.map(id => DIAGNOSES[id]);
      const totalPrior = candidateObjects.reduce((sum, d) => sum + d.prior, 0);
      let roll = rng() * totalPrior;
      chosenDiagnosisId = candidateObjects[candidateObjects.length - 1].id; // fallback
      for (const d of candidateObjects) {
        if (roll < d.prior) {
          chosenDiagnosisId = d.id;
          break;
        }
        roll -= d.prior;
      }
    }

    const trueDiagnosis = DIAGNOSES[chosenDiagnosisId];

    // 3. Roll true underlying symptoms for this patient based on P(S | D)
    const trueSymptoms = {};
    for (const symptomId of Object.keys(SYMPTOMS)) {
      const prob = trueDiagnosis.symptomProbabilities[symptomId] || 0.0;
      trueSymptoms[symptomId] = rng() < prob;
    }

    // Return patient state object
    return {
      id: `PATIENT-${Date.now().toString(36).toUpperCase()}`,
      mode,
      chiefComplaint,
      trueDiagnosis,
      trueSymptoms,
      investigationHistory: [],
      isFinished: false,
      finalDiagnosis: null,
      score: null
    };
  }

  /**
   * Runs an investigation on a patient and updates investigation history.
   * @param {Object} patient - Patient case state object.
   * @param {string} investigationId - ID of investigation to run.
   * @param {Function} [rng=Math.random] - Custom PRNG.
   * @returns {Object} Investigation result summary.
   */
  static runInvestigation(patient, investigationId, rng = Math.random) {
    const investigation = INVESTIGATIONS[investigationId];
    if (!investigation) {
      throw new Error(`Unknown investigation ID: ${investigationId}`);
    }

    // Check if already ordered
    const existing = patient.investigationHistory.find(item => item.investigationId === investigationId);
    if (existing) {
      return existing;
    }

    const symptomResults = [];

    for (const [symptomId, perf] of Object.entries(investigation.symptomPerformance)) {
      const symptom = SYMPTOMS[symptomId];
      const isTruePresent = !!patient.trueSymptoms[symptomId];
      const sensitivity = perf.sensitivity;
      const specificity = perf.specificity;

      // Probability of positive result:
      // If symptom present -> sensitivity
      // If symptom absent -> 1 - specificity (false positive rate)
      const probPositive = isTruePresent ? sensitivity : (1 - specificity);
      const isDetected = rng() < probPositive;

      symptomResults.push({
        symptomId,
        symptomName: symptom ? symptom.name : symptomId,
        isDetected,
        sensitivity,
        specificity,
        isTruePresent // included for post-game recap
      });
    }

    const record = {
      investigationId,
      investigationName: investigation.name,
      category: investigation.category,
      timestamp: Date.now(),
      symptomResults
    };

    patient.investigationHistory.push(record);
    return record;
  }

  /**
   * Calculates posterior probability distribution over candidate diagnoses using Bayes' Theorem.
   * @param {Object} patient - Patient case state object.
   * @returns {Array<{diagnosis: Object, prior: number, posterior: number, likelihoodRatio: number}>}
   */
  static calculatePosteriorProbabilities(patient) {
    const candidateIds = patient.chiefComplaint.diagnoses;
    const candidates = candidateIds.map(id => DIAGNOSES[id]);

    // 1. Initialize prior weights
    const totalPrior = candidates.reduce((sum, d) => sum + d.prior, 0);
    const likelihoods = {};
    for (const d of candidates) {
      likelihoods[d.id] = d.prior / totalPrior;
    }

    // 2. Multiply likelihoods for each test result in investigation history
    for (const record of patient.investigationHistory) {
      for (const res of record.symptomResults) {
        const { symptomId, isDetected, sensitivity, specificity } = res;

        for (const d of candidates) {
          const pS = d.symptomProbabilities[symptomId] || 0.0;

          let pResultGivenD;
          if (isDetected) {
            // P(Detected | D) = P(S|D)*Sens + P(~S|D)*(1 - Spec)
            pResultGivenD = (pS * sensitivity) + ((1 - pS) * (1 - specificity));
          } else {
            // P(Not Detected | D) = P(S|D)*(1 - Sens) + P(~S|D)*Spec
            pResultGivenD = (pS * (1 - sensitivity)) + ((1 - pS) * specificity);
          }

          likelihoods[d.id] *= pResultGivenD;
        }
      }
    }

    // 3. Normalize to get posteriors
    const totalLikelihood = Object.values(likelihoods).reduce((sum, val) => sum + val, 0);

    return candidates.map(d => {
      const priorNorm = d.prior / totalPrior;
      const posterior = totalLikelihood > 0 ? (likelihoods[d.id] / totalLikelihood) : (1 / candidates.length);
      return {
        diagnosis: d,
        prior: priorNorm,
        posterior
      };
    }).sort((a, b) => b.posterior - a.posterior);
  }

  /**
   * Submits a diagnosis and calculates final case evaluation score.
   * @param {Object} patient - Patient case state.
   * @param {string} submittedDiagnosisId - Selected diagnosis ID.
   * @returns {Object} Evaluation summary.
   */
  static submitDiagnosis(patient, submittedDiagnosisId) {
    const isCorrect = (submittedDiagnosisId === patient.trueDiagnosis.id);
    const posteriors = GameEngine.calculatePosteriorProbabilities(patient);
    const submittedPosterior = posteriors.find(p => p.diagnosis.id === submittedDiagnosisId)?.posterior || 0;

    const testsRunCount = patient.investigationHistory.length;

    // Base score: 1000 for correct diagnosis, 0 for incorrect
    let score = isCorrect ? 1000 : 0;

    // Small penalty per test ordered to discourage unnecessary spamming (e.g., -20 per test)
    if (isCorrect) {
      score = Math.max(100, score - (testsRunCount * 25));
    }

    patient.isFinished = true;
    patient.finalDiagnosis = DIAGNOSES[submittedDiagnosisId];
    patient.score = {
      isCorrect,
      score,
      testsRunCount,
      submittedPosterior,
      trueDiagnosis: patient.trueDiagnosis,
      posteriors
    };

    return patient.score;
  }
}

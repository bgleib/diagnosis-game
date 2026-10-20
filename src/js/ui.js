/**
 * UI Renderer and Controller
 */

import { GameEngine } from './engine.js';
import { CHIEF_COMPLAINTS, DIAGNOSES, SYMPTOMS, INVESTIGATIONS } from './data.js';

class UIController {
  constructor() {
    this.currentPatient = null;
    this.selectedDiagnosisId = null;

    // UI Toggles
    this.showNumericValues = true;
    this.showBayesianAssist = true;
    this.patientMode = 'realistic';

    // DOM Elements
    this.elPatientId = document.getElementById('patient-id-badge');
    this.elModeSelect = document.getElementById('mode-select');
    this.elToggleNumbers = document.getElementById('toggle-numbers');
    this.elToggleDifferentials = document.getElementById('toggle-differentials');
    this.elBtnNextPatient = document.getElementById('btn-next-patient');

    this.elCCTitle = document.getElementById('cc-title');
    this.elCCDesc = document.getElementById('cc-description');
    this.elOrderedCount = document.getElementById('investigations-count');
    this.elOrderedList = document.getElementById('ordered-investigations-list');

    this.elInvestigationsMenu = document.getElementById('investigations-menu');
    this.elFindingsLog = document.getElementById('findings-log');
    this.elDifferentialContainer = document.getElementById('differential-container');
    this.elBtnSubmit = document.getElementById('btn-submit-diagnosis');

    // Modal Elements
    this.elModalBackdrop = document.getElementById('modal-backdrop');
    this.elModalHeader = document.getElementById('modal-header');
    this.elModalTitle = document.getElementById('modal-title');
    this.elModalScoreBadge = document.getElementById('modal-score-badge');
    this.elModalSubmitted = document.getElementById('modal-submitted');
    this.elModalTrue = document.getElementById('modal-true');
    this.elModalTestsCount = document.getElementById('modal-tests-count');
    this.elModalProb = document.getElementById('modal-prob');
    this.elModalDesc = document.getElementById('modal-diagnosis-desc');
    this.elBtnModalNext = document.getElementById('btn-modal-next');

    this.initEventListeners();
    this.startNewPatient();
  }

  initEventListeners() {
    this.elModeSelect.addEventListener('change', (e) => {
      this.patientMode = e.target.value;
      this.startNewPatient();
    });

    this.elToggleNumbers.addEventListener('change', (e) => {
      this.showNumericValues = e.target.checked;
      this.render();
    });

    this.elToggleDifferentials.addEventListener('change', (e) => {
      this.showBayesianAssist = e.target.checked;
      this.render();
    });

    this.elBtnNextPatient.addEventListener('click', () => {
      this.startNewPatient();
    });

    this.elBtnSubmit.addEventListener('click', () => {
      this.submitDiagnosis();
    });

    this.elBtnModalNext.addEventListener('click', () => {
      this.hideModal();
      this.startNewPatient();
    });
  }

  startNewPatient() {
    this.selectedDiagnosisId = null;
    this.currentPatient = GameEngine.generatePatient({
      mode: this.patientMode
    });
    this.render();
  }

  orderInvestigation(investigationId) {
    if (this.currentPatient.isFinished) return;

    GameEngine.runInvestigation(this.currentPatient, investigationId);
    this.render();
  }

  selectDiagnosis(diagnosisId) {
    if (this.currentPatient.isFinished) return;

    this.selectedDiagnosisId = diagnosisId;
    this.renderDifferentials();
    this.elBtnSubmit.disabled = !this.selectedDiagnosisId;
  }

  submitDiagnosis() {
    if (!this.selectedDiagnosisId || this.currentPatient.isFinished) return;

    const evaluation = GameEngine.submitDiagnosis(this.currentPatient, this.selectedDiagnosisId);
    this.renderModal(evaluation);
  }

  render() {
    if (!this.currentPatient) return;

    // Header Badge
    this.elPatientId.textContent = `Patient ID: ${this.currentPatient.id}`;

    // Chart
    this.elCCTitle.textContent = this.currentPatient.chiefComplaint.name;
    this.elCCDesc.textContent = this.currentPatient.chiefComplaint.description;

    this.renderOrderedList();
    this.renderInvestigationsMenu();
    this.renderFindingsLog();
    this.renderDifferentials();

    this.elBtnSubmit.disabled = !this.selectedDiagnosisId || this.currentPatient.isFinished;
  }

  renderOrderedList() {
    const history = this.currentPatient.investigationHistory;
    this.elOrderedCount.textContent = history.length;

    if (history.length === 0) {
      this.elOrderedList.innerHTML = `<li class="empty-text">No investigations ordered yet.</li>`;
      return;
    }

    this.elOrderedList.innerHTML = history.map(item => `
      <li class="ordered-item">
        <strong>${item.investigationName}</strong>
        <span class="badge">${item.category}</span>
      </li>
    `).join('');
  }

  renderInvestigationsMenu() {
    const historyIds = new Set(this.currentPatient.investigationHistory.map(h => h.investigationId));

    this.elInvestigationsMenu.innerHTML = Object.values(INVESTIGATIONS).map(inv => {
      const isOrdered = historyIds.has(inv.id);

      // Build symptom performance tags if numeric values enabled
      let perfTags = '';
      if (this.showNumericValues) {
        perfTags = `
          <div class="symptom-performance-tags">
            ${Object.entries(inv.symptomPerformance).map(([symId, perf]) => {
              const sym = SYMPTOMS[symId];
              return `<span class="perf-tag" title="Sens: ${Math.round(perf.sensitivity*100)}%, Spec: ${Math.round(perf.specificity*100)}%">
                ${sym ? sym.name : symId}: S:${Math.round(perf.sensitivity*100)}% / Sp:${Math.round(perf.specificity*100)}%
              </span>`;
            }).join('')}
          </div>
        `;
      }

      return `
        <div class="investigation-card ${isOrdered ? 'ordered' : ''}">
          <div class="investigation-card-header">
            <span class="investigation-title">${inv.name}</span>
            <button class="btn btn-secondary btn-sm"
              ${isOrdered || this.currentPatient.isFinished ? 'disabled' : ''}
              data-id="${inv.id}">
              ${isOrdered ? 'Ordered' : 'Order'}
            </button>
          </div>
          <div class="investigation-desc">${inv.description}</div>
          ${perfTags}
        </div>
      `;
    }).join('');

    // Attach click handlers
    this.elInvestigationsMenu.querySelectorAll('button[data-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.orderInvestigation(id);
      });
    });
  }

  renderFindingsLog() {
    const history = this.currentPatient.investigationHistory;

    if (history.length === 0) {
      this.elFindingsLog.innerHTML = `<p class="empty-text">Run an investigation from the center menu to gather evidence.</p>`;
      return;
    }

    this.elFindingsLog.innerHTML = history.map(item => `
      <div class="finding-entry">
        <div class="finding-header">🔬 ${item.investigationName}</div>
        ${item.symptomResults.map(res => `
          <div class="finding-item">
            <span class="status-badge ${res.isDetected ? 'in' : 'out'}">
              ${res.isDetected ? 'RULED IN / POSITIVE' : 'RULED OUT / NEGATIVE'}
            </span>
            <span>${res.symptomName}</span>
          </div>
        `).join('')}
      </div>
    `).join('');

    // Scroll to bottom
    this.elFindingsLog.scrollTop = this.elFindingsLog.scrollHeight;
  }

  renderDifferentials() {
    const posteriors = GameEngine.calculatePosteriorProbabilities(this.currentPatient);

    this.elDifferentialContainer.innerHTML = posteriors.map(item => {
      const diag = item.diagnosis;
      const isSelected = this.selectedDiagnosisId === diag.id;
      const pct = Math.round(item.posterior * 100);

      const probDisplay = this.showBayesianAssist
        ? (this.showNumericValues ? `${pct}%` : `${'█'.repeat(Math.ceil(pct / 10))}`)
        : '--';

      return `
        <div class="differential-card ${isSelected ? 'selected' : ''}" data-diag-id="${diag.id}">
          <input type="radio" name="differential" class="differential-radio" ${isSelected ? 'checked' : ''}>
          <div class="differential-info">
            <div class="differential-name">${diag.name}</div>
            ${this.showBayesianAssist ? `
              <div class="prob-bar-container">
                <div class="prob-bar-fill" style="width: ${pct}%"></div>
              </div>
            ` : ''}
          </div>
          <div class="differential-prob-value">${probDisplay}</div>
        </div>
      `;
    }).join('');

    // Attach click handlers
    this.elDifferentialContainer.querySelectorAll('.differential-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-diag-id');
        this.selectDiagnosis(id);
      });
    });
  }

  renderModal(evaluation) {
    const isCorrect = evaluation.isCorrect;

    this.elModalHeader.className = `modal-header ${isCorrect ? 'correct' : 'incorrect'}`;
    this.elModalTitle.textContent = isCorrect ? '🎉 Correct Diagnosis!' : '❌ Incorrect Diagnosis';
    this.elModalScoreBadge.textContent = `Score: ${evaluation.score}`;

    this.elModalSubmitted.textContent = this.currentPatient.finalDiagnosis.name;
    this.elModalTrue.textContent = evaluation.trueDiagnosis.name;
    this.elModalTestsCount.textContent = evaluation.testsRunCount;
    this.elModalProb.textContent = `${Math.round(evaluation.submittedPosterior * 100)}%`;
    this.elModalDesc.textContent = evaluation.trueDiagnosis.description;

    this.elModalBackdrop.classList.remove('hidden');
  }

  hideModal() {
    this.elModalBackdrop.classList.add('hidden');
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new UIController();
});

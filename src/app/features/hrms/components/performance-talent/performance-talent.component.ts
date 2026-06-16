import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, Appraisal, PeerFeedback, CareerMilestone, SuccessionPlan } from '../../services/hrms.service';

@Component({
  selector: 'app-performance-talent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './performance-talent.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class PerformanceTalentComponent {
  private hrmsService = inject(HrmsService);

  employees = this.hrmsService.employees;
  appraisals = this.hrmsService.appraisals;
  peerFeedbacks = this.hrmsService.peerFeedbacks;
  successionPlans = this.hrmsService.successionPlans;

  // Local State
  activeSubTab = signal<'appraisals' | 'feedback' | 'succession'>('appraisals');
  isFeedbackModalOpen = signal<boolean>(false);
  isAppraisalModalOpen = signal<boolean>(false);
  selectedAppraisal = signal<Appraisal | null>(null);

  // New feedback model
  newFeedback = {
    employeeId: 'EMP-001',
    reviewerName: 'Sophia Chen',
    relationship: 'Peer' as const,
    comments: '',
    leadership: 4,
    teamwork: 4,
    execution: 4
  };

  // Career Path Milestones definition
  careerMilestones: CareerMilestone[] = [
    { role: 'Associate Software Engineer', minExperienceYears: 0, requiredCertifications: ['Onboarding Badge'], keyCompetencies: ['HTML/CSS Basics', 'OOP Principles', 'Basic Git Workflow'] },
    { role: 'Software Engineer', minExperienceYears: 2, requiredCertifications: ['Advanced TS Academy'], keyCompetencies: ['Component Design', 'Unit Testing', 'API Integration'] },
    { role: 'Senior Software Engineer', minExperienceYears: 5, requiredCertifications: ['Enterprise Angular Architecture'], keyCompetencies: ['State Management', 'Performance Profiling', 'CI/CD Pipelines'] },
    { role: 'Engineering Lead / Staff Engineer', minExperienceYears: 8, requiredCertifications: ['AWS Cloud Specialist', 'Scrum Leader'], keyCompetencies: ['System Design', 'Mentorship & Hiring', 'Technical Strategy'] }
  ];

  setSubTab(tab: 'appraisals' | 'feedback' | 'succession') {
    this.activeSubTab.set(tab);
  }

  openFeedbackModal() {
    this.isFeedbackModalOpen.set(true);
  }

  closeFeedbackModal() {
    this.isFeedbackModalOpen.set(false);
    this.newFeedback.comments = '';
  }

  saveFeedback() {
    if (!this.newFeedback.comments) {
      alert('Please fill out the comments field.');
      return;
    }

    const nextFeedback: PeerFeedback = {
      id: `PF-00${this.peerFeedbacks().length + 1}`,
      employeeId: this.newFeedback.employeeId,
      reviewerName: this.newFeedback.reviewerName,
      relationship: this.newFeedback.relationship,
      feedbackDate: new Date().toISOString().split('T')[0],
      competencyScores: {
        leadership: Number(this.newFeedback.leadership),
        teamwork: Number(this.newFeedback.teamwork),
        execution: Number(this.newFeedback.execution)
      },
      comments: this.newFeedback.comments
    };

    this.peerFeedbacks.update(list => [...list, nextFeedback]);
    this.closeFeedbackModal();
  }

  viewAppraisalDetail(appraisal: Appraisal) {
    this.selectedAppraisal.set(appraisal);
    this.isAppraisalModalOpen.set(true);
  }

  closeAppraisalModal() {
    this.isAppraisalModalOpen.set(false);
    this.selectedAppraisal.set(null);
  }

  updateAppraisalScore(appraisal: Appraisal, score: number) {
    const updated = { ...appraisal, overallScore: score, status: 'Completed' as const };
    this.hrmsService.saveAppraisalApi(updated).subscribe(res => {
      this.closeAppraisalModal();
    });
  }
}

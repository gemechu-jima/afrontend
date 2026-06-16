import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, Candidate, OnboardingTask } from '../../services/hrms.service';

@Component({
  selector: 'app-digital-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './digital-onboarding.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class DigitalOnboardingComponent {
  private hrmsService = inject(HrmsService);

  candidates = this.hrmsService.candidates;
  onboardingTasks = this.hrmsService.onboardingTasks;

  // Selected new hire
  selectedCandidateId = signal<string>('CAN-003'); // Default to Steve Jobs

  // Filter hires who are offered/hired
  newHiresList = computed(() => 
    this.candidates().filter(c => c.stage === 'Offered' || c.stage === 'Hired')
  );

  selectedCandidate = computed(() => 
    this.candidates().find(c => c.id === this.selectedCandidateId()) || this.newHiresList()[0]
  );

  // Filter tasks for selected hire
  hireTasks = computed(() => 
    this.onboardingTasks().filter(t => t.candidateId === this.selectedCandidateId())
  );

  // Overall onboarding progress
  onboardingProgress = computed(() => {
    const tasks = this.hireTasks();
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  });

  selectHire(id: string) {
    this.selectedCandidateId.set(id);
  }

  toggleTask(taskId: string) {
    this.hrmsService.toggleOnboardingTask(taskId);
  }

  getCategoryBadgeClass(category: string) {
    switch(category) {
      case 'IT Setup': return 'bg-blue-500/10 text-blue-400 border border-blue-550/20';
      case 'HR Docs': return 'bg-violet-500/10 text-violet-400 border border-violet-550/20';
      case 'Training': return 'bg-amber-500/10 text-amber-400 border border-amber-550/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border border-emerald-550/20';
    }
  }
}

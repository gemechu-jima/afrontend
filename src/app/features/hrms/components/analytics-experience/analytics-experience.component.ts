import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, WellnessActivity, Employee } from '../../services/hrms.service';

@Component({
  selector: 'app-analytics-experience',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics-experience.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class AnalyticsExperienceComponent {
  private hrmsService = inject(HrmsService);

  employees = this.hrmsService.employees;
  wellnessActivities = this.hrmsService.wellnessActivities;
  engagementMetrics = this.hrmsService.engagementMetrics;
  leaveRequests = this.hrmsService.leaveRequests;

  // Selected view: 'hr_manager' or 'employee_portal'
  portalView = signal<'hr_manager' | 'employee_portal'>('hr_manager');

  // Simulated logged-in employee ID: EMP-001 (Alexander Wright)
  myEmployeeId = 'EMP-001';

  // Local State: Personal Profile Editor
  isProfileEditing = signal<boolean>(false);
  editedEmail = signal<string>('a.wright@company.com');
  editedPhone = signal<string>('+1 (555) 234-5678');

  // Local State: Engagement Survey
  surveyScore = signal<number>(5);
  surveyComment = signal<string>('');
  surveySubmitted = signal<boolean>(false);

  // Computed: My Profile details
  myProfile = computed(() => {
    return this.employees().find(e => e.id === this.myEmployeeId);
  });

  // Computed: My Leaves Remaining (from total standard 22 days)
  myLeavesRemaining = computed(() => {
    const approvedCount = this.leaveRequests()
      .filter(r => r.employeeId === this.myEmployeeId && r.status === 'Approved')
      .reduce((sum, req) => sum + req.days, 0);
    return Math.max(0, 22 - approvedCount);
  });

  setPortalView(view: 'hr_manager' | 'employee_portal') {
    this.portalView.set(view);
  }

  joinWellness(activityId: string) {
    this.hrmsService.joinWellnessActivityApi(activityId).subscribe();
  }

  submitSurvey() {
    this.surveySubmitted.set(true);
    // Emulate updating metrics
    const current = this.engagementMetrics();
    this.engagementMetrics.set({
      ...current,
      workLifeBalanceRating: Math.round(((current.workLifeBalanceRating * 10 + this.surveyScore()) / 11) * 10) / 10
    });
  }

  startProfileEdit() {
    const prof = this.myProfile();
    if (prof) {
      this.editedEmail.set(prof.email);
    }
    this.isProfileEditing.set(true);
  }

  saveProfileEdit() {
    this.employees.update(list => 
      list.map(emp => 
        emp.id === this.myEmployeeId 
          ? { ...emp, email: this.editedEmail().trim() } 
          : emp
      )
    );
    this.isProfileEditing.set(false);
  }

  cancelProfileEdit() {
    this.isProfileEditing.set(false);
  }
}

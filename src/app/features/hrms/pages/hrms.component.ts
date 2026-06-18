import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDirectoryComponent } from '../components/employee-directory/employee-directory.component';
import { WorkflowBuilderComponent } from '../components/workflow-builder/workflow-builder.component';
import { TimeAttendanceComponent } from '../components/time-attendance/time-attendance.component';
import { LeaveManagementComponent } from '../components/leave-management/leave-management.component';
import { ShiftPlannerComponent } from '../components/shift-planner/shift-planner.component';
import { RecruitmentAtsComponent } from '../components/recruitment-ats/recruitment-ats.component';
import { DigitalOnboardingComponent } from '../components/digital-onboarding/digital-onboarding.component';
import { PerformanceTalentComponent } from '../components/performance-talent/performance-talent.component';
import { LearningDevelopmentComponent } from '../components/learning-development/learning-development.component';
import { AnalyticsExperienceComponent } from '../components/analytics-experience/analytics-experience.component';
import {Mat_Icon} from "../../../shared/ui.module"
@Component({
  selector: 'app-hrms',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeDirectoryComponent,
    WorkflowBuilderComponent,
    TimeAttendanceComponent,
    LeaveManagementComponent,
    ShiftPlannerComponent,
    RecruitmentAtsComponent,
    DigitalOnboardingComponent,
    PerformanceTalentComponent,
    LearningDevelopmentComponent,
    AnalyticsExperienceComponent,
    Mat_Icon
  ],
  templateUrl: './hrms.component.html',
  styleUrl: './hrms.component.css'
})
export class HrmsComponent {
  // Navigation active tab
  activeTab = signal<string>('overview');

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }
  today = new Date();
}

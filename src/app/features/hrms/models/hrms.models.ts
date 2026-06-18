type EmployeeStatus = 'Active' | 'Remote' | 'On Leave';
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  joinDate: string;
  status: EmployeeStatus;
  salary: number;
  performanceRating?: number;
}

export interface WorkflowStep {
  id: string;
  role: string;
  approverName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'Leave' | 'Payroll' | 'Recruitment' | 'Expense';
  status: 'Active' | 'Inactive';
  steps: WorkflowStep[];
}

export interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  totalHours: number;
  status: 'On Time' | 'Late' | 'Absent' | 'Overtime';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  days: number;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  shiftType: 'Morning (08:00 - 16:00)' | 'Evening (16:00 - 00:00)' | 'Night (00:00 - 08:00)';
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  status: 'Active' | 'Draft' | 'Closed';
  applicantsCount: number;
  description: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Hired';
  score: number;
  appliedDate: string;
  skills: string[];
}

export interface OnboardingTask {
  id: string;
  candidateId: string;
  taskName: string;
  completed: boolean;
  category: 'IT Setup' | 'HR Docs' | 'Training' | 'Finance';
}

export interface Appraisal {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerName: string;
  reviewPeriod: string;
  goals: string[];
  status: 'Draft' | 'Awaiting Employee' | 'Awaiting Manager' | 'Completed';
  overallScore: number;
  feedbackText: string;
}

export interface PeerFeedback {
  id: string;
  employeeId: string;
  reviewerName: string;
  relationship: 'Peer' | 'Manager' | 'Direct Report';
  feedbackDate: string;
  competencyScores: { leadership: number; teamwork: number; execution: number };
  comments: string;
}

export interface CareerMilestone {
  role: string;
  minExperienceYears: number;
  requiredCertifications: string[];
  keyCompetencies: string[];
}

export interface SuccessionPlan {
  keyRole: string;
  currentIncumbent: string;
  readinessRating: 'Ready Now' | 'Ready in 1 Year' | 'Ready in 2-3 Years';
  potentialSuccessors: { employeeId: string; name: string; matchPercentage: number }[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  instructor: string;
  durationHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolledCount: number;
  rating: number;
}

export interface EmployeeCourseProgress {
  courseId: string;
  employeeId: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  percentComplete: number;
  certificateIssued: boolean;
  completionDate?: string;
}

export interface WellnessActivity {
  id: string;
  title: string;
  description: string;
  type: 'Fitness' | 'Mental Health' | 'Work-life Balance';
  pointsReward: number;
  participantsCount: number;
}

export interface EngagementMetrics {
  eNPS: number;
  retentionRate: number;
  workLifeBalanceRating: number;
  burnoutRiskPercentage: number;
}

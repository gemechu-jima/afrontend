import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Employee,
  LeaveRequest,
  Workflow,
  AttendanceLog,
  Shift,
  JobPosting,
  Candidate,
  OnboardingTask,
  SuccessionPlan,
  PeerFeedback,
  Appraisal,
  TrainingCourse,
  EmployeeCourseProgress,
  EngagementMetrics,
  WellnessActivity
} from '../models/hrms.models';
export * from '../models/hrms.models';

@Injectable({
  providedIn: 'root'
})
export class HrmsService {
  // --- BASE SEED DATA (SIGNALS) ---
  employees = signal<Employee[]>([
    { id: 'EMP-001', name: 'Alexander Wright', role: 'Engineering Lead', department: 'Engineering', email: 'a.wright@company.com', joinDate: '2023-03-12', status: 'Active', salary: 115000, performanceRating: 4.8 },
    { id: 'EMP-002', name: 'Sophia Chen', role: 'Senior UX Designer', department: 'Design', email: 's.chen@company.com', joinDate: '2023-08-20', status: 'Active', salary: 95000, performanceRating: 4.6 },
    { id: 'EMP-003', name: 'Marcus Sterling', role: 'VP of Product', department: 'Product', email: 'm.sterling@company.com', joinDate: '2022-01-15', status: 'Remote', salary: 140000, performanceRating: 4.9 },
    { id: 'EMP-004', name: 'Elena Rostova', role: 'HR Operations Manager', department: 'HR', email: 'e.rostova@company.com', joinDate: '2024-02-10', status: 'Active', salary: 85000, performanceRating: 4.5 },
    { id: 'EMP-005', name: 'Devon Miller', role: 'DevOps Engineer', department: 'Engineering', email: 'd.miller@company.com', joinDate: '2023-11-01', status: 'On Leave', salary: 105000, performanceRating: 4.2 },
    { id: 'EMP-006', name: 'Olivia Vance', role: 'Account Executive', department: 'Sales', email: 'o.vance@company.com', joinDate: '2024-04-18', status: 'Active', salary: 78000, performanceRating: 4.0 },
    { id: 'EMP-007', name: 'Jordan Sparks', role: 'Talent Acquisition', department: 'HR', email: 'j.sparks@company.com', joinDate: '2024-05-22', status: 'Remote', salary: 72000, performanceRating: 4.3 }
  ]);

  leaveRequests = signal<LeaveRequest[]>([
    { id: 'LR-101', employeeId: 'EMP-005', employeeName: 'Devon Miller', type: 'Annual Leave', startDate: '2026-06-14', endDate: '2026-06-21', reason: 'Family vacation', status: 'Approved', days: 5 },
    { id: 'LR-102', employeeId: 'EMP-002', employeeName: 'Sophia Chen', type: 'Sick Leave', startDate: '2026-06-18', endDate: '2026-06-19', reason: 'Dental surgery', status: 'Pending', days: 2 },
    { id: 'LR-103', employeeId: 'EMP-006', employeeName: 'Olivia Vance', type: 'Annual Leave', startDate: '2026-07-02', endDate: '2026-07-09', reason: 'Personal holiday', status: 'Pending', days: 5 }
  ]);

  workflows = signal<Workflow[]>([
    {
      id: 'WF-001',
      name: 'Leave Approval Workflow',
      description: 'Standard routing for employee annual/sick leaves request.',
      category: 'Leave',
      status: 'Active',
      steps: [
        { id: 'WFS-001', role: 'Direct Supervisor', approverName: 'Alexander Wright', status: 'Approved' },
        { id: 'WFS-002', role: 'HR Operations', approverName: 'Elena Rostova', status: 'Pending' }
      ]
    },
    {
      id: 'WF-002',
      name: 'Executive Expense Approval',
      description: 'Routing for travel and business expenses exceeding $1,000.',
      category: 'Expense',
      status: 'Active',
      steps: [
        { id: 'WFS-003', role: 'Finance Analyst', approverName: 'Admin', status: 'Pending' },
        { id: 'WFS-004', role: 'VP of Operations', approverName: 'Marcus Sterling', status: 'Pending' }
      ]
    }
  ]);

  attendanceLogs = signal<AttendanceLog[]>([
    { id: 'AT-201', employeeId: 'EMP-001', employeeName: 'Alexander Wright', date: '2026-06-15', clockIn: '08:45 AM', clockOut: '05:15 PM', totalHours: 8.5, status: 'On Time' },
    { id: 'AT-202', employeeId: 'EMP-002', employeeName: 'Sophia Chen', date: '2026-06-15', clockIn: '09:12 AM', clockOut: '06:00 PM', totalHours: 8.8, status: 'Late' },
    { id: 'AT-203', employeeId: 'EMP-003', employeeName: 'Marcus Sterling', date: '2026-06-15', clockIn: '08:30 AM', clockOut: '05:00 PM', totalHours: 8.5, status: 'On Time' },
    { id: 'AT-204', employeeId: 'EMP-004', employeeName: 'Elena Rostova', date: '2026-06-15', clockIn: '08:58 AM', clockOut: '06:30 PM', totalHours: 9.5, status: 'Overtime' }
  ]);

  shifts = signal<Shift[]>([
    { id: 'SF-001', employeeId: 'EMP-001', employeeName: 'Alexander Wright', dayOfWeek: 'Monday', shiftType: 'Morning (08:00 - 16:00)' },
    { id: 'SF-002', employeeId: 'EMP-002', employeeName: 'Sophia Chen', dayOfWeek: 'Monday', shiftType: 'Morning (08:00 - 16:00)' },
    { id: 'SF-003', employeeId: 'EMP-004', employeeName: 'Elena Rostova', dayOfWeek: 'Monday', shiftType: 'Evening (16:00 - 00:00)' },
    { id: 'SF-004', employeeId: 'EMP-005', employeeName: 'Devon Miller', dayOfWeek: 'Monday', shiftType: 'Night (00:00 - 08:00)' },
    { id: 'SF-005', employeeId: 'EMP-001', employeeName: 'Alexander Wright', dayOfWeek: 'Tuesday', shiftType: 'Morning (08:00 - 16:00)' },
    { id: 'SF-006', employeeId: 'EMP-003', employeeName: 'Marcus Sterling', dayOfWeek: 'Tuesday', shiftType: 'Evening (16:00 - 00:00)' }
  ]);

  jobPostings = signal<JobPosting[]>([
    { id: 'JOB-001', title: 'Senior Frontend Engineer (Angular)', department: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', status: 'Active', applicantsCount: 14, description: 'Seeking a veteran Angular designer capable of modern reactive architecture using signals.' },
    { id: 'JOB-002', title: 'Lead Staff Recruiter', department: 'HR', location: 'Remote', type: 'Contract', status: 'Active', applicantsCount: 8, description: 'Drive global recruitment efforts across tech teams, implementing onboarding systems.' }
  ]);

  candidates = signal<Candidate[]>([
    { id: 'CAN-001', name: 'Christian Bale', email: 'c.bale@actors.com', jobTitle: 'Senior Frontend Engineer (Angular)', stage: 'Screening', score: 85, appliedDate: '2026-06-10', skills: ['Angular', 'TypeScript', 'Tailwind', 'RxJS'] },
    { id: 'CAN-002', name: 'Nathalie Emmanuel', email: 'n.emmanuel@frontend.dev', jobTitle: 'Senior Frontend Engineer (Angular)', stage: 'Interview', score: 94, appliedDate: '2026-06-08', skills: ['Angular', 'NgRx', 'CSS Grid', 'A11y'] },
    { id: 'CAN-003', name: 'Steve Jobs', email: 'steve@apple.com', jobTitle: 'Lead Product Manager', stage: 'Offered', score: 99, appliedDate: '2026-06-01', skills: ['Keynote', 'Design Thinking', 'iOS', 'Strategy'] },
    { id: 'CAN-004', name: 'Scarlett Johansson', email: 'scarlett@marvel.com', jobTitle: 'Lead Staff Recruiter', stage: 'Applied', score: 72, appliedDate: '2026-06-12', skills: ['Sourcing', 'ATS', 'LinkedIn', 'Interviews'] }
  ]);

  onboardingTasks = signal<OnboardingTask[]>([
    { id: 'TASK-001', candidateId: 'CAN-003', taskName: 'Direct Deposit Form Submission', completed: true, category: 'Finance' },
    { id: 'TASK-002', candidateId: 'CAN-003', taskName: 'Hardware Setup & Laptop Provisioning', completed: false, category: 'IT Setup' },
    { id: 'TASK-003', candidateId: 'CAN-003', taskName: 'Sign NDA & Code of Conduct', completed: false, category: 'HR Docs' },
    { id: 'TASK-004', candidateId: 'CAN-003', taskName: 'Security Awareness Briefing', completed: false, category: 'Training' }
  ]);


  // --- ADVANCED SEED DATA (SIGNALS) ---

  // 1. Appraisals & Feedback Cycles
  appraisals = signal<Appraisal[]>([
    {
      id: 'APR-501',
      employeeId: 'EMP-001',
      employeeName: 'Alexander Wright',
      reviewerName: 'Marcus Sterling',
      reviewPeriod: 'Q1-2026',
      goals: ['Implement signals architecture across core modules', 'Reduce page loading speed by 25%'],
      status: 'Awaiting Manager',
      overallScore: 4.8,
      feedbackText: 'Alexander has demonstrated strong leadership. The signals architecture migration is on track.'
    },
    {
      id: 'APR-502',
      employeeId: 'EMP-002',
      employeeName: 'Sophia Chen',
      reviewerName: 'Marcus Sterling',
      reviewPeriod: 'Q1-2026',
      goals: ['Re-design core ERP dashboard layouts', 'Standardize typography & colors system'],
      status: 'Completed',
      overallScore: 4.6,
      feedbackText: 'Sophia is highly creative and execution-focused. Design systems look extremely cohesive.'
    }
  ]);

  peerFeedbacks = signal<PeerFeedback[]>([
    { id: 'PF-001', employeeId: 'EMP-001', reviewerName: 'Sophia Chen', relationship: 'Peer', feedbackDate: '2026-06-10', competencyScores: { leadership: 4, teamwork: 5, execution: 5 }, comments: 'Alexander is always helpful during technical code design reviews and encourages solid code standards.' },
    { id: 'PF-002', employeeId: 'EMP-001', reviewerName: 'Marcus Sterling', relationship: 'Manager', feedbackDate: '2026-06-11', competencyScores: { leadership: 5, teamwork: 4, execution: 5 }, comments: 'Highly competent engineering manager, exceeding core KPI delivery metrics.' }
  ]);

  successionPlans = signal<SuccessionPlan[]>([
    {
      keyRole: 'VP of Product Development',
      currentIncumbent: 'Marcus Sterling',
      readinessRating: 'Ready in 1 Year',
      potentialSuccessors: [
        { employeeId: 'EMP-001', name: 'Alexander Wright', matchPercentage: 88 },
        { employeeId: 'EMP-002', name: 'Sophia Chen', matchPercentage: 74 }
      ]
    }
  ]);

  // 2. Training Modules & Certifications
  trainingCourses = signal<TrainingCourse[]>([
    { id: 'TRN-101', title: 'Enterprise Angular 21 Architecture', instructor: 'Google Developer Expert', durationHours: 12, difficulty: 'Advanced', enrolledCount: 4, rating: 4.9 },
    { id: 'TRN-102', title: 'ERP Security & Compliance Controls', instructor: 'CISO Office Specialist', durationHours: 4, difficulty: 'Beginner', enrolledCount: 12, rating: 4.5 },
    { id: 'TRN-103', title: 'UX Design Systems and Typography', instructor: 'Sophia Chen', durationHours: 8, difficulty: 'Intermediate', enrolledCount: 5, rating: 4.8 }
  ]);

  employeeCourseProgress = signal<EmployeeCourseProgress[]>([
    { courseId: 'TRN-101', employeeId: 'EMP-001', status: 'In Progress', percentComplete: 60, certificateIssued: false },
    { courseId: 'TRN-102', employeeId: 'EMP-001', status: 'Completed', percentComplete: 100, certificateIssued: true, completionDate: '2026-05-15' },
    { courseId: 'TRN-102', employeeId: 'EMP-002', status: 'Completed', percentComplete: 100, certificateIssued: true, completionDate: '2026-06-01' }
  ]);

  // 3. Wellness & Analytics Engagement
  wellnessActivities = signal<WellnessActivity[]>([
    { id: 'WELL-001', title: 'Weekly 15k Walk Challenge', description: 'Log steps daily and compete with team members for wellness tokens.', type: 'Fitness', pointsReward: 100, participantsCount: 8 },
    { id: 'WELL-002', title: 'Daily Midday Meditation Session', description: 'Live mindfulness sessions to reduce workplace stress.', type: 'Mental Health', pointsReward: 50, participantsCount: 15 }
  ]);

  engagementMetrics = signal<EngagementMetrics>({
    eNPS: 62,
    retentionRate: 94.2,
    workLifeBalanceRating: 4.4,
    burnoutRiskPercentage: 12.5
  });

  // --- MOCK API ENDPOINTS (SAMPLE WRAPPERS FOR LATER INTEGRATION) ---
  // Demonstrating HttpClient emulation using RxJS of() delay for frontend asynchronous mocks

  /**
   * Mock API: GET /api/appraisals
   */
  getAppraisalsApi(): Observable<Appraisal[]> {
    return of(this.appraisals()).pipe(delay(500));
  }

  /**
   * Mock API: POST /api/appraisals
   */
  saveAppraisalApi(appraisal: Appraisal): Observable<Appraisal> {
    this.appraisals.update(list =>
      list.map(a => a.id === appraisal.id ? appraisal : a)
    );
    return of(appraisal).pipe(delay(300));
  }

  /**
   * Mock API: GET /api/training/courses
   */
  getTrainingCoursesApi(): Observable<TrainingCourse[]> {
    return of(this.trainingCourses()).pipe(delay(400));
  }

  /**
   * Mock API: POST /api/training/enroll
   */
  enrollInCourseApi(courseId: string, employeeId: string): Observable<EmployeeCourseProgress> {
    const nextProg: EmployeeCourseProgress = {
      courseId,
      employeeId,
      status: 'In Progress',
      percentComplete: 0,
      certificateIssued: false
    };

    // Add to progress tracker
    this.employeeCourseProgress.update(list => [...list, nextProg]);

    // Increment enrolled count
    this.trainingCourses.update(courses =>
      courses.map(c => c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c)
    );

    return of(nextProg).pipe(delay(300));
  }

  /**
   * Mock API: GET /api/analytics/metrics
   */
  getEngagementMetricsApi(): Observable<EngagementMetrics> {
    return of(this.engagementMetrics()).pipe(delay(600));
  }

  /**
   * Mock API: POST /api/wellness/join
   */
  joinWellnessActivityApi(activityId: string): Observable<boolean> {
    this.wellnessActivities.update(list =>
      list.map(act => act.id === activityId ? { ...act, participantsCount: act.participantsCount + 1 } : act)
    );
    return of(true).pipe(delay(200));
  }

  // --- EXISTING LOGIC SYNCS ---

  addEmployee(emp: Omit<Employee, 'id' | 'performanceRating'>) {
    const nextId = `EMP-0${this.employees().length + 1}`;
    const newEmp: Employee = { ...emp, id: nextId, performanceRating: 5.0 };
    this.employees.update(current => [...current, newEmp]);
    return newEmp;
  }

  deleteEmployee(id: string) {
    this.employees.update(current => current.filter(e => e.id !== id));
  }

  approveLeave(id: string) {
    this.leaveRequests.update(requests =>
      requests.map(req => {
        if (req.id === id) {
          this.employees.update(emps =>
            emps.map(e => e.id === req.employeeId ? { ...e, status: 'On Leave' } : e)
          );
          return { ...req, status: 'Approved' };
        }
        return req;
      })
    );
  }

  rejectLeave(id: string) {
    this.leaveRequests.update(requests =>
      requests.map(req => req.id === id ? { ...req, status: 'Rejected' } : req)
    );
  }

  submitLeaveRequest(req: Omit<LeaveRequest, 'id' | 'status'>) {
    const nextId = `LR-${100 + this.leaveRequests().length + 1}`;
    const newReq: LeaveRequest = { ...req, id: nextId, status: 'Pending' };
    this.leaveRequests.update(current => [newReq, ...current]);
  }

  addWorkflowStep(workflowId: string, role: string, approverName: string) {
    this.workflows.update(wfs =>
      wfs.map(wf => {
        if (wf.id === workflowId) {
          const nextStepId = `WFS-00${wf.steps.length + 1}`;
          return {
            ...wf,
            steps: [...wf.steps, { id: nextStepId, role, approverName, status: 'Pending' }]
          };
        }
        return wf;
      })
    );
  }

  clockInEmployee(employeeId: string, employeeName: string) {
    const now = new Date();
    const clockInStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];
    const exists = this.attendanceLogs().find(log => log.employeeId === employeeId && log.date === dateStr);
    if (exists) return;

    const nextId = `AT-${200 + this.attendanceLogs().length + 1}`;
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);
    const newLog: AttendanceLog = {
      id: nextId,
      employeeId,
      employeeName,
      date: dateStr,
      clockIn: clockInStr,
      clockOut: null,
      totalHours: 0,
      status: isLate ? 'Late' : 'On Time'
    };
    this.attendanceLogs.update(logs => [newLog, ...logs]);
  }

  clockOutEmployee(employeeId: string) {
    const dateStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const clockOutStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.attendanceLogs.update(logs =>
      logs.map(log => {
        if (log.employeeId === employeeId && log.date === dateStr && !log.clockOut) {
          const [inHours, inMins] = log.clockIn.split(/[:\s]/);
          const ampm = log.clockIn.split(' ')[1];
          let hours = parseInt(inHours);
          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          const mins = parseInt(inMins);
          const timeDiffHours = Math.round(((now.getHours() + now.getMinutes() / 60) - (hours + mins / 60)) * 10) / 10;
          let status = log.status;
          if (timeDiffHours > 9.0) status = 'Overtime';
          return {
            ...log,
            clockOut: clockOutStr,
            totalHours: Math.max(0.1, timeDiffHours),
            status: status
          };
        }
        return log;
      })
    );
  }

  assignShift(employeeId: string, employeeName: string, day: Shift['dayOfWeek'], type: Shift['shiftType']) {
    const existsIndex = this.shifts().findIndex(s => s.employeeId === employeeId && s.dayOfWeek === day);
    if (existsIndex >= 0) {
      this.shifts.update(list =>
        list.map((s, idx) => idx === existsIndex ? { ...s, shiftType: type } : s)
      );
    } else {
      const nextId = `SF-00${this.shifts().length + 1}`;
      const newShift: Shift = { id: nextId, employeeId, employeeName, dayOfWeek: day, shiftType: type };
      this.shifts.update(list => [...list, newShift]);
    }
  }

  deleteShift(id: string) {
    this.shifts.update(list => list.filter(s => s.id !== id));
  }

  addJobPosting(job: Omit<JobPosting, 'id' | 'applicantsCount'>) {
    const nextId = `JOB-00${this.jobPostings().length + 1}`;
    const newJob: JobPosting = { ...job, id: nextId, applicantsCount: 0 };
    this.jobPostings.update(list => [...list, newJob]);
  }

  updateCandidateStage(candidateId: string, stage: Candidate['stage']) {
    this.candidates.update(list =>
      list.map(c => {
        if (c.id === candidateId) {
          if (stage === 'Hired') {
            const empExists = this.employees().find(e => e.email === c.email);
            if (!empExists) {
              this.addEmployee({
                name: c.name,
                role: c.jobTitle,
                department: 'Engineering',
                email: c.email,
                joinDate: new Date().toISOString().split('T')[0],
                status: 'Active',
                salary: 90000
              });
            }
          }
          return { ...c, stage };
        }
        return c;
      })
    );
  }

  addCandidate(cand: Omit<Candidate, 'id' | 'appliedDate' | 'score'>) {
    const nextId = `CAN-00${this.candidates().length + 1}`;
    const newCand: Candidate = {
      ...cand,
      id: nextId,
      appliedDate: new Date().toISOString().split('T')[0],
      score: Math.floor(Math.random() * 30) + 70
    };
    this.candidates.update(list => [newCand, ...list]);

    const taskCategories: ('Finance' | 'IT Setup' | 'HR Docs' | 'Training')[] = ['Finance', 'IT Setup', 'HR Docs', 'Training'];
    const taskNames = [
      'Direct Deposit Setup',
      'Hardware and Software Provisioning',
      'Sign Contract & Non-Disclosure Agreements',
      'Compliance and Security Walkthrough'
    ];

    const newTasks = taskNames.map((name, index) => ({
      id: `TASK-0${this.onboardingTasks().length + index + 1}`,
      candidateId: nextId,
      taskName: name,
      completed: false,
      category: taskCategories[index]
    }));

    this.onboardingTasks.update(tasks => [...tasks, ...newTasks]);
    this.jobPostings.update(jobs =>
      jobs.map(j => j.title === cand.jobTitle ? { ...j, applicantsCount: j.applicantsCount + 1 } : j)
    );
  }

  toggleOnboardingTask(taskId: string) {
    this.onboardingTasks.update(tasks =>
      tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    );
  }
}

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, JobPosting, Candidate } from '../../services/hrms.service';

@Component({
  selector: 'app-recruitment-ats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recruitment-ats.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class RecruitmentAtsComponent {
  private hrmsService = inject(HrmsService);

  jobPostings = this.hrmsService.jobPostings;
  candidates = this.hrmsService.candidates;

  // Local State
  activeSubTab = signal<'ats' | 'jobs'>('ats');
  isAddJobModalOpen = signal<boolean>(false);
  isParseModalOpen = signal<boolean>(false);

  // Resume Upload Simulation State
  isDragging = signal<boolean>(false);
  isParsing = signal<boolean>(false);
  parseProgress = signal<number>(0);
  parsedCandidate = signal<Omit<Candidate, 'id' | 'appliedDate' | 'score'> | null>(null);

  // New Job Model
  newJob = {
    title: '',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time' as JobPosting['type'],
    description: ''
  };

  departments = ['Engineering', 'Design', 'Product', 'HR', 'Sales'];
  locations = ['San Francisco, CA', 'New York, NY', 'Remote', 'London, UK'];
  jobTypes: JobPosting['type'][] = ['Full-time', 'Part-time', 'Contract', 'Remote'];

  // ATS Pipeline Stages
  stages: Candidate['stage'][] = ['Applied', 'Screening', 'Interview', 'Offered', 'Hired'];

  // Candidates grouped by stage
  getCandidatesByStage(stage: Candidate['stage']): Candidate[] {
    return this.candidates().filter(c => c.stage === stage);
  }

  // Active Job Postings count
  activeJobsCount = computed(() => 
    this.jobPostings().filter(j => j.status === 'Active').length
  );

  totalApplicantsCount = computed(() => 
    this.candidates().length
  );

  setSubTab(tab: 'ats' | 'jobs') {
    this.activeSubTab.set(tab);
  }

  openAddJobModal() {
    this.isAddJobModalOpen.set(true);
  }

  closeAddJobModal() {
    this.isAddJobModalOpen.set(false);
    this.resetJobForm();
  }

  saveJob() {
    if (!this.newJob.title || !this.newJob.description) {
      alert('Please fill out all required fields.');
      return;
    }

    this.hrmsService.addJobPosting({
      title: this.newJob.title,
      department: this.newJob.department,
      location: this.newJob.location,
      type: this.newJob.type,
      status: 'Active',
      description: this.newJob.description
    });

    this.closeAddJobModal();
  }

  moveCandidate(candidateId: string, direction: 'forward' | 'backward') {
    const candidate = this.candidates().find(c => c.id === candidateId);
    if (!candidate) return;

    const currentStageIdx = this.stages.indexOf(candidate.stage);
    let nextStageIdx = currentStageIdx;

    if (direction === 'forward' && currentStageIdx < this.stages.length - 1) {
      nextStageIdx++;
    } else if (direction === 'backward' && currentStageIdx > 0) {
      nextStageIdx--;
    }

    if (nextStageIdx !== currentStageIdx) {
      this.hrmsService.updateCandidateStage(candidateId, this.stages[nextStageIdx]);
    }
  }

  openParseModal() {
    this.isParseModalOpen.set(true);
  }

  closeParseModal() {
    this.isParseModalOpen.set(false);
    this.resetParseSimulation();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.simulateResumeParsing(files[0].name);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.simulateResumeParsing(input.files[0].name);
    }
  }

  simulateResumeParsing(fileName: string) {
    this.isParsing.set(true);
    this.parseProgress.set(0);

    const interval = setInterval(() => {
      this.parseProgress.update(p => {
        if (p >= 100) {
          clearInterval(interval);
          this.generateParsedCandidate(fileName);
          return 100;
        }
        return p + 20;
      });
    }, 300);
  }

  generateParsedCandidate(fileName: string) {
    this.isParsing.set(false);
    
    // Simulate extracted info based on name or random profile
    const names = ['Michael Jordan', 'Elon Musk', 'Gal Gadot', 'Keanu Reeves', 'Emma Watson'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const cleanName = randomName.replace(' ', '.').toLowerCase();

    const mockSkills = [
      ['Angular', 'RxJS', 'TypeScript', 'Karma/Jasmine', 'HTML5', 'CSS3'],
      ['Sourcing', 'ATS systems', 'Talent Pipelines', 'Interviews', 'Compensation Negotiation'],
      ['Product Strategy', 'Roadmapping', 'User Research', 'Agile/Scrum', 'Data Analytics']
    ];

    const activeJobs = this.jobPostings().filter(j => j.status === 'Active');
    const selectedJob = activeJobs.length > 0 ? activeJobs[Math.floor(Math.random() * activeJobs.length)].title : 'Senior Frontend Engineer (Angular)';
    
    let selectedSkills = mockSkills[0];
    if (selectedJob.toLowerCase().includes('recruiter')) {
      selectedSkills = mockSkills[1];
    } else if (selectedJob.toLowerCase().includes('product')) {
      selectedSkills = mockSkills[2];
    }

    this.parsedCandidate.set({
      name: randomName,
      email: `${cleanName}@parsedmail.com`,
      jobTitle: selectedJob,
      stage: 'Applied',
      skills: selectedSkills
    });
  }

  confirmAddParsedCandidate() {
    const cand = this.parsedCandidate();
    if (!cand) return;

    this.hrmsService.addCandidate(cand);
    this.closeParseModal();
  }

  resetParseSimulation() {
    this.isParsing.set(false);
    this.parseProgress.set(0);
    this.parsedCandidate.set(null);
  }

  resetJobForm() {
    this.newJob = {
      title: '',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: ''
    };
  }

  getStageBadgeClass(stage: string) {
    switch(stage) {
      case 'Applied': return 'bg-slate-800 text-slate-300 border border-slate-700';
      case 'Screening': return 'bg-blue-500/10 text-blue-400 border border-blue-550/20';
      case 'Interview': return 'bg-amber-500/10 text-amber-400 border border-amber-550/20';
      case 'Offered': return 'bg-violet-500/10 text-violet-400 border border-violet-550/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border border-emerald-550/20';
    }
  }
}

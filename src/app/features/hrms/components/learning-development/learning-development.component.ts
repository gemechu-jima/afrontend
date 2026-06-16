import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, TrainingCourse, EmployeeCourseProgress } from '../../services/hrms.service';

@Component({
  selector: 'app-learning-development',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './learning-development.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class LearningDevelopmentComponent {
  private hrmsService = inject(HrmsService);

  courses = this.hrmsService.trainingCourses;
  progressList = this.hrmsService.employeeCourseProgress;

  // Selected Employee (simulated logged-in employee EMP-001)
  employeeId = 'EMP-001';

  // Learning simulator state
  activeCourse = signal<TrainingCourse | null>(null);
  activeProgress = signal<EmployeeCourseProgress | null>(null);
  isPlaying = signal<boolean>(false);
  videoTime = signal<number>(0);
  isCompleted = signal<boolean>(false);

  // Compute enrolled list progress
  myCourses = computed(() => {
    return this.courses().map(course => {
      const progress = this.progressList().find(
        p => p.courseId === course.id && p.employeeId === this.employeeId
      );
      return {
        ...course,
        progress: progress || null
      };
    });
  });

  enroll(courseId: string) {
    this.hrmsService.enrollInCourseApi(courseId, this.employeeId).subscribe();
  }

  startCourse(course: any) {
    this.activeCourse.set(course);
    
    let progress = this.progressList().find(
      p => p.courseId === course.id && p.employeeId === this.employeeId
    );

    if (!progress) {
      // Auto enroll first
      this.hrmsService.enrollInCourseApi(course.id, this.employeeId).subscribe(p => {
        this.activeProgress.set(p);
        this.resetVideoSimulator(p.percentComplete);
      });
    } else {
      this.activeProgress.set(progress);
      this.resetVideoSimulator(progress.percentComplete);
    }
  }

  resetVideoSimulator(percent: number) {
    this.videoTime.set(percent);
    this.isCompleted.set(percent >= 100);
    this.isPlaying.set(false);
  }

  togglePlay() {
    if (this.isCompleted()) return;
    this.isPlaying.set(!this.isPlaying());
    if (this.isPlaying()) {
      this.tickVideo();
    }
  }

  tickVideo() {
    if (!this.isPlaying() || this.isCompleted()) return;
    
    setTimeout(() => {
      this.videoTime.update(t => {
        if (t >= 100) {
          this.isCompleted.set(true);
          this.isPlaying.set(false);
          this.markCourseCompleted();
          return 100;
        }
        this.tickVideo();
        return t + 5;
      });
    }, 150);
  }

  markCourseCompleted() {
    const course = this.activeCourse();
    if (!course) return;

    this.progressList.update(list => 
      list.map(p => 
        (p.courseId === course.id && p.employeeId === this.employeeId) 
          ? { ...p, status: 'Completed', percentComplete: 100, certificateIssued: true, completionDate: new Date().toISOString().split('T')[0] } 
          : p
      )
    );
  }

  closePlayer() {
    this.activeCourse.set(null);
    this.activeProgress.set(null);
    this.isPlaying.set(false);
  }

  getDifficultyClass(level: string) {
    switch(level) {
      case 'Advanced': return 'bg-rose-500/10 text-rose-400 border border-rose-550/20';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-400 border border-amber-550/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border border-emerald-550/20';
    }
  }
}

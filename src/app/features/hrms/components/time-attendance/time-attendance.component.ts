import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService } from '../../services/hrms.service';

@Component({
  selector: 'app-time-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-attendance.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class TimeAttendanceComponent {
  private hrmsService = inject(HrmsService);

  employees = this.hrmsService.employees;
  attendanceLogs = this.hrmsService.attendanceLogs;

  // Selected employee for clock simulation (defaulting to the first employee)
  selectedEmployeeId = signal<string>('EMP-001');

  // Computed clock status for selected employee today
  todayLog = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.attendanceLogs().find(
      log => log.employeeId === this.selectedEmployeeId() && log.date === todayStr
    );
  });

  isClockedIn = computed(() => {
    const log = this.todayLog();
    return !!log && !log.clockOut;
  });

  isClockedOut = computed(() => {
    const log = this.todayLog();
    return !!log && !!log.clockOut;
  });

  // Overview stats
  totalHoursWorkedToday = computed(() => {
    return this.attendanceLogs()
      .filter(l => l.date === new Date().toISOString().split('T')[0])
      .reduce((sum, log) => sum + log.totalHours, 0);
  });

  clockIn() {
    const emp = this.employees().find(e => e.id === this.selectedEmployeeId());
    if (!emp) return;
    this.hrmsService.clockInEmployee(emp.id, emp.name);
  }

  clockOut() {
    this.hrmsService.clockOutEmployee(this.selectedEmployeeId());
  }

  getAttendanceStatusClass(status: string) {
    switch(status) {
      case 'On Time': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-550/20';
      case 'Late': return 'bg-amber-500/10 text-amber-400 border border-amber-550/20';
      case 'Overtime': return 'bg-violet-500/10 text-violet-400 border border-violet-550/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-550/20';
    }
  }
}

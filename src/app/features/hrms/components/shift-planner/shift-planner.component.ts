import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, Shift } from '../../services/hrms.service';

@Component({
  selector: 'app-shift-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shift-planner.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class ShiftPlannerComponent {
  private hrmsService = inject(HrmsService);

  employees = this.hrmsService.employees;
  shifts = this.hrmsService.shifts;

  // Local State
  isAssignModalOpen = signal<boolean>(false);

  newAssignment = {
    employeeId: 'EMP-001',
    dayOfWeek: 'Monday' as Shift['dayOfWeek'],
    shiftType: 'Morning (08:00 - 16:00)' as Shift['shiftType']
  };

  daysOfWeek: Shift['dayOfWeek'][] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  shiftTypes: Shift['shiftType'][] = [
    'Morning (08:00 - 16:00)',
    'Evening (16:00 - 00:00)',
    'Night (00:00 - 08:00)'
  ];

  // Helper to get shifts for a specific day and shift type
  getShiftsForCell(day: Shift['dayOfWeek'], type: Shift['shiftType']): Shift[] {
    return this.shifts().filter(s => s.dayOfWeek === day && s.shiftType === type);
  }

  openAssignModal() {
    this.isAssignModalOpen.set(true);
  }

  closeAssignModal() {
    this.isAssignModalOpen.set(false);
  }

  saveAssignment() {
    const emp = this.employees().find(e => e.id === this.newAssignment.employeeId);
    if (!emp) return;

    this.hrmsService.assignShift(
      emp.id,
      emp.name,
      this.newAssignment.dayOfWeek,
      this.newAssignment.shiftType
    );

    this.closeAssignModal();
  }

  removeShift(shiftId: string) {
    if (confirm('Are you sure you want to remove this shift assignment?')) {
      this.hrmsService.deleteShift(shiftId);
    }
  }

  getShiftBadgeClass(type: string) {
    if (type.startsWith('Morning')) {
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    } else if (type.startsWith('Evening')) {
      return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
    } else {
      return 'bg-violet-500/10 text-violet-400 border border-violet-500/20';
    }
  }
}

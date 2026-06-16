import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, LeaveRequest } from '../../services/hrms.service';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-management.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class LeaveManagementComponent {
  private hrmsService = inject(HrmsService);

  employees = this.hrmsService.employees;
  leaveRequests = this.hrmsService.leaveRequests;

  // Modals state
  isRequestModalOpen = signal<boolean>(false);

  // Form Models
  newLeave = {
    employeeId: 'EMP-001',
    type: 'Annual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  };

  // Computed leave metrics
  pendingCount = computed(() => 
    this.leaveRequests().filter(r => r.status === 'Pending').length
  );

  approvedCount = computed(() => 
    this.leaveRequests().filter(r => r.status === 'Approved').length
  );

  openRequestModal() {
    this.isRequestModalOpen.set(true);
  }

  closeRequestModal() {
    this.isRequestModalOpen.set(false);
    this.newLeave.reason = '';
  }

  submitRequest() {
    const emp = this.employees().find(e => e.id === this.newLeave.employeeId);
    if (!emp) return;

    const start = new Date(this.newLeave.startDate);
    const end = new Date(this.newLeave.endDate);
    
    if (end < start) {
      alert('End date cannot be earlier than start date.');
      return;
    }

    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    this.hrmsService.submitLeaveRequest({
      employeeId: emp.id,
      employeeName: emp.name,
      type: this.newLeave.type,
      startDate: this.newLeave.startDate,
      endDate: this.newLeave.endDate,
      reason: this.newLeave.reason || 'No reason specified',
      days: days
    });

    this.closeRequestModal();
  }

  approve(id: string) {
    this.hrmsService.approveLeave(id);
  }

  reject(id: string) {
    this.hrmsService.rejectLeave(id);
  }
}

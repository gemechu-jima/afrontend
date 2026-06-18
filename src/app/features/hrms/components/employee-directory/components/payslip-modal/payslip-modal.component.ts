import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../../models/hrms.models';

@Component({
  selector: 'app-employee-payslip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payslip-modal.component.html'
})
export class PayslipModalComponent {

  @Input() employee: Employee | null = null;
  @Output() close = new EventEmitter<void>();

  closePayslip() {
    this.close.emit();
  }

  getCurrentDateTime() {
    return new Date().toLocaleString();
  }
}
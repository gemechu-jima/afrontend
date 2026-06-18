import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../../models/hrms.models';
@Component({
  selector: 'app-employee-table',
  imports: [CommonModule],
  templateUrl: './employee-table.component.html',

})
export class EmployeeTableComponent {
   @Input({ required: true }) employees: Employee[] = [];

  @Output() viewPayslip = new EventEmitter<Employee>();
  @Output() delete = new EventEmitter<string>();

  onViewPayslip(emp: Employee) {
    this.viewPayslip.emit(emp);
  }

  onDelete(id: string) {
    this.delete.emit(id);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../../../models/hrms.models';

@Component({
  selector: 'app-add-employee-modal',
  imports: [FormsModule],
  templateUrl: './add-employee-modal.component.html',
})
export class AddEmployeeModalComponent {
  @Input() isOpen = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Employee>();

  newEmployee: Employee = {
    id: '',
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    joinDate: '',
    status: 'Active',
    salary: 0,
    performanceRating:0
}
 departments = ['Engineering', 'Design', 'Product', 'HR', 'Sales'];

  closeModal() {
    this.close.emit();
  }

  saveEmployee() {
    this.save.emit({
      ...this.newEmployee,
      id: crypto.randomUUID()
    });

    this.resetForm();
    this.close.emit();
  }

  resetForm() {
    this.newEmployee = {
      id: '',
      name: '',
      email: '',
      role: '',
      department: 'Engineering',
      joinDate: '',
      status: 'Active',
      salary: 0
    };
  }
}

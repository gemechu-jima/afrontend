import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, Employee } from '../../services/hrms.service';

@Component({
  selector: 'app-employee-directory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-directory.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class EmployeeDirectoryComponent {
  private hrmsService = inject(HrmsService);

  // Expose signals from service
  employees = this.hrmsService.employees;
  departments = ['All', 'Engineering', 'Design', 'Product', 'HR', 'Sales'];

  // Local State
  searchQuery = signal<string>('');
  selectedDepartment = signal<string>('All');
  isAddModalOpen = signal<boolean>(false);
  selectedPayslipEmployee = signal<Employee | null>(null);

  // New Employee Form Model
  newEmployee = {
    name: '',
    role: '',
    department: 'Engineering',
    email: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active' as const,
    salary: 80000
  };

  // Filtered employees computed
  filteredEmployees = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const dept = this.selectedDepartment();
    return this.employees().filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(query) || 
                            emp.role.toLowerCase().includes(query) || 
                            emp.id.toLowerCase().includes(query) || 
                            emp.email.toLowerCase().includes(query);
      const matchesDept = dept === 'All' || emp.department === dept;
      return matchesSearch && matchesDept;
    });
  });

  openAddModal() {
    this.isAddModalOpen.set(true);
  }

  closeAddModal() {
    this.isAddModalOpen.set(false);
    this.resetForm();
  }

  saveEmployee() {
    if (!this.newEmployee.name || !this.newEmployee.role || !this.newEmployee.email) {
      alert('Please fill out all required fields.');
      return;
    }
    
    this.hrmsService.addEmployee({
      name: this.newEmployee.name,
      role: this.newEmployee.role,
      department: this.newEmployee.department,
      email: this.newEmployee.email,
      joinDate: this.newEmployee.joinDate,
      status: this.newEmployee.status,
      salary: Number(this.newEmployee.salary)
    });
    
    this.closeAddModal();
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to terminate/remove this employee record?')) {
      this.hrmsService.deleteEmployee(id);
    }
  }

  viewPayslip(employee: Employee) {
    this.selectedPayslipEmployee.set(employee);
  }

  closePayslip() {
    this.selectedPayslipEmployee.set(null);
  }

  resetForm() {
    this.newEmployee = {
      name: '',
      role: '',
      department: 'Engineering',
      email: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      salary: 80000
    };
  }

  getCurrentDateTime(): string {
    return new Date().toLocaleString();
  }

  // Define your status map in the component
readonly statusOptions = [
  { value: 'Active', label: 'Active (Onsite)' },
  { value: 'Remote', label: 'Remote' },
  { value: 'On Leave', label: 'On Leave' }
] as const;
}

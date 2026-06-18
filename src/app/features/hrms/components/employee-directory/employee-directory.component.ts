import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, Employee } from '../../services/hrms.service';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { EmployeeFilterComponent } from './components/employee-filters/employee-filters.component';
import { AddEmployeeModalComponent } from './components/add-employee-modal/add-employee-modal.component';
import { PayslipModalComponent } from './components/payslip-modal/payslip-modal.component';
@Component({
  selector: 'app-employee-directory',
  standalone: true,
  imports: [CommonModule, FormsModule,
     EmployeeTableComponent, 
     EmployeeFilterComponent,
     AddEmployeeModalComponent,
     PayslipModalComponent
    ],
  templateUrl: './employee-directory.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class EmployeeDirectoryComponent {
  private hrmsService = inject(HrmsService);

  employees = this.hrmsService.employees;

  searchQuery = signal('');
  selectedDepartment = signal('All');

  isAddModalOpen = signal(false);
  selectedPayslipEmployee = signal<Employee | null>(null);

  departments =signal<string[]>([
    'All',
    'Engineering',
    'Design',
    'Product',
    'HR',
    'Sales'
  ]);
  newEmployee = signal<Employee>({
  id: '',
  name: '',
  email: '',
  role: '',
  department: 'Engineering',
  joinDate: '',
  status: 'Active',
  salary: 0,
  performanceRating:0
});

  filteredEmployees = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const dept = this.selectedDepartment();

    return this.employees().filter(emp => {
      const matchesSearch =
        emp.name.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.id.toLowerCase().includes(query);

      const matchesDept =
        dept === 'All' || emp.department === dept;

      return matchesSearch && matchesDept;
    });
  });

  deleteEmployee(id: string) {
    this.hrmsService.deleteEmployee(id);
  }

  viewPayslip(emp: Employee) {
    this.selectedPayslipEmployee.set(emp);
  }

  closePayslip() {
    this.selectedPayslipEmployee.set(null);
  }
 openAddModal() {
  this.isAddModalOpen.set(true);
}

closeAddModal() {
  this.isAddModalOpen.set(false);
}
addEmployee(emp: Employee) {
  this.hrmsService.addEmployee(emp);
}
saveEmployee() {
  const emp = this.newEmployee();

  const newEmp: Employee = {
    ...emp,
    id: crypto.randomUUID()
  };

  this.hrmsService.addEmployee(newEmp);

  // reset form
  this.newEmployee.set({
    id: '',
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    joinDate: '',
    status: 'Active',
    salary: 0,
     performanceRating:0
  });

  this.closeAddModal();
}
  getCurrentDateTime(){
    
  }
}

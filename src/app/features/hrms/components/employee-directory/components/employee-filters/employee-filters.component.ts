import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './employee-filters.component.html'
})
export class EmployeeFilterComponent {

  searchQuery = input<string>('');
  selectedDepartment = input<string>('');
  departments = input<string[]>([]);

  searchChange = output<string>();
  departmentChange = output<string>();
}
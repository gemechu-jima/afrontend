import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrmsService, Workflow } from '../../services/hrms.service';

@Component({
  selector: 'app-workflow-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workflow-builder.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class WorkflowBuilderComponent {
  private hrmsService = inject(HrmsService);

  workflows = this.hrmsService.workflows;

  // Local state
  selectedWorkflowId = signal<string>('WF-001');
  isAddStepModalOpen = signal<boolean>(false);

  newStep = {
    role: 'Department Head',
    approverName: ''
  };

  roles = [
    'Direct Supervisor',
    'Department Head',
    'HR Operations',
    'Finance Specialist',
    'VP of Operations',
    'CEO / Executive Office'
  ];

  selectedWorkflow = () => {
    return this.workflows().find(w => w.id === this.selectedWorkflowId()) || this.workflows()[0];
  };

  selectWorkflow(id: string) {
    this.selectedWorkflowId.set(id);
  }

  openAddStepModal() {
    this.isAddStepModalOpen.set(true);
  }

  closeAddStepModal() {
    this.isAddStepModalOpen.set(false);
    this.newStep.approverName = '';
  }

  saveStep() {
    if (!this.newStep.approverName) {
      alert('Please enter the name of the designated approver.');
      return;
    }

    this.hrmsService.addWorkflowStep(
      this.selectedWorkflowId(),
      this.newStep.role,
      this.newStep.approverName
    );

    this.closeAddStepModal();
  }

  toggleWorkflowStatus(workflow: Workflow) {
    this.workflows.update(list => 
      list.map(w => w.id === workflow.id ? { ...w, status: w.status === 'Active' ? 'Inactive' : 'Active' } : w)
    );
  }
}

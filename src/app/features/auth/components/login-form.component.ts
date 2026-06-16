import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="space-y-4">
      <input [(ngModel)]="email" name="email" class="w-full border p-2 rounded" placeholder="Email">
      <input [(ngModel)]="password" name="password" type="password" class="w-full border p-2 rounded" placeholder="Password">
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">Sign In</button>
    </form>
  `
})
export class LoginFormComponent {
  @Output() login = new EventEmitter<any>();
  email = '';
  password = '';

  submit() {
    this.login.emit({ email: this.email, password: this.password });
  }
}
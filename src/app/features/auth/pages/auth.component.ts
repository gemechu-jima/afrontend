import { Component } from '@angular/core';
import { LoginFormComponent } from '../components/login-form.component';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-auth',
  imports: [LoginFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {

  constructor(private authService: AuthService){}

  onLogin(credentials: any) {
    // 4. Pass data to the service
    this.authService.login(credentials).subscribe({
      next: (response) => console.log('Success', response),
      error: (err) => console.error('Login Failed', err)
    });
  }
}

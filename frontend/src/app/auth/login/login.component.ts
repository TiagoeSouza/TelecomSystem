// auth/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html'
})

export class LoginComponent {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      // usuario e senha mockados
      username: ['tiago_e_souza@hotmail.com', [Validators.required, Validators.email]],
      password: ['123456', Validators.required]
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('userName', this.loginForm.value.username);
      this.router.navigate(['/dashboard']);
    }
  }
}

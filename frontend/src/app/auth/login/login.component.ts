// auth/login/login.component.ts
import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/ApiService';
import { NotificationService } from '../../shared/notification/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})

export class LoginComponent {
  loginForm: FormGroup;
  isRegisterMode = false;

  switchToRegister() {
    this.isRegisterMode = true;
    console.log("isRegisterMode", this.isRegisterMode);
  }

  constructor(private fb: FormBuilder, private router: Router, private APIService: ApiService, private notify: NotificationService) {
    this.loginForm = this.fb.group({
      username: [, [Validators.required, Validators.email]],
      password: [, [Validators.required, Validators.minLength(6)]]
    });
  }

  private salvarSessaoERedirecionar(username: string, token: string): void {
    localStorage.setItem('userName', username);
    localStorage.setItem('token', token);
    this.router.navigate(['/dashboard']);
  }

  onSubmit(event: Event) {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // exibe erros
      return;
    }
    console.log("onSubmit", this.loginForm.value);
    event.preventDefault();
    if (this.loginForm.invalid) {
      console.log("Formulário inválido", this.loginForm);
      this.notify.warning(`Para logar ou se registrar.
        Preencha todos os campos obrigatórios`, '', false);
      return;
    }


    if (this.loginForm.valid) {
      if (this.isRegisterMode) {
        this.APIService.post<{ token: string }>('UserAuth/register', {
          UserEmail: this.loginForm.value.username,
          Password: this.loginForm.value.password
        }).subscribe({
          next: (response) => {
            console.log("response Register", response);
            this.notify.success('Usuário registrado com sucesso, você será redirecionado', '', true);
            // adicione um timeout para redirecionar após o registro
            setTimeout(() => {
              this.isRegisterMode = false;
              this.salvarSessaoERedirecionar(this.loginForm.value.username, response.token);
            }, 3000);
          },
          error: (error) => {
            console.error("Error Register", error);
            if (error.status === 400 && error.error?.errors) {
              // Percorrer os erros da API e mostra cada mensagem
              const validationErrors = error.error.errors;
              for (const field in validationErrors) {
                if (validationErrors.hasOwnProperty(field)) {
                  validationErrors[field].forEach((msg: string) => {
                    this.notify.warning(msg, 'Erro de Validação', true);
                  });
                }
              }
            } else {
              this.notify.error('Erro ao registrar', '', true);
            }
          }
        });
        // this.loginForm.reset();
      } else {
        this.APIService.post<{ token: string }>('UserAuth/login', {
          UserEmail: this.loginForm.value.username,
          Password: this.loginForm.value.password
        }).subscribe({
          next: (response) => {
            this.notify.success('Login realizado com sucesso, você será redirecionado', '', true);
            setTimeout(() => {
              this.salvarSessaoERedirecionar(this.loginForm.value.username, response.token);
            }, 3000);
          },
          error: (error) => {
            console.error("Error Login", error);
            if (error.status === 401) {
              this.notify.warning('Email ou senha inválidos', '', true);
            } else {
              this.notify.error('Erro ao logar', '', true);
            }
          }
        });
      }
    }
  }
}

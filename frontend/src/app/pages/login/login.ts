import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthLayoutComponent } from '../../auth/auth-layout/auth-layout';
import 'notyf/notyf.min.css';

declare const Notyf: any;
declare const gsap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthLayoutComponent, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  usuario = '';
  senha = '';
  private notificacao!: any;

  @ViewChild('formEl', { read: ElementRef }) formulario!: ElementRef;

  constructor(
    private http: HttpClient,
    private roteador: Router
  ) {}

  ngOnInit(): void {
    this.iniciarNotificacao();
  }

  login(): void {
    if (!this.usuario || !this.senha) return;

    this.http.post<any>(
      'http://127.0.0.1:5000/api/login',
      { usuario: this.usuario, senha: this.senha },
      { withCredentials: true }
    ).subscribe({
      next: resposta => this.loginSucesso(resposta),
      error: erro => this.loginErro(erro)
    });
  }

  private loginSucesso(resposta: any): void {
    this.animarSucesso();
    this.notificacao.success(`Bem-vindo(a) ${resposta.usuario}!`);

    setTimeout(() => {
      this.roteador.navigateByUrl('/lab');
    }, 1200);
  }

  private loginErro(erro: any): void {
    this.animarErro();
    this.notificacao.error(
      erro?.error?.erro || 'Usuário ou senha inválidos'
    );
  }

  private iniciarNotificacao(): void {
    this.notificacao = new Notyf({
      duration: 2300,
      ripple: true,
      position: { x: 'right', y: 'top' }
    });
  }

  private animarErro(): void {
    if (gsap && this.formulario) {
      gsap.fromTo(
        this.formulario.nativeElement,
        { x: -8 },
        { x: 8, duration: 0.06, repeat: 6, yoyo: true }
      );
    }
  }

  private animarSucesso(): void {
    if (gsap && this.formulario) {
      gsap.fromTo(
        this.formulario.nativeElement,
        { scale: 1 },
        { scale: 1.04, duration: 0.12, repeat: 1, yoyo: true }
      );
    }
  }
}

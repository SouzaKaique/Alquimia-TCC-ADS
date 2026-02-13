import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthLayoutComponent } from '../../auth/auth-layout/auth-layout';

declare const Notyf: any;
declare const gsap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthLayoutComponent, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  usuario = '';
  senha = '';
  private notyf!: any;

  @ViewChild('formEl', { read: ElementRef }) formEl!: ElementRef;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initNotyf();
  }

  login(): void {
    if (!this.usuario || !this.senha) return;

    this.http.post<any>(
      'http://127.0.0.1:5000/api/login',
      { usuario: this.usuario, senha: this.senha },
      { withCredentials: true }
    ).subscribe({
      next: res => this.onSuccess(res),
      error: err => this.onError(err)
    });
  }

  /* ======================
     HANDLERS
  ====================== */

  private onSuccess(res: any): void {
    this.pulse();
    this.notyf.success(`Bem-vindo(a) ${this.escape(res.usuario)}!`);

    setTimeout(() => {
      this.router.navigateByUrl('/lab');
    }, 1300);
  }

  private onError(err: any): void {
    this.shake();
    this.notyf.error(err?.error?.erro || 'Usuário ou senha inválidos');
  }

  /* ======================
     UI HELPERS
  ====================== */

  private initNotyf(): void {
    this.notyf = new Notyf({
      duration: 2300,
      ripple: true,
      position: { x: 'right', y: 'top' },
      types: [
        { type: 'success', background: '#374956' },
        { type: 'error', background: '#8a2f2f' }
      ]
    });
  }

  private shake(): void {
    if (gsap && this.formEl) {
      gsap.fromTo(
        this.formEl.nativeElement,
        { x: -8 },
        { x: 8, duration: 0.06, repeat: 6, yoyo: true, clearProps: 'x' }
      );
    }
  }

  private pulse(): void {
    if (gsap && this.formEl) {
      gsap.fromTo(
        this.formEl.nativeElement,
        { scale: 1 },
        { scale: 1.04, duration: 0.12, repeat: 1, yoyo: true, clearProps: 'scale' }
      );
    }
  }

  private escape(str: string): string {
    return String(str || '').replace(/[&<>"'`=\/]/g, s =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      } as any)[s]
    );
  }
}

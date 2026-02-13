import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthLayoutComponent } from '../../auth/auth-layout/auth-layout';

declare const Notyf: any;
declare const gsap: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [AuthLayoutComponent, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {

  usuario = '';
  senha = '';
  confirmar = '';
  notyf: any;

  @ViewChild('form', { read: ElementRef }) formEl!: ElementRef;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  registrar() {
    if (!this.usuario || !this.senha || !this.confirmar) return;

    if (this.senha !== this.confirmar) {
      this.shake();
      this.notyf.error('As senhas não coincidem');
      return;
    }

    this.http.post<any>(
      'http://127.0.0.1:5000/api/registro',
      { usuario: this.usuario, senha: this.senha },
      { withCredentials: true }
    ).subscribe({
      next: res => {
        this.pulse();
        this.notyf.success(
          `Usuário ${this.escape(res.usuario)} registrado com sucesso!`
        );

        setTimeout(() => {
          this.router.navigateByUrl('/lab');
        }, 1300);
      },
      error: err => {
        this.shake();
        this.notyf.error(err?.error?.erro || 'Erro ao registrar usuário');
      }
    });
  }

  /* ===== ANIMAÇÕES ===== */

  shake() {
    if (gsap && this.formEl) {
      gsap.fromTo(
        this.formEl.nativeElement,
        { x: -8 },
        { x: 8, duration: 0.06, repeat: 6, yoyo: true, clearProps: 'x' }
      );
    }
  }

  pulse() {
    if (gsap && this.formEl) {
      gsap.fromTo(
        this.formEl.nativeElement,
        { scale: 1 },
        { scale: 1.04, duration: 0.12, repeat: 1, yoyo: true, clearProps: 'scale' }
      );
    }
  }

  escape(str: string) {
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

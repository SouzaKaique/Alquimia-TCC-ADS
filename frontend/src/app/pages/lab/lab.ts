import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


import * as PIXI from 'pixi.js';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lab.html',
  styleUrls: ['./lab.css'],
})

export class LabComponent implements AfterViewInit, OnDestroy {
  private app!: PIXI.Application;
  private liquido!: PIXI.Graphics;

  private API_BASE_URL = 'http://127.0.0.1:5000';

  private notyf = new Notyf({
    duration: 2300,
    ripple: true,
    position: { x: 'right', y: 'top' },
    types: [
      { type: 'success', background: '#374956' },
      { type: 'error', background: '#8a2f2f' },
    ],
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  /* ======================================================
     CICLO DE VIDA
  ====================================================== */

  ngAfterViewInit(): void {
    this.verificarSessao();
  }

  ngOnDestroy(): void {
    this.app?.destroy(true, { children: true });
  }

  /* ======================================================
     SESSÃO
  ====================================================== */

  verificarSessao(): void {
    this.http.get(`${this.API_BASE_URL}/api/perfil`, { withCredentials: true }).subscribe({
      next: () => this.iniciarPixi(),
      error: () => this.router.navigate(['/login']),
    });
  }

  logout(): void {
    this.http.post(`${this.API_BASE_URL}/api/logout`, {}, { withCredentials: true }).subscribe({
      complete: () => {
        this.notyf.success('Saindo do sistema...');
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
    });
  }

  /* ======================================================
     PIXI
  ====================================================== */

  iniciarPixi(): void {
    const container = document.getElementById('labCanvas');
    if (!container) return;

    this.app = new PIXI.Application({
      width: 900,
      height: 600,
      backgroundAlpha: 0,
      antialias: true,
    });

    container.appendChild(this.app.view as HTMLCanvasElement);

    PIXI.Assets.load({
      tubo: 'assets/img/Tubo.png',
      bicoOn: 'assets/img/BicoBunsen.png',
      bicoOff: 'assets/img/bico-off.png',
    }).then((assets: any) => {
      this.criarTubo(assets.tubo);
      this.criarBico(assets.bicoOn, assets.bicoOff);
    });
  }

  /* ======================================================
     TUBO
  ====================================================== */

  criarTubo(tuboImg: PIXI.Texture): void {
    const tubo = new PIXI.Sprite(tuboImg);
    tubo.anchor.set(0.5);
    tubo.scale.set(0.55);
    tubo.position.set(300, 330);
    tubo.interactive = true;
    tubo.cursor = 'pointer';

    this.liquido = new PIXI.Graphics();
    (this.liquido as any).heightAtual = 0;
    (this.liquido as any).corAtual = 0x5dade2;

    const container = new PIXI.Container();
    container.addChild(this.liquido, tubo);
    this.app.stage.addChild(container);

    let cheio = false;

    tubo.on('pointerdown', () => {
      cheio = !cheio;
      this.animarLiquido(cheio);
    });
  }

  animarLiquido(encher: boolean): void {
    this.notyf.success(encher ? 'Reagente adicionado!' : 'Tubo limpo!');

    const anim = () => {
      const l: any = this.liquido;

      l.heightAtual = encher ? Math.min(l.heightAtual + 2, 110) : Math.max(l.heightAtual - 3, 0);

      this.redesenharLiquido();

      if (encher ? l.heightAtual >= 110 : l.heightAtual <= 0) {
        this.app.ticker.remove(anim);
      }
    };

    this.app.ticker.add(anim);
  }

  /* ======================================================
     BICO DE BUNSEN
  ====================================================== */

  criarBico(onImg: PIXI.Texture, offImg: PIXI.Texture): void {
    const bico = new PIXI.Sprite(offImg);
    bico.anchor.set(0.5);
    bico.scale.set(0.55);
    bico.position.set(580, 430);
    bico.interactive = true;
    bico.cursor = 'pointer';

    let ativo = false;

    this.app.ticker.add(() => {
      if (ativo) {
        bico.scale.set(0.55 + Math.random() * 0.05);
        bico.y = 430 + (Math.random() * 2 - 1);
      }
    });

    bico.on('pointerdown', () => {
      ativo = !ativo;
      bico.texture = ativo ? onImg : offImg;
      if (!ativo) bico.scale.set(0.55);
      this.notyf.success(ativo ? 'Bico ligado!' : 'Bico desligado!');
    });

    this.app.stage.addChild(bico);
  }

  /* ======================================================
     REAGENTES
  ====================================================== */

  aplicarReagente(cor: string): void {
    const l: any = this.liquido;

    const corHex = Number(cor.replace('#', '0x'));
    l.corAtual = corHex;

    this.notyf.success('Reagente aplicado!');
    this.liquido.alpha = 0.3;

    const anim = () => {
      this.liquido.alpha = Math.min(this.liquido.alpha + 0.03, 0.85);
      this.redesenharLiquido();

      if (this.liquido.alpha >= 0.85) {
        this.app.ticker.remove(anim);
      }
    };

    this.app.ticker.add(anim);
  }

  /* ======================================================
     HELPERS
  ====================================================== */

  private redesenharLiquido(): void {
    const l: any = this.liquido;

    this.liquido.clear();
    this.liquido.beginFill(l.corAtual, this.liquido.alpha ?? 0.85);
    this.liquido.drawRoundedRect(-38, 120 - l.heightAtual, 75, l.heightAtual, 20);
    this.liquido.endFill();
  }
}

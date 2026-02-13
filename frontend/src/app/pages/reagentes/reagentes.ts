import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthLayoutComponent } from '../../auth/auth-layout/auth-layout';

@Component({
  selector: 'app-reagentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthLayoutComponent
  ],
  templateUrl: './reagentes.html',
  styleUrls: ['./reagentes.css']
})
export class ReagentesComponent implements OnInit {

  // ===== FORMULÁRIO =====
  nome = '';
  formula = '';
  quantidade: number | null = null;
  unidade = '';
  observacoes = '';

  // ===== LISTAGEM =====
  reagentes: any[] = [];
  reagentesFiltrados: any[] = [];
  reagenteSelecionado: any = null;

  textoBusca = '';
  categoriaSelecionada = 'todos';

  categorias = [
    { nome: 'Todos', valor: 'todos' },
    { nome: 'Cátions', valor: 'cations' },
    { nome: 'Ânions', valor: 'anions' },
    { nome: 'Indicadores', valor: 'indicators' },
    { nome: 'Solventes', valor: 'solvents' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarReagentes();
  }

  carregarReagentes() {
    this.http.get<any[]>('/api/reagentes').subscribe(data => {
      this.reagentes = data;
      this.filtrar();
    });
  }

  salvar() {
    if (!this.nome || !this.formula || !this.quantidade || !this.unidade) {
      return;
    }

    const payload = {
      nome: this.nome,
      formula: this.formula,
      quantidade: this.quantidade,
      unidade: this.unidade,
      observacoes: this.observacoes
    };

    console.log('Salvando reagente:', payload);

    // FUTURO:
    // this.http.post('/api/reagentes', payload).subscribe(() => {
    //   this.carregarReagentes();
    //   this.limparFormulario();
    // });

    this.limparFormulario();
  }

  limparFormulario() {
    this.nome = '';
    this.formula = '';
    this.quantidade = null;
    this.unidade = '';
    this.observacoes = '';
  }

  selecionarCategoria(cat: string) {
    this.categoriaSelecionada = cat;
    this.filtrar();
  }

  selecionarReagente(r: any) {
    this.reagenteSelecionado = r;
  }

  filtrar() {
    const texto = this.textoBusca.toLowerCase();

    this.reagentesFiltrados = this.reagentes.filter(r => {
      const matchTexto =
        !texto ||
        r.nome?.toLowerCase().includes(texto) ||
        r.formula?.toLowerCase().includes(texto);

      const matchCategoria =
        this.categoriaSelecionada === 'todos' ||
        r.categoria?.toLowerCase().includes(this.categoriaSelecionada);

      return matchTexto && matchCategoria;
    });
  }
}

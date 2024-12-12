// src/models/Emprestimo.ts
import { Livro } from './Livro';
import { Membro } from './Membro';

export class Emprestimo {
  constructor(
    public id: number,
    public livro: Livro,
    public membro: Membro,
    public dataEmprestimo: Date,
    public dataDevolucao: Date,
    public devolvido: boolean = false
  ) {}
}

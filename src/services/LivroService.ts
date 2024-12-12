// src/services/LivroService.ts
import { Livro, DadosAtualizaveisLivro } from "../models/Livro";
import * as fs from 'fs';
import * as path from 'path';

export class LivroService {
    private livros: Livro[] = [];
    private filePath = path.join(__dirname, '../data/Livros.csv');

    // Adicionar livro
    public adicionarLivro(livro: Livro): void {
        this.livros.push(livro);
        this.salvarLivros();
    }

    // Atualizar livro
    public atualizarLivro(id: number, dadosAtualizados: DadosAtualizaveisLivro): boolean {
        const livro = this.livros.find(l => l.getId() === id);
        if (livro) {
            livro.atualizarDados(dadosAtualizados);
            this.salvarLivros();
            return true;
        }
        return false;
    }

    // Remover livro
    public removerLivro(id: number): boolean {
        const index = this.livros.findIndex(l => l.getId() === id);
        if (index !== -1) {
            this.livros.splice(index, 1);
            this.salvarLivros();
            return true;
        }
        return false;
    }

    // Listar todos os livros
    public listarLivros(): Livro[] {
        return this.livros;
    }

    // Salvar livros em um arquivo CSV
    public salvarLivros(): void {
        const csvContent = this.livros.map(l => `${l.getId()},${l.getTitulo()},${l.getAutor()},${l.getIsbn()},${l.getAnoPublicacao()}`).join('\n');
        fs.writeFileSync(this.filePath, csvContent);
    }

    // Carregar livros de um arquivo CSV
    public carregarLivros(): void {
        if (fs.existsSync(this.filePath)) {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            const linhas = data.split('\n');
            this.livros = linhas.map(linha => {
                const [id, titulo, autor, isbn, anoPublicacao] = linha.split(',');
                return new Livro(Number(id), titulo, autor, isbn, Number(anoPublicacao));
            });
        }
    }
}
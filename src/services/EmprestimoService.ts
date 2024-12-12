// src/services/EmprestimoService.ts
import { Emprestimo } from '../models/Emprestimo';
import { Livro } from '../models/Livro';
import { Membro } from '../models/Membro';
import * as fs from 'fs';
import * as path from 'path';

export class EmprestimoService {
    private emprestimos: Emprestimo[] = [];
    private historico: Emprestimo[] = [];
    private filePath = path.join(__dirname, '../data/emprestimos.csv');

    realizarEmprestimo(livro: Livro, membro: Membro, dataDevolucao: Date): boolean {
        // Verifica se o livro já está emprestado
        if (this.isLivroEmprestado(livro)) {
            return false; // Não pode realizar o empréstimo
        }

        const novoEmprestimo = new Emprestimo(
            this.emprestimos.length + 1,
            livro,
            membro,
            new Date(),
            dataDevolucao
        );
        this.emprestimos.push(novoEmprestimo);
        this.salvarEmprestimos();
        return true; // Empréstimo realizado com sucesso
    }

    listarEmprestimosAtivos(): Emprestimo[] {
        return this.emprestimos.filter(emprestimo => !emprestimo.devolvido);
    }

    registrarDevolucao(id: number): boolean {
        const emprestimo = this.emprestimos.find(emp => emp.id === id);
        if (emprestimo && !emprestimo.devolvido) {
            emprestimo.devolvido = true;
            this.historico.push(emprestimo);
            this.emprestimos = this.emprestimos.filter(emp => emp.id !== id);
            this.salvarEmprestimos();
            return true; // Devolução registrada com sucesso
        }
        return false; // Empréstimo não encontrado ou já devolvido
    }

    listarHistorico(): Emprestimo[] {
        return this.historico;
    }

    isLivroEmprestado(livro: Livro): boolean {
        return this.emprestimos.some(emp => emp.livro.getId() === livro.getId() && !emp.devolvido);
    }

    // Salvar empréstimos em um arquivo CSV
    public salvarEmprestimos(): void {
        const csvContent = this.emprestimos.map(e => `${e.id},${e.livro.getId()},${e.membro.id},${e.dataEmprestimo.toISOString()},${e.dataDevolucao.toISOString()},${e.devolvido}`).join('\n');
        fs.writeFileSync(this.filePath, csvContent);
    }

    // Carregar empréstimos de um arquivo CSV
    public carregarEmprestimos(): void {
        if (fs.existsSync(this.filePath)) {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            const linhas = data.split('\n');
            this.emprestimos = linhas.map(linha => {
                const [id, livroId, membroId, dataEmprestimo, dataDevolucao, devolvido] = linha.split(',');
                return new Emprestimo(
                    Number(id),
                    new Livro(Number(livroId), '', '', '', 0), // Você pode precisar ajustar isso para carregar os dados completos do livro
                    new Membro(Number(membroId), '', '', '', ''), // Você pode precisar ajustar isso para carregar os dados completos do membro
                    new Date(dataEmprestimo),
                    new Date(dataDevolucao),
                    devolvido === 'true'
                );
            });
        }
    }
}
// src/services/MembroService.ts
import { Membro } from '../models/Membro';
import * as fs from 'fs';
import * as path from 'path';

export class MembroService {
    private membros: Membro[] = [];
    private filePath = path.join(__dirname, '../data/membros.csv');

    // Método para adicionar um novo membro
    adicionarMembro(membro: Membro): void {
        this.membros.push(membro);
        this.salvarMembros();
    }

    // Método para listar todos os membros
    listarMembros(): Membro[] {
        return this.membros;
    }

    // Método para atualizar um membro existente
    atualizarMembro(id: number, dadosAtualizados: Partial<Membro>): boolean {
        const index = this.membros.findIndex(membro => membro.id === id);
        if (index !== -1) {
            const membroAtualizado: Membro = {
                ...this.membros[index],
                ...dadosAtualizados
            } as Membro;
            this.membros[index] = membroAtualizado;
            this.salvarMembros();
            return true;
        }
        return false;
    }

    // Método para remover um membro
    removerMembro(id: number): boolean {
        const index = this.membros.findIndex(membro => membro.id === id);
        if (index !== -1) {
            this.membros.splice(index, 1);
            this.salvarMembros();
            return true;
        }
        return false;
    }

    // Salvar membros em um arquivo CSV
    public salvarMembros(): void {
        const csvContent = this.membros.map(m => `${m.id},${m.nome},${m.matricula},${m.endereco},${m.telefone}`).join('\n');
        fs.writeFileSync(this.filePath, csvContent);
    }

    // Carregar membros de um arquivo CSV
    public carregarMembros(): void {
        if (fs.existsSync(this.filePath)) {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            const linhas = data.split('\n');
            this.membros = linhas.map(linha => {
                const [id, nome, matricula, endereco, telefone] = linha.split(',');
                return new Membro(Number(id), nome, matricula, endereco, telefone);
            });
        }
    }
}
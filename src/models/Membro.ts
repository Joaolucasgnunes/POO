// src/models/Membro.ts
import { Pessoa } from './Pessoa';

export class Membro extends Pessoa {
    constructor(
        public id: number,
        nome: string,
        public matricula: string,
        endereco: string,
        telefone: string
    ) {
        super(nome, endereco, telefone); // Chama o construtor da classe base
    }

    // Sobrescrevendo o método apresentar
    public apresentar(): string {
        return `${super.apresentar()}, Matrícula: ${this.matricula}`;
    }
}
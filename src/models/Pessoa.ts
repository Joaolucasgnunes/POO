// src/models/Pessoa.ts
export class Pessoa {
    constructor(
        public nome: string,
        public endereco: string,
        public telefone: string
    ) {}

    public apresentar(): string {
        return `Nome: ${this.nome}, Endereço: ${this.endereco}, Telefone: ${this.telefone}`;
    }
}
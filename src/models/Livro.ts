// src/models/Livro.ts
export interface DadosAtualizaveisLivro {
    titulo?: string;
    autor?: string;
    isbn?: string;
    anoPublicacao?: number;
}

export class Livro {
    private id: number;
    private titulo: string;
    private autor: string;
    private isbn: string;
    private anoPublicacao: number;

    constructor(id: number, titulo: string, autor: string, isbn: string, anoPublicacao: number) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
        this.anoPublicacao = anoPublicacao;
    }

    // Métodos de acesso (getters)
    public getId(): number {
        return this.id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public getAutor(): string {
        return this.autor;
    }

    public getIsbn(): string {
        return this.isbn;
    }

    public getAnoPublicacao(): number {
        return this.anoPublicacao;
    }

    // Métodos setters
    public setTitulo(titulo: string): void {
        this.titulo = titulo;
    }

    public setAutor(autor: string): void {
        this.autor = autor;
    }

    public setIsbn(isbn: string): void {
        this.isbn = isbn;
    }

    public setAnoPublicacao(anoPublicacao: number): void {
        this.anoPublicacao = anoPublicacao;
    }

    // Método para atualizar dados do livro
    public atualizarDados(dadosAtualizados: DadosAtualizaveisLivro): void {
        if (dadosAtualizados.titulo) this.setTitulo(dadosAtualizados.titulo);
        if (dadosAtualizados.autor) this.setAutor(dadosAtualizados.autor);
        if (dadosAtualizados.isbn) this.setIsbn(dadosAtualizados.isbn);
        if (dadosAtualizados.anoPublicacao) this.setAnoPublicacao(dadosAtualizados.anoPublicacao);
    }
}
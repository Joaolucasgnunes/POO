// src/cli.ts
import * as readline from 'readline';
import { LivroService } from './services/LivroService';
import { MembroService } from './services/MembroService';
import { EmprestimoService } from './services/EmprestimoService';
import { Livro } from './models/Livro';
import { Membro } from './models/Membro';

const livroService = new LivroService();
const membroService = new MembroService();
const emprestimoService = new EmprestimoService();

// Carregar dados dos arquivos CSV
livroService.carregarLivros();
membroService.carregarMembros();
emprestimoService.carregarEmprestimos();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mostrarMenu() {
    console.log('\nMenu:');
    console.log('1. Adicionar Livro');
    console.log('2. Listar Livros');
    console.log('3. Adicionar Membro');
    console.log('4. Listar Membros');
    console.log('5. Realizar Empréstimo');
    console.log('6. Registrar Devolução');
    console.log('7. Listar Empréstimos Ativos');
    console.log('8. Sair');
}

function escolherOpcao(opcao: number) {
    switch (opcao) {
        case 1: adicionarLivro(); break;
        case 2: listarLivros(); break;
        case 3: adicionarMembro(); break;
        case 4: listarMembros(); break;
        case 5: realizarEmprestimo(); break;
        case 6: registrarDevolucao(); break;
        case 7: listarEmprestimosAtivos(); break;
        case 8: rl.close(); break;
        default: console.log('Opção inválida, tente novamente.'); solicitarOpcao(); break;
    }
}

function solicitarOpcao() {
    mostrarMenu();
    rl.question('Escolha uma opção: ', (opcao) => {
        escolherOpcao(Number(opcao));
    });
}

function adicionarLivro() {
    rl.question('Título: ', (titulo) => {
        rl.question('Autor: ', (autor) => {
            rl.question('ISBN: ', (isbn) => {
                rl.question('Ano de Publicação: ', (anoPublicacao) => {
                    const livro = new Livro(Date.now(), titulo, autor, isbn, Number(anoPublicacao));
                    livroService.adicionarLivro(livro);
                    console.log('Livro adicionado com sucesso!');
                    solicitarOpcao();
                });
            });
        });
    });
}

function listarLivros() {
    const livros = livroService.listarLivros();
    console.log('\nLivros:');
    livros.forEach(l => console.log(`${l.getId()}: ${l.getTitulo()} - ${l.getAutor()}`));
    solicitarOpcao();
}

function adicionarMembro() {
    rl.question('Nome: ', (nome) => {
        rl.question('Matrícula: ', (matricula) => {
            rl.question('Endereço: ', (endereco) => {
                rl.question('Telefone: ', (telefone) => {
                    const membro = new Membro(Date.now(), nome, matricula, endereco, telefone);
                    membroService.adicionarMembro(membro);
                    console.log('Membro adicionado com sucesso!');
                    solicitarOpcao();
                });
            });
        });
    });
}

function listarMembros() {
    const membros = membroService.listarMembros();
    console.log('\nMembros:');
    membros.forEach(m => console.log(`${m.id}: ${m.nome} - Matrícula: ${m.matricula}`));
    solicitarOpcao();
}

function realizarEmprestimo() {
    // Listar livros disponíveis
    const livrosDisponiveis = livroService.listarLivros();
    console.log('Livros disponíveis:', livrosDisponiveis);

    if (livrosDisponiveis.length === 0) {
        console.log('Não há livros disponíveis para empréstimo.');
        solicitarOpcao(); // Retorna ao menu
        return;
    }

    rl.question('Escolha o ID do livro: ', (livroId) => {
        const livro = livrosDisponiveis.find(l => l.getId() === Number(livroId));
        if (!livro) {
            console.log('Livro não encontrado.');
            solicitarOpcao(); // Retorna ao menu
            return;
        }

        // Verifica se o livro já está emprestado
        if (emprestimoService.isLivroEmprestado(livro)) {
            console.log('Este livro já está emprestado.');
            solicitarOpcao(); // Retorna ao menu
            return;
        }

        // Listar membros disponíveis
        const membrosDisponiveis = membroService.listarMembros();
        console.log('Membros disponíveis:', membrosDisponiveis);

        if (membrosDisponiveis.length === 0) {
            console.log('Não há membros registrados para realizar o empréstimo.');
            solicitarOpcao(); // Retorna ao menu
            return;
        }

        rl.question('Escolha o ID do membro: ', (membroId) => {
            const membro = membrosDisponiveis.find(m => m.id === Number(membroId));
            if (!membro) {
                console.log('Membro não encontrado.');
                solicitarOpcao(); // Retorna ao menu
                return;
            }

            rl.question('Data de devolução (ANO-MES-DIA): ', (dataDevolucao) => {
                const data = new Date(dataDevolucao);
                if (isNaN(data.getTime())) {
                    console.log('Data de devolução inválida. Tente novamente.');
                    solicitarOpcao(); // Retorna ao menu
                    return;
                }

                // Realiza o empréstimo
                const sucesso = emprestimoService.realizarEmprestimo(livro, membro, data);
                if (sucesso) {
                    console.log('Empréstimo realizado com sucesso!');
                } else {
                    console.log('Erro ao realizar o empréstimo. Verifique se o livro já está emprestado.');
                }
                solicitarOpcao(); // Retorna ao menu
            });
        });
    });
}

function registrarDevolucao() {
    const emprestimosAtivos = emprestimoService.listarEmprestimosAtivos();
    if (emprestimosAtivos.length === 0) {
        console.log('Não há empréstimos ativos.');
        solicitarOpcao();
        return;
    }

    console.log('\nEmpréstimos Ativos:');
    emprestimosAtivos.forEach(e => console.log(`ID: ${e.id} - Livro: ${e.livro.getTitulo()} - Membro: ${e.membro.apresentar()}`));

    rl.question('Escolha o ID do empréstimo para registrar a devolução: ', (emprestimoId) => {
        const devolvido = emprestimoService.registrarDevolucao(Number(emprestimoId));
        if (devolvido) {
            console.log('Devolução registrada com sucesso!');
        } else {
            console.log('Empréstimo não encontrado ou já devolvido.');
        }
        solicitarOpcao();
    });
}

function listarEmprestimosAtivos() {
    const emprestimosAtivos = emprestimoService.listarEmprestimosAtivos();
    console.log('\nEmpréstimos Ativos:');
    emprestimosAtivos.forEach(e => console.log(`Livro: ${e.livro.getTitulo()} - Membro: ${e.membro.apresentar()}`));
    solicitarOpcao();
}

// Iniciar o menu
solicitarOpcao();
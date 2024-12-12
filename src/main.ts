// src/main.ts
import { Livro } from './models/Livro';
import { Membro } from './models/Membro';
import { EmprestimoService } from './services/EmprestimoService';
import { LivroService } from './services/LivroService';
import { MembroService } from './services/MembroService';

const livroService = new LivroService();
const membroService = new MembroService();
const emprestimoService = new EmprestimoService();

// Adicionar livros
const livro1 = new Livro(1, 'O Senhor dos Anéis', 'J.R.R. Tolkien', '978-3-16-148410-0', 1954);
livroService.adicionarLivro(livro1);

// Adicionar membros
const membro1 = new Membro(1, 'João Silva', '12345', 'Rua A, 100', '(11) 91234-5678');
membroService.adicionarMembro(membro1);

// Demonstrar polimorfismo
console.log(membro1.apresentar()); // Chama o método apresentar do Membro

// Realizar empréstimo
emprestimoService.realizarEmprestimo(livro1, membro1, new Date('2024-06-01'));
console.log('\nEmpréstimos ativos:');
console.log(emprestimoService.listarEmprestimosAtivos());

// Registrar devolução
emprestimoService.registrarDevolucao(1);
console.log('\nEmpréstimos após devolução:');
console.log(emprestimoService.listarEmprestimosAtivos());

// Listar histórico
console.log('\nHistórico de empréstimos:');
console.log(emprestimoService.listarHistorico());
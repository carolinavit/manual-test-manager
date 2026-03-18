"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({
    url: process.env["DATABASE_URL"] ?? "file:./dev.db",
});
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const plan = await prisma.testPlan.create({
        data: {
            name: "Release 1.0 - Smoke",
            description: "Plano inicial de smoke tests para a Release 1.0",
            testSuites: {
                create: [
                    {
                        name: "Login",
                        description: "Cenários básicos de autenticação",
                        testCases: {
                            create: [
                                {
                                    title: "Login com credenciais válidas",
                                    preconditions: "Usuário cadastrado e ativo.",
                                    steps: [
                                        { action: "Acessar a tela de login" },
                                        { action: "Preencher usuário e senha válidos" },
                                        { action: "Clicar em Entrar" },
                                    ],
                                    expectedResult: "Usuário autenticado e redirecionado para a home.",
                                    testRuns: {
                                        create: [
                                            {
                                                status: client_1.TestRunStatus.Passed,
                                                evidence: "Screenshot: https://exemplo/evidencias/1",
                                                executedBy: "qa@exemplo.com",
                                            },
                                        ],
                                    },
                                },
                                {
                                    title: "Login com senha inválida",
                                    preconditions: "Usuário cadastrado.",
                                    steps: [
                                        { action: "Acessar a tela de login" },
                                        { action: "Informar usuário válido e senha inválida" },
                                        { action: "Clicar em Entrar" },
                                    ],
                                    expectedResult: "Exibir mensagem de erro e não autenticar.",
                                    testRuns: {
                                        create: [
                                            {
                                                status: client_1.TestRunStatus.Failed,
                                                evidence: "Mensagem diferente do esperado.",
                                                executedBy: "qa@exemplo.com",
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        name: "Carrinho",
                        description: "Fluxos essenciais do carrinho",
                        testCases: {
                            create: [
                                {
                                    title: "Adicionar item ao carrinho",
                                    preconditions: "Produto disponível em estoque.",
                                    steps: [
                                        { action: "Abrir a página de um produto" },
                                        { action: "Clicar em Adicionar ao carrinho" },
                                        { action: "Abrir o carrinho" },
                                    ],
                                    expectedResult: "Item aparece no carrinho com quantidade 1.",
                                    testRuns: {
                                        create: [
                                            {
                                                status: client_1.TestRunStatus.Blocked,
                                                evidence: "Ambiente instável / erro 500 ao carregar produto.",
                                                executedBy: "qa@exemplo.com",
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    return plan;
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});

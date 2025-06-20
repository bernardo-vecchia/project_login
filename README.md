Project Login Fullstack
=======================
Sistema completo de autenticação com frontend em Next.js + React + TypeScript + TailwindCSS e backend
em NestJS + TypeORM + PostgreSQL + JWT, com documentação de API via Swagger.
Visão Geral
-----------
O objetivo deste projeto é fornecer um fluxo seguro e moderno de login e autenticação para aplicações web:
- Frontend elegante e responsivo com design no TailwindCSS.
- Backend modular e escalável construído com NestJS.
- Segurança e autenticação via JWT.
- Documentação interativa com Swagger para testes e integração.
Arquitetura & Decisões de Design
--------------------------------
Frontend
- Next.js + React: Utilizado por sua renderização híbrida (SSR/SSG), performance e suporte nativo a rotas
API.
- TypeScript: Tipagem forte para maior confiabilidade e manutenção.
- TailwindCSS: Estilização rápida e responsiva baseada em utilitários, garantindo consistência visual.
- Estrutura de componentes: Separação clara entre páginas, componentes e hooks, seguindo convenções
do Next.js.
- Proteção de rotas: Implementada via HOC hooks (ex: useAuth) ou middleware, garantindo acesso somente
a usuários autenticados.
Backend
- NestJS: Arquitetura em módulos, inspirada em Angular, excelente para segurança e escalabilidade.
- TypeORM + PostgreSQL: ORM robusto que facilita mapeamento entre entidades e fácil migração.
- JWT: Auth sem estado, ideal para microsserviços e aplicações distribuídas.
- Camada de Autenticação: Módulos AuthModule, UserModule, controle de roles e guards para proteger
rotas com @UseGuards(JwtAuthGuard).
- Swagger (NestJS Swagger): Documentação via decorators (@ApiTags, @ApiBearerAuth, @ApiOperation)
que geram interface interativa em /api.

Instalação e Execução
---------------------
Backend
cd backend/
npm install
npm run start:dev
Swagger na URL: http://localhost:3000/api

Frontend
cd frontend/
npm install
npm run dev
Frontend disponível em: http://localhost:3000

Fluxo de Autenticação
---------------------
1. Usuário envia credenciais ao endpoint POST /auth/login
2. Backend valida e retorna JWT com tempo de expiração configurável
3. Frontend armazena o token (ex: localStorage)
4. Em requisições protegidas, token é enviado no header:
Authorization: Bearer <token>
5. Backend valida o token antes de liberar a rota
   
Documentação da API com Swagger
-------------------------------
Acesse a documentação interativa para testar os endpoints:
http://localhost:3000/api
Lá estão disponíveis rotas para Auth, User, exemplos de request/response e schemas.

Testes
------
cd backend
Exemplo de teste:
Dentro da pasta users, temos:
delete, inactive, list, profile ou update
Exemplo de test:
npm run test:e2e -- test/users/inactive.e2e-spec.ts

Dentro da pasta auth, temos:
last-login, login e register
Exemplo de test:
npm run test:e2e -- test/auth/login.e2e-spec.ts

Considerações Finais
--------------------
- Aplicação monolítica separada em frontend e backend facilita deploy e CI/CD individualizado.
- Aproveita o melhor da tipagem do TypeScript em toda a stack.
- A documentação Swagger permite integração rápida com outros serviços, como mobile apps ou
automações.

Deploy Frontend com Vercel
--------------------------
Para publicar o frontend utilizando a plataforma Vercel:
1. Acesse: https://vercel.com
2. Crie uma conta ou faça login com o GitHub
3. Importe o repositório do frontend do GitHub
4. Defina as variáveis de ambiente (se necessário)
5. Clique em "Deploy"
A aplicação será disponibilizada automaticamente em um domínio como:
https://project-login-frontend.vercel.app

Autor
-----
Desenvolvido por Bernardo Dalla Vecchia (https://github.com/bernardo-vecchia)

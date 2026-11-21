# API Cafeteria (grãos de café) — AS

API REST em ASP.NET Core (.NET 10) para cadastrar os grãos de café de uma cafeteria. Esta é a versão da **AS** (avaliação semestral): o mesmo projeto da AP1 e da AP2, agora com o código organizado por responsabilidade e testado no Bruno.

## Tema e objetivo

O recurso principal é o **café** (grão), com os campos `nome`, `torra`, `disponivel` e `quantidade`.

Objetivos desta versão:

- manter o CRUD persistente com **Entity Framework Core + SQLite** (os dados continuam salvos depois de reiniciar a API);
- separar os tipos em pastas por responsabilidade: entidade em `Models`, tipo de entrada em `Dtos` e contexto do banco em `Data`;
- deixar o `Program.cs` só com inicialização, middleware e rotas;
- demonstrar tudo com uma Collection do Bruno salva no repositório.

## Requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Bruno](https://www.usebruno.com/), para abrir a Collection de testes
- (opcional) `dotnet-ef`, apenas se quiser preparar o banco manualmente

## Como preparar e executar

```bash
git clone -b as https://github.com/iasmimsilva1906lizz/ApiCafes_AP1.git
cd ApiCafes_AP1
dotnet restore
dotnet build
dotnet run --urls http://localhost:5050
```

A API fica em **http://localhost:5050**.

### Banco de dados (migrations)

Este projeto usa **migrations** do Entity Framework Core. Elas ficam na pasta `Migrations/` e são aplicadas automaticamente quando a API inicia (`db.Database.Migrate()` no `Program.cs`), criando o arquivo SQLite `api-cafes-aula09.db`. Quem clonar o repositório não precisa fazer mais nada.

Para preparar o banco manualmente:

```bash
dotnet tool install --global dotnet-ef
dotnet ef database update
```

O arquivo `.db` **não é versionado** (está no `.gitignore`). Os dados cadastrados ficam nele e **permanecem depois de reiniciar a API**.

## Interface

Com a API rodando, abra **http://localhost:5050/**. A interface da AP2 (pasta `wwwroot/`) foi mantida e usa os endpoints reais para listar, cadastrar, editar e excluir grãos.

## Rotas da API

| Método | Rota              | Descrição                 | Resposta                    |
|--------|-------------------|---------------------------|-----------------------------|
| GET    | `/status`         | Informa que a API está no ar | 200                      |
| GET    | `/api/cafes`      | Lista todos os cafés      | 200                         |
| GET    | `/api/cafes/{id}` | Busca um café pelo id     | 200 ou 404                  |
| POST   | `/api/cafes`      | Cadastra um café          | 201 (com o id gerado)       |
| PUT    | `/api/cafes/{id}` | Atualiza um café          | 200 ou 404                  |
| DELETE | `/api/cafes/{id}` | Remove um café            | 204 (sem corpo) ou 404      |

### Exemplos de JSON

Corpo enviado no **POST** e no **PUT** (tipo de entrada `CafeDto`, sem o `id`):

```json
{
  "nome": "Bourbon Amarelo",
  "torra": "media",
  "disponivel": true,
  "quantidade": 10
}
```

Resposta do **POST** (201 Created):

```json
{
  "id": 1,
  "nome": "Bourbon Amarelo",
  "torra": "media",
  "disponivel": true,
  "quantidade": 10
}
```

Exemplo de **PUT** (atualização):

```json
{
  "nome": "Bourbon Amarelo",
  "torra": "escura",
  "disponivel": false,
  "quantidade": 7
}
```

## Estrutura de pastas

```
ApiCafes_AP1/
├── Program.cs           # inicialização, middleware, banco e endpoints
├── ApiCafes.csproj      # projeto .NET 10 e pacotes do EF Core / SQLite
├── appsettings.json     # string de conexão do SQLite e logs
├── appsettings.Development.json
├── Properties/          # perfil de execução (porta 5050)
├── Models/
│   └── Cafe.cs          # entidade: representa a tabela Cafes
├── Dtos/
│   └── CafeDto.cs       # tipo de entrada (record) do POST e do PUT
├── Data/
│   └── ApiDbContext.cs  # contexto do EF Core: ponte com o banco
├── Migrations/          # migrations versionadas do banco
├── wwwroot/             # interface (index.html, app.js, style.css)
├── bruno/               # Collection de testes do Bruno
├── aula-14-erros.md     # anotações do tratamento de exceções
└── README.md
```

### Por que os tipos foram separados

| Arquivo | Responsabilidade |
|---|---|
| `Models/Cafe.cs` | Descreve o dado como ele é guardado no banco (inclui o `Id` gerado pelo banco). |
| `Dtos/CafeDto.cs` | Descreve o dado como ele chega do cliente (sem `Id`). Separa o contrato da API do modelo do banco. |
| `Data/ApiDbContext.cs` | Faz a ligação entre o código e o SQLite por meio do `DbSet<Cafe>`. |
| `Program.cs` | Só registra o contexto, configura o middleware e define as rotas. |

O `Program.cs` encontra os tipos movidos pelos imports no topo do arquivo:

```csharp
using ApiCafes.Data;     // ApiDbContext
using ApiCafes.Dtos;     // CafeDto
using ApiCafes.Models;   // Cafe
```

Cada arquivo declara o namespace da sua pasta (`ApiCafes.Models`, `ApiCafes.Dtos` e `ApiCafes.Data`).

## Tratamento de erros

Um middleware (`UseExceptionHandler`) captura exceções não tratadas e devolve **500** com uma mensagem genérica em JSON, sem expor detalhes internos da aplicação. Ids inexistentes retornam **404**. O registro do teste feito na aula 14 está em `aula-14-erros.md`. Não há nenhuma rota de falha proposital nesta versão.

## Collection de testes (Bruno)

A Collection está na pasta **`bruno/`**.

1. Abra o Bruno e use **Open Collection**, escolhendo a pasta `bruno/` do repositório.
2. Selecione o ambiente **local** (`baseUrl = http://localhost:5050`).
3. Com a API rodando, execute as requisições na ordem:

| # | Requisição | Resultado esperado |
|---|---|---|
| 00 | `GET /status` | 200 |
| 01 | `GET /api/cafes` | 200 e a listagem |
| 02 | `POST /api/cafes` | 201 e o registro com `id` (guardado na variável `cafeId`) |
| 03 | `GET /api/cafes/{{cafeId}}` | 200 e os mesmos dados criados |
| 04 | `PUT /api/cafes/{{cafeId}}` | 200 e os dados atualizados |
| 05 | `GET /api/cafes/{{cafeId}}` | 200, confirmando a atualização |
| 06 | `DELETE /api/cafes/{{cafeId}}` | 204, sem corpo |
| 07 | `GET /api/cafes/{{cafeId}}` | 404 depois da exclusão |
| 08 | `POST /api/cafes` (segundo registro) | 201 (id guardado em `cafeId2`) |
| 09 | `GET /api/cafes/{{cafeId2}}` | 200, **depois de reiniciar a API** |

O id é sempre o retornado pelo POST, nunca um valor fixo.

### Teste de persistência

1. Envie a requisição **08** e anote o `id`.
2. Pare a API (Ctrl+C) e inicie de novo com `dotnet run --urls http://localhost:5050`.
3. Envie a requisição **09**: o registro continua no banco.

## Branches do repositório

| Branch | Conteúdo |
|---|---|
| `main` | Base do projeto (AP1) |
| `aula-9-banco` | AP2: EF Core, SQLite e interface |
| `as` | AS: esta versão, com o código organizado por responsabilidade |

## Vídeo de demonstração — AS

🎥 COLE AQUI O LINK DO VÍDEO DA AS

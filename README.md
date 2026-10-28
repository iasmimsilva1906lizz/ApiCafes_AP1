# API Cafeteria (grãos de café) — AP2

API REST com Minimal APIs em ASP.NET Core (.NET 10), **Entity Framework Core + SQLite** e frontend em HTML/CSS/JS servido pela própria API (mesma origem). Evolução da AP1: a `List<T>` em memória foi substituída por banco de dados.

## Requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Bruno](https://www.usebruno.com/) (para a Collection de testes)

## Como executar

```bash
git clone https://github.com/iasmimsilva1906lizz/ApiCafes_AP1.git
cd ApiCafes_AP1
dotnet restore
dotnet build
dotnet run --urls http://localhost:5050
```

O banco SQLite (`api-cafes-aula09.db`) é criado automaticamente ao iniciar, a partir das migrations da pasta `Migrations/`. Se preferir prepará-lo manualmente:

```bash
dotnet tool install --global dotnet-ef
dotnet ef database update
```

O arquivo `.db` não é versionado; os dados cadastrados ficam salvos nele e **permanecem após reiniciar a API**.

## Como abrir a interface

Com a API rodando, acesse **http://localhost:5050/** no navegador. A interface (pasta `wwwroot/`) lista, cadastra, edita e exclui grãos usando os endpoints reais.

## Rotas da API

| Método | Rota               | Descrição            | Resposta                  |
|--------|--------------------|----------------------|---------------------------|
| GET    | `/status`          | Status da API        | 200                       |
| GET    | `/api/cafes`       | Lista todos os cafés | 200                       |
| GET    | `/api/cafes/{id}`  | Busca por id         | 200 ou 404                |
| POST   | `/api/cafes`       | Cadastra um café     | 201 (400 se inválido)     |
| PUT    | `/api/cafes/{id}`  | Atualiza um café     | 200, 404 (400 se inválido)|
| DELETE | `/api/cafes/{id}`  | Remove um café       | 204 ou 404                |

### Exemplo de JSON (POST e PUT)

```json
{
  "nome": "Bourbon Amarelo",
  "torra": "media",
  "disponivel": true,
  "quantidade": 10
}
```

## Estrutura

- `Program.cs` — Model (`CafesEntity`), `ApiDbContext` e rotas
- `Migrations/` — migrations do EF Core
- `wwwroot/` — frontend (`index.html`, `app.js`, `style.css`)
- `bruno/` — Collection com GET (lista), GET por id, POST, PUT, DELETE e 404

## Collection de testes

Abra o Bruno e importe a pasta `bruno/` como Collection existente. Execute na ordem (01 a 07); o último request confirma o 404 após a exclusão.

## Vídeo de demonstração — AP2

🎥 COLE_AQUI_O_LINK_PUBLICO_DO_VIDEO_DA_AP2
# API CAFETERIA(CAFÉS EM GRÃOS)

API REST desenvolvida com Minimal APIs em ASP.NET Core (.NET 10), com o tema Cafeteria. O objetivo é praticar um CRUD completo (Create, Read, Update, Delete) usando uma List<T> em memória, sem banco de dados.

# Requisitos

.NET 10 SDK instalado — [download aqui](https://dotnet.microsoft.com/download/dotnet/10.0)

# Como executar o projeto

```bash
git clone https://github.com/iasmimsilva1906lizz/ApiCafes_AP1.git
cd ApiCafes
dotnet restore
dotnet run --urls http://localhost:5050
```
# URL local utilizada nos testes
http://localhost:5050

## Endpoints

| Método | Rota                         | Descrição                                   |
|--------|------------------------------|---------------------------------------------|
| GET    | `/`                          | Informa que a API está no ar                |
| GET    | `/api/cafes`                 | Lista todos os Cafés                        |
| GET    | `/api/cafes/{id}`            | Busca um café pelo id                       |
| POST   | `/api/cafes`                 | Cadastra um novo café                       |
| PUT    | `/api/cafes/{id}`            | Atualiza um café existente                  |
| DELETE | `/api/cafes/{id}`            | Remove um café                              |

## Exemplos de JSON

### POST `/api/cafes`

```json
{
    "nome":"centro",
    "torra":"media",
    "disponivel":true,
    "quantidades": 4
}
```

### PUT `/api/cafes/{id}`

```json
{
    "nome":"centro",
    "torra":"media",
    "disponivel":true,
    "quantidades": 1
}
```

## Aviso sobre persistência dos dados

⚠️ Os dados ficam armazenados apenas em memória, em uma `List<T>`. Todo dado criado, atualizado ou removido é perdido quando a aplicação é reiniciada.

## Collection de testes

A Collection do Bruno utilizada para testar os endpoints está na pasta bruno(./bruno) deste repositório. Para usá-la, abra o Bruno e importe essa pasta como uma Collection existente.

## Vídeo de demonstração

🎥 [Link público do vídeo aqui]
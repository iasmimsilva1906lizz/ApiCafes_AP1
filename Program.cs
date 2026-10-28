using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ApiDbContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors();
var app = builder.Build(); app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseDefaultFiles();
app.UseStaticFiles();

// Cria o banco a partir das migrations versionadas ao iniciar
// (quem clonar o repositório não precisa rodar "dotnet ef database update").
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApiDbContext>();
    
}

// primeiro get para mostrar status da api 
app.MapGet("/status", () => "Api cafes esta no ar");

// cria a lista, nome da lista é cafes, os itens dentro dela são cafes;
// a lista possui o id, nome, torra, disponibilidade e quantidade;
// a lista nao possui nenhuma infrmaçao no momento de exemplo porque 
// ja foi tudo salvo no banco de dado, a partir de agora as
//  infrmaoçoes nao somem mais depois de fechar a api;
var Cafes = new List<Cafe>
{

};

// map.get() é a rota que o comando percorre, retornando um resultado 
// (a lista de cafes), um status, no casso o 200 ok;
// o metodo async e await sao para esperar o acesso no bano de dados;
app.MapGet("/api/cafes",  async (ApiDbContext db ) =>
{
    var cafes = await db.Cafes.ToListAsync();
    return Results.Ok(cafes);    
});

// vai percorrer a lista de cafes e procurar pelo item que tem o mesmo id com 
// o que foi escolhido; se tiver retorna um 200 ok; senao retorna um not found 404.
app.MapGet("/api/cafes/{id:int}", async  (int id, ApiDbContext db) =>
{
    var cafe = await db.Cafes.FindAsync(id);
    return cafe is null ? Results.NotFound() : Results.Ok(cafe);
 
});

// abre o body do programa para poder ser adicionado um novo item na lista, deve retornar um 
// 201 created 
// o id é criado pelo banco 
app.MapPost("/api/cafes", async (CafesEntity dados, ApiDbContext db) => 
{
    db.Cafes.Add(dados);
    await db.SaveChangesAsync();
    return Results.Created($"/api/cafes/{dados.id}", dados);
});

// uma forma de atualizar um dado de um cafe da lista, deve ser passado o id 
// e as informaçoes completas juntamente com as que serao modificadas.
// se o id passado for de um item inexistente retorna um 404 no0f found;
// se nao retornara um 200 ok 
app.MapPut("/api/cafes/{id:int}",async (int id, CafesEntity cafeAtualizado, ApiDbContext db) =>
{
    var cafe = await db.Cafes.FindAsync(id);
    if (cafe is null) return Results.NotFound();

        cafe.nome = cafeAtualizado. nome;
        cafe.torra = cafeAtualizado.torra;
        cafe.disponivel = cafeAtualizado.disponivel;
        cafe.quantidade = cafeAtualizado.quantidade;
        // colocar todas as infrmacoes que podew ser atualizadas 

    await db.SaveChangesAsync();
    return Results.Ok(cafe);
});

// vai deletar um item(cafe) da lista de acordo com o id que for passado
// retorna um 204 no content porwue o  item ja nao vai mais existir
app.MapDelete("/api/cafes/{id:int}", async (int id,ApiDbContext db) =>
{
    var cafe = await db.Cafes.FindAsync(id);
    if (cafe is null) return Results.NotFound();

    db.Cafes.Remove(cafe);
    await db.SaveChangesAsync();
    return Results.NoContent();
});


app.Run();
record Cafe (int id, string nome, string torra, bool disponivel, int quantidade);

record CafeDTO (string nome, string torra, int quantidade, bool disponivel);

record CafeAtualizadoDTO (string nome, string torra, bool disponivel, int quantidade);

class CafesEntity
{
    public int id {get; set;}
    public String? nome {get; set;}
    public String? torra {get; set;}
    public bool disponivel {get; set;}
    public int quantidade {get; set;}
}
class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options)
     : base(options)
    {
     
    }
    public DbSet<CafesEntity> Cafes => Set<CafesEntity>();
}
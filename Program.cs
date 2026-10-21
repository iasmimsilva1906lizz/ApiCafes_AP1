using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors();
var app = builder.Build();
app.UseCors(policy => policy.AllowAnyOrigin()
    .AllowAnyHeader().AllowAnyMethod());
// primeiro get para mostrar status da api 
app.MapGet("/", () => "Api cafes esta no ar");

// cria a lista, nome da lista é cafes, os itens dentro dela são cafes;
// a lista possui o id, nome, torra, disponibilidade e quantidade;

var Cafes = new List<Cafe>
{

};

// map.get() é a rota que o comando percorre, retornando um resultado (a lista de cafes), um status, no casso o 200 ok;
app.MapGet("/api/cafes",  async (ApiDbContext db ) =>
{
    var cafes = await db.Cafes.ToListAsync();
    return Results.Ok(cafes);    
});

// vai percorrer a lista de cafes e procurar pelo item que tem o mesmo id com 
// o que foi escolhido; se tiver retorna um 200 ok; senao retorna um not found 404.
app.MapGet("/api/cafes/{id:int}", async  (int id, ApiDbContext db) =>
{
    var CafeEncontrado = db.Cafes.Find(id);

    if (CafeEncontrado is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(CafeEncontrado);
});

// abre o body do programa para poder ser adicionado um novo item na lista, deve retornar um 
// 201 created 
app.MapPost("/api/cafes", async (CafesEntity dados, ApiDbContext db) => 
{
    db.Cafes.Add(dados);
    // var NovoCafe = new Cafe(ProximoId, dados.nome, dados.torra, true, dados.quantidade);
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
    if (cafe is null) Results.NotFound();
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
    if (cafe is null) Results.NotFound();

    // int indice = Cafes.FindIndex(CafeDaLista => CafeDaLista.id == id);
    // if (indice == -1)
    // {
    //     return Results.NotFound();
    // }
    db.Cafes.Remove(cafe);
    await db.SaveChangesAsync();
    return Results.NoContent();
});



app.Run();
record Cafe (int id, string nome, string torra, bool disponivel, int quantidade);

record CafeDTO (string nome, string torra, int quantidade);

record CafeAtualizadoDTO (string nome, string torra, bool disponivel, int quantidade);

class CafesEntity
{
    public int id {get; set;}
    public String nome {get; set;}
    public String torra {get; set;}
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

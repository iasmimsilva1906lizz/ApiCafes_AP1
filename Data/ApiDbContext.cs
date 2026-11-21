namespace ApiCafes.Data;
using ApiCafes.Models;
using Microsoft.EntityFrameworkCore;

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options)
     : base(options)
    {
     
    }
    public DbSet<CafesEntity> Cafes => Set<CafesEntity>();
}
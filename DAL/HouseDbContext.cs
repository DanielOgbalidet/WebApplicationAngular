//using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApplicationAngular.Models;

namespace WebApplicationAngular.DAL;

public class HouseDbContext : DbContext
{
    public HouseDbContext(DbContextOptions<HouseDbContext> options) : base(options)
    {
        //Database.EnsureCreated();
    }

    public DbSet<House> Houses { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<Order> Order { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {   
        optionsBuilder.UseLazyLoadingProxies();
    }
}

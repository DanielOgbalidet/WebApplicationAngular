
using WebApplicationAngular.Models;

namespace WebApplicationAngular.DAL;

public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        HouseDbContext context = serviceScope.ServiceProvider.GetRequiredService<HouseDbContext>();
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

        if (!context.Houses.Any())
        {
            var houses = new List<House>
            {
                new House
            {
                HouseId = 1,
                Price = 34,
                Address = "nsjfne",
                ImageUrl = "34",
                Bedrooms = 34,
                Guests = 34,
                Description = "34",
                UserId = 34
            },
        };
            context.AddRange(houses);
            context.SaveChanges();
        }

    }
}

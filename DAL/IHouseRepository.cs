using WebApplicationAngular.Models;

namespace WebApplicationAngular.DAL;

//An interface to declare methods of obtaining all house objects, getting specific houses by the id and also creating, updating and deletion of houses
public interface IHouseRepository
{
    Task<IEnumerable<House>> GetAll();
    Task<House?> GetHouseById(int id);
    Task<bool> Create(House house);
    Task<bool> Update(House house);
    Task<bool> Delete(int id);
}


using WebApplicationAngular.Models;

namespace WebApplicationAngular.DAL;



//A interface to manipulate and obtain specific orders by their id, creating and updating various orders and also deleting them by their id's
public interface IOrderRepository
{
    Task<Order?> GetOrderById(int id);
    Task<bool> Create(Order order);
    Task<bool> Update(Order order);
    Task<bool> Delete(int id);
}

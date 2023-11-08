using WebApplicationAngular.Models;

namespace WebApplicationAngular.DAL;

public class OrderRepository : IOrderRepository
{
    private readonly HouseDbContext _db;
    private readonly ILogger<OrderRepository> _logger;

    //Constructor to initialize the db database and logger for logging errors
    public OrderRepository(HouseDbContext db, ILogger<OrderRepository> logger)
    {
        _db = db;
        _logger = logger;
    }

    //A method to find an order from the database with the orderId
    public async Task<Order?> GetOrderById(int id)
    {
        return await _db.Order.FindAsync(id);
    }

    //Method to add a new order to the database
    public async Task<bool> Create(Order order)
    {
        try
        {
            _db.Order.Add(order);
            await _db.SaveChangesAsync();
            return true;
        }
        //Writes out error message
        catch (Exception e)
        {
            _logger.LogError($"Order creation failed for order {@order}, error message: {e}", order, e.Message);
            return false;
        }
    }

    //Method for updating an order in the database
    public async Task<bool> Update(Order order)
    {
        try
        {
            _db.Order.Update(order);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError($"FindAsync(id) failed when updating the OrderId {order.OrderId:0000}, error message: {e}", order, e.Message);
            return false;
        }
    }

    //Method for deleting an order in the database
    public async Task<bool> Delete(int id)
    {
        try
        {
            //Checks if order exists 
            var order = await _db.Order.FindAsync(id);
            if (order == null)
            {
                _logger.LogError("Order not found for the OrderId {OrderId:0000}", id);
                return false;
            }
            //Removes order
            _db.Order.Remove(order);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("Order deletion failed for the OrderId {OrderId:0000}, error message: {e}", id, e.Message);
            return false;
        }
    }
}

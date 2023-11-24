using Microsoft.AspNetCore.Mvc;
using WebApplicationAngular.Models;
using Microsoft.AspNetCore.Authorization;
using WebApplicationAngular.DAL;
using Microsoft.AspNetCore.Identity;

namespace WebApplicationAngular.Controllers;

[ApiController]
[Route("api/[controller]")]

public class OrderController : Controller
{
    private readonly IOrderRepository _orderRepository;
    private readonly HouseDbContext _houseDbContext;
    private readonly ILogger<HouseController> _logger;

    public OrderController(HouseDbContext houseDbContext, ILogger<HouseController> logger, IOrderRepository orderRepository)
    {
        _houseDbContext = houseDbContext;
        _logger = logger;
        _orderRepository = orderRepository;
    }

    [HttpPost("createOrder")]
    //Method that creates a new order
    public async Task<IActionResult> CreateOrder(String trip_start, String trip_end, int inHouseId, int inTotalPrice, String email)
    {
        try
        {
            int inUserId = ShowUserId(email);
            //Find the current date for the order date
            DateTime currentDateTime = DateTime.Now;
            string curdate = currentDateTime.ToString("yyyy-MM-dd");

            //Make the new order
            var order = new Order
            {
                OrderDate = curdate,
                UserId = inUserId,
                HouseId = inHouseId,
                StartDate = trip_start,
                EndDate = trip_end,
                TotalPrice = inTotalPrice
            };

            //Add the new order to the database
            _houseDbContext.Order.Add(order);
            await _houseDbContext.SaveChangesAsync();
            var response = new { success = true, message = "Order created successfully" };
            return Ok(response);
        }

        catch
        {
            _logger.LogError($"Order creation failed");
            var response = new { success = false, message = "Order creation failed" };
            return Ok(response);
        }
    }

    [HttpPut("updateOrder/{id}")]
    //Update order
    public async Task<IActionResult> UpdateOrder(Order order)
    {
        if (order == null)
        {
            return BadRequest("Invalid order data.");
        }
        bool returnOk = await _orderRepository.Update(order);
        if (returnOk)
        {
            var response = new { success = true, message = "Order updated successfully" };
            return Ok(response);
        }
        else
        {
            _logger.LogError("[OrderController] Order update failed");
            var response = new { success = false, message = "Order creation failed" };
            return Ok(response);
        }
    }

    [HttpDelete("deleteOrder/{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        //Try to delete order
        bool returnOk = await _orderRepository.Delete(id);
        if (!returnOk)
        {
            //Error message if it fails
            _logger.LogError("[OrderController] Order deletion failed for the OrderId {OrderId:0000}", id);
            var response = new { success = true, message = "Order updated successfully" };
            return Ok(response);
        } else
        {
            var response = new { success = true, message = "Order " + id.ToString() + " deleted successfully" };
            return Ok(response);
        }
    }

    //Find user from database
    public int ShowUserId(string id)
    {
        //Retreive user with email
        var user = _houseDbContext.User.FirstOrDefault(u => u.Email == id);

        //Check if user exists
        if (user != null)
        {

            string userIdString = user.UserId.ToString();

            if (int.TryParse(userIdString, out int userId))
            {
                _logger.LogInformation($"User ID: {userId}");
                return userId;
            }
            else
            {
                _logger.LogError($"Unable to convert user.Id to int for email: {id}");
                return -1;
            }
        }
        else
        {
            _logger.LogWarning($"User not found for email: {id}");
            return -2;
        }
    }

    //Find all orders for one user
    public List<Order> GetOrdersByUserId(int id)
    {
        //Retreive orders to list
        var orders = _houseDbContext.Order.Where(o => o.UserId == id).ToList();

        if (orders.Count > 0)
        {
            _logger.LogInformation($"Found {orders.Count} orders with UserId: {id}");
        }
        else
        {
            _logger.LogWarning($"No orders found with UserId: {id}");
        }

        return orders;
    }
}

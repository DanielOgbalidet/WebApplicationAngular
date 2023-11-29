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
    public async Task<IActionResult> CreateOrder([FromBody] Order inOrder)
    {
        if (inOrder == null)
        {
            return BadRequest("Invalid house data");
        }

        try
        {
            //int inUserId = ShowUserId(inOrder.User.Email);

            //Find the current date for the order date
            DateTime currentDateTime = DateTime.Now;
            string curdate = currentDateTime.ToString("yyyy-MM-dd");

            //Make the new order
            var order = new Order
            {
                OrderDate = inOrder.OrderDate,
                UserId = inOrder.UserId,
                HouseId = inOrder.HouseId,
                House = inOrder.House,
                StartDate = inOrder.StartDate,
                EndDate = inOrder.EndDate,
                TotalPrice = inOrder.TotalPrice
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
            return BadRequest(response);
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
            return BadRequest(response);
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
            var response = new { success = false, message = "Order " + id.ToString() + " delete failed" };
            return BadRequest(response);
        }
    }

    //Find user from database
    public int ShowUserId(string email)
    {
        //Retreive user with email
        var user = _houseDbContext.User.FirstOrDefault(u => u.Email == email);

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
                _logger.LogError($"Unable to convert user.Id to int for email: {email}");
                return -1;
            }
        }
        else
        {
            _logger.LogWarning($"User not found for email: {email}");
            return -2;
        }
    }

    //Find all orders for one user
    [HttpGet("orders/{email}")]
    public List<Order> GetOrdersByUserId(string email)
    {
        int id = ShowUserId(email);

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

    [HttpGet("getOrderById/{orderId}")]
    public async Task<IActionResult> GetOrderById(int orderId)
    {
        _logger.LogError($"Funker det? {orderId}");
        var order = await _orderRepository.GetOrderById(orderId);
        if(order == null)
        {
            _logger.LogError("[OrderController] Order not found");
            return NotFound("Order not found");
        }
        return Ok(order);
    }
}

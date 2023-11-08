using Microsoft.AspNetCore.Mvc;
using WebApplicationAngular.Models;
using Microsoft.AspNetCore.Authorization;
using WebApplicationAngular.DAL;
using Microsoft.AspNetCore.Identity;

namespace WebApplicationAngular.Controllers;

public class OrderController : Controller
{
    private readonly IOrderRepository _orderRepository;
    private readonly HouseDbContext _houseDbContext;
    private readonly ILogger<HouseController> _logger;
    private readonly UserManager<IdentityUser> _userManager;

    public OrderController(HouseDbContext houseDbContext, ILogger<HouseController> logger, IOrderRepository orderRepository, UserManager<IdentityUser> userManager)
    {
        _houseDbContext = houseDbContext;
        _logger = logger;
        _orderRepository = orderRepository;
        _userManager = userManager;
    }


    [Authorize]
    //Show all orders a sepcific user made
    public async Task<IActionResult> Table(String email)
    {
        //If user is sent to orders from login
        if (string.IsNullOrEmpty(email))
        {
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                email = user.Email;
            }
        }
        //Find specific user
        int id = ShowUserId(email);
        //Find all orders from user
        var orders = GetOrdersByUserId(id);
        if (orders == null)
        {
            _logger.LogError("Orders list not found while executing GetOrdersByUserId");
            return NotFound("Order list not found");
        }
        return View(orders);
    }

    [Authorize]
    [HttpGet("{inHouseId}")]
    public IActionResult CreateOrder(int inHouseId)
    {
        return RedirectToAction("Details", "House", new { id = inHouseId });
    }

    [Authorize]
    [HttpPost]
    //Method that creates a new order
    public async Task<IActionResult> CreateOrder(String trip_start, String trip_end, int inHouseId, int inTotalPrice, String email)
    {
        //Check that the user chose more than 0 days
        if (inTotalPrice == 0)
        {
            return RedirectToAction("Details", "House", new { id = inHouseId });
        }

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
            return RedirectToAction("Table", "Order", new { email = email });
        }

        catch
        {
            _logger.LogError($"Order creation failed");
            return BadRequest("Order creation failed");
        }
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id)
    {
        //Find the specific order
        var order = await _orderRepository.GetOrderById(id);
        if (order == null)
        {
            _logger.LogError("[OrderController] Order not found when updating the OrderId {OrderId: }", id);
            return BadRequest("Order not found for the OrderId");
        }
        return View(order);
    }

    [HttpPost]
    [Authorize]
    //Update order
    public async Task<IActionResult> Update(Order order, String email)
    {
        //Try to update an order
        bool returnOk = await _orderRepository.Update(order);
        if (returnOk)
        {
            return RedirectToAction("Table", "Order", new { email = email });
        }
        _logger.LogWarning("[OrderController] Order update failed {@order}", order);
        return View(order);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        //Find specific order
        var order = await _orderRepository.GetOrderById(id);
        if (order == null)
        {
            //Error message if it fails
            _logger.LogError("[OrderController] Order not found for the orderId {@OrderId:0000}", id);
            return BadRequest("Order not found for the OrderId");
        }
        return View(order);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> DeleteConfirmed(int id, string email)
    {
        //Try to delete order
        bool returnOk = await _orderRepository.Delete(id);
        if (!returnOk)
        {
            //Error message if it fails
            _logger.LogError("[OrderController] Order deletion failed for the OrderId {OrderId:0000}", id);
            return BadRequest("Order deletion failed for this orderId");
        }
        return RedirectToAction("Table", "Order", new { email = email });
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

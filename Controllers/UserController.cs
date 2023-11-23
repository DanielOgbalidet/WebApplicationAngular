using Microsoft.AspNetCore.Mvc;
using WebApplicationAngular.Models;
using WebApplicationAngular.DAL;

namespace WebApplicationAngular.Controllers;

[ApiController]
[Route("api/[controller]")]

public class UserController : Controller
{
    private readonly HouseDbContext _houseDbContext;
    private readonly HouseDbContext _db;
    private readonly ILogger<HouseController> _logger;

    public UserController(HouseDbContext houseDbContext, ILogger<HouseController> logger, HouseDbContext db)
    {
        _houseDbContext = houseDbContext;
        _logger = logger;
        _db = db;
    }

    [HttpGet]
    public IActionResult CreateUser()
    {
        return View();
    }

    [HttpPost]
    //Method for creating user
    public async Task<IActionResult> CreateUser(User user)
    {
        try
        {
            _logger.LogInformation("Attempting to create a user.");
            //Check id the user object sent in is valid
            if (ModelState.IsValid)
            {
                //If user is valid, add to database
                _houseDbContext.User.Add(user);
                await _houseDbContext.SaveChangesAsync();
                _logger.LogInformation("User created successfully.");
                return RedirectToAction("Grid", "House");
            }
            else
            {
                _logger.LogWarning("Model state is invalid.");
            }
            return View(user);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating user: {ex.Message}");
            return View(user);
        }
    }

    [HttpGet("login")]
    public bool Login(string email, string password)
    {
        var user = _db.User.FirstOrDefault(x => x.Email == email && x.Password == password);

        if (user == null)
        {
            return false;
        }
        else return true;
    }
}

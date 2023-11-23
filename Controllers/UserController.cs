using Microsoft.AspNetCore.Mvc;
using WebApplicationAngular.Models;
using WebApplicationAngular.DAL;
using BCrypt.Net;

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

    [HttpPost("createUser")]
    //Method for creating user
    public async Task<IActionResult> CreateUser([FromBody] User user)
    {
        try
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.Password = hashedPassword;

            _houseDbContext.User.Add(user);
            await _houseDbContext.SaveChangesAsync();
            var response = new { success = true, message = "User " + user.Email + " created successfully" };
            return Ok(response);
        }
        catch (Exception e) //Error handling if the house dosen't get created
        {
            _logger.LogError("User creation failed for user {@user}, error message: {e}", user, e.Message);
            var response = new { success = false, message = "User creation failed" };
            return Ok(response);
        }
    }

    [HttpGet("login")]
    public bool Login(string email, string password)
    {
        //Checks for email
        var user = _db.User.FirstOrDefault(x =>  x.Email == email);

        //If email doesnt exists, return false
        if (user == null)
        {
            return false;
        }
        else
        {
            //Check hashed password in table against password used for logging in
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
            return isPasswordValid;
        }
    }
}

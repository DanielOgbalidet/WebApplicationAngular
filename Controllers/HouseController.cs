using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplicationAngular.DAL;
using WebApplicationAngular.Models;
using Microsoft.AspNetCore.Identity;

namespace WebApplicationAngular.Controllers;

public class HouseController : Controller
{

    private readonly IHouseRepository _houseRepository;
    private readonly ILogger<HouseController> _logger;
    private readonly HouseDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;

    public HouseController(IHouseRepository houseRepository, ILogger<HouseController> logger, HouseDbContext db, UserManager<IdentityUser> userManager)
    {
        _houseRepository = houseRepository;
        _logger = logger;
        _db = db;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var houses = await _houseRepository.GetAll();
        if (houses == null)
        {
            _logger.LogError("[HouseController] House list not found while executing _houseRepository.GetAll()");
            return NotFound("House list not found");
        }
        return Ok(houses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetHousebyId(int id)
    {
        var house = await _houseRepository.GetHouseById(id);
        if (house == null)
        {
            _logger.LogError("[HouseController] House list not found while executing _houseRepository.GetAll()");
            return NotFound("House list not found");
        }
        return Ok(house);
    }

    //post-mothod for creating an house, needs to be authorized to use,
    //takes an house-object, creators email, an grid-image and a list of
    //images for the detail-view as arguments
    [HttpPost("create")]
    [Authorize]
    //Method for creating a new house
    public async Task<IActionResult> Create([FromBody] House house, String email, IFormFile? gridImage, List<IFormFile>? moreImg)
    {
        //gets users id through the ShowUserId-function
        int user = ShowUserId(email);
        house.UserId = user;

        //sets House´s ImageUrl as the gridImage´s name if an gridImage is inserted
        if (gridImage != null)
        {
            house.ImageUrl = gridImage.FileName;
        }

        //Check if attributes are valid
        if (ModelState.IsValid)
        {
            CreateDirGridImg(house.Address, gridImage); //calls the function for creation of imagefolder

            //if one of more images are inserted in the moreImg-list, UplodImages are called
            if (moreImg != null && moreImg.Count > 0)
            {
                UploadImages(moreImg, house.Address);
            }
        }
        //Creates and adds a new house to the database
        bool returnOk = await _houseRepository.Create(house);
        if (returnOk)
        {
            var response = new { success = true, message = "House " + house.Address + " created successfully" };
            return Ok(response);
        }
        else
        {
            var response = new { success = false, message = "House creation failed" };
            return Ok(response);
        }

    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(House house)
    {
        if (house == null)
        {
            return BadRequest("Invalid house data.");
        }
        bool returnOk = await _houseRepository.Update(house);
        if (returnOk)
        {
            var response = new { success = true, message = "House " + house.Address + " updated successfully" };
            return Ok(response);
        }
        else
        {
            _logger.LogError("[HouseController] House update failed for the House " + house.Address);
            var response = new { success = false, message = "House creation failed" };
            return Ok(response);
        }
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteHouse(int id)
    {
        bool returnOk = await _houseRepository.Delete(id);
        if (!returnOk)
        {
            _logger.LogError("[HouseController] House deletion failed for the HouseId {HouseId:0000}", id);
            return BadRequest("House deletion failed");
        }
        var response = new { success = true, message = "House " + id.ToString() + " deleted successfully" };
        return Ok(response);
    }

    //Find a user with the corresponding email
    public int ShowUserId(string id)
    {
        //Retreive user from database
        var user = _db.User.FirstOrDefault(u => u.Email == id);

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

    //Find all houses that was created by a specific user
    public List<House> GetHousesByUserId(int id)
    {
        var houses = _db.Houses.Where(h => h.UserId == id).ToList();

        if (houses.Count > 0)
        {
            _logger.LogInformation($"Found {houses.Count} houses with UserId: {id}");
        }
        else
        {
            _logger.LogWarning($"No houses found with UserId: {id}");
        }

        return houses;
    }

    //function for creating imagefolder for each house and adds gridImage to the folder.
    //Takes the houses´ address and gridImage as arguments
    public void CreateDirGridImg(string address, IFormFile gridImage)
    {
        //string-builder for path to the right directory
        string curdir = System.IO.Directory.GetCurrentDirectory();
        string subpath = curdir + "/wwwroot/images/";
        string path = System.IO.Path.Combine(subpath, address);

        // Creates new folder if it doesnt exist. Only true when creating new house
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
            _logger.LogInformation($"YOUR NEWLY CREATED FOLDER: {path}");

            //checks if an gridImage is inserted in the creation of the new house
            if (gridImage != null && gridImage.Length > 0)
            {
                try
                {
                    //add the gridimage to the new folder by creating the path and copies to stream
                    string filePath = Path.Combine(path, gridImage.FileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        gridImage.CopyTo(stream);
                        _logger.LogInformation($"Image {filePath} copied to stream");
                    }

                }
                catch (Exception e)
                {
                    //Handeling of errors
                    _logger.LogError("Error while trying to save image: " + e.Message);
                }
            }
        }
        //if houses´ folder already excists
        else
        {
            //True if a new gridImage is chosen
            if (gridImage != null && gridImage.Length > 0)
            {
                try
                {
                    //add the gridimage to the new folder by creating the path and copies to stream
                    string filePath = Path.Combine(path, gridImage.FileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        gridImage.CopyTo(stream);
                        _logger.LogInformation($"Image {filePath} copied to stream");
                    }

                }
                catch (Exception e)
                {
                    //Handeling of errors
                    _logger.LogError("Error while trying to save image: " + e.Message);
                }
            }
        }

    }

    public void UploadImages(List<IFormFile> imageFiles, string address)
    {
        //only true if one or more images are inserted
        if (imageFiles != null && imageFiles.Count > 0)
        {
            //string-builder for path to the right directory
            string curdir = System.IO.Directory.GetCurrentDirectory();
            string subpath = curdir + "/wwwroot/images/";
            string folderpath = System.IO.Path.Combine(subpath, address);

            //loops through each image in the inserted image-list
            foreach (var imageFile in imageFiles)
            {
                //stringbuilder for each unique image
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                string filePath = Path.Combine(folderpath, uniqueFileName);

                //copies each image to stream
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                    _logger.LogInformation("Image added to folder");
                }
            }
        }
        //True if no images are provided
        else
        {
            _logger.LogInformation("No further images chosen");
        }
    }
}
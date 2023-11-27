using System.Net;
using Microsoft.AspNetCore.Mvc;
using WebApplicationAngular.DAL;
using WebApplicationAngular.Models;

namespace WebApplicationAngular.Controllers;

[ApiController]
[Route("api/[controller]")]

public class HouseController : Controller
{

    private readonly IHouseRepository _houseRepository;
    private readonly ILogger<HouseController> _logger;
    private readonly HouseDbContext _db;

    public HouseController(IHouseRepository houseRepository, ILogger<HouseController> logger, HouseDbContext db)
    {
        _houseRepository = houseRepository;
        _logger = logger;
        _db = db;
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



    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] House house)
    {
        if (house == null)
        {
            return BadRequest("Invalid house data");
        }

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
        House houseToDelete = await _houseRepository.GetHouseById(id);
        bool returnOk = await _houseRepository.Delete(id);
        var houseAddress = houseToDelete.Address;
        _logger.LogError("Husadressen da: ", houseAddress);

        //string-builder for path to the right directory
        string curdir = System.IO.Directory.GetCurrentDirectory();
        string subpath = curdir + "/ClientApp/src/assets/images/";
        string delPath = System.IO.Path.Combine(subpath, houseAddress);

        if (!returnOk)
        {
            _logger.LogError("[HouseController] House deletion failed for the HouseId {HouseId:0000}", id);
            return BadRequest("House deletion failed");
        }

        if (Directory.Exists(delPath))
        {
            Directory.Delete(delPath, true);
        }

        var response = new { success = true, message = "House " + id.ToString() + " deleted successfully" };
        return Ok(response);
    }

    //Find a user with the corresponding email
    [HttpGet("showId/{email}")]
    public int ShowUserId(string email)
    {
        //Retreive user from database
        var user = _db.User.FirstOrDefault(u => u.Email == email);

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

    //Find all houses that was created by a specific user
    [HttpGet("listings/{email}")]
    public List<House> GetHousesByUserId(string email)
    {
        int id = ShowUserId(email);

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

    /*
           [HttpPost("createDir")]
           public Task<IActionResult> CreateDir([FromForm] IFormFile gridImg, [FromForm] string address)
           {
               string curdir = System.IO.Directory.GetCurrentDirectory();
               string subpath = curdir + "/ClientApp/src/assets/images/";
               string path = System.IO.Path.Combine(subpath, address);

               Directory.CreateDirectory(path);
               _logger.LogInformation($"YOUR NEWLY CREATED FOLDER: {path}");

               string filePath = Path.Combine(path, gridImg.FileName);

               using (var stream = new FileStream(filePath, FileMode.Create))
               {
                   gridImg.CopyTo(stream);
                   _logger.LogInformation($"Image {filePath} copied to stream");
               }

               var response = new { success = true, message = "Directory created successfully" };
               return Task.FromResult<IActionResult>(Ok(response));
           }
       */

    //function for creating imagefolder for each house and adds gridImage to the folder.
    //Takes the houses´ address and gridImage as arguments
    [HttpPost("createDirGridImg")]
    public Task<IActionResult> CreateDirGridImg([FromForm] IFormFile gridImg, [FromForm] string address)
    {
        //string-builder for path to the right directory
        string curdir = System.IO.Directory.GetCurrentDirectory();
        string subpath = curdir + "/ClientApp/src/assets/images/";
        string path = System.IO.Path.Combine(subpath, address);

        // Creates new folder if it doesnt exist. Only true when creating new house
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
            _logger.LogInformation($"YOUR NEWLY CREATED FOLDER: {path}");

            //checks if an gridImage is inserted in the creation of the new house
            if (gridImg != null && gridImg.Length > 0)
            {
                try
                {
                    //add the gridimage to the new folder by creating the path and copies to stream
                    string filePath = Path.Combine(path, gridImg.FileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        gridImg.CopyTo(stream);
                        _logger.LogInformation($"Image {filePath} copied to stream");
                    }

                }
                catch (Exception e)
                {
                    //Handeling of errors
                    _logger.LogError("Error while trying to save image: " + e.Message);
                }
            }
            var responsetrue = new { success = true, message = "Directory created successfully" };
            return Task.FromResult<IActionResult>(Ok(responsetrue));
        }
        //if houses´ folder already excists
        else
        {
            //True if a new gridImage is chosen
            if (gridImg != null && gridImg.Length > 0)
            {
                try
                {
                    //add the gridimage to the new folder by creating the path and copies to stream
                    string filePath = Path.Combine(path, gridImg.FileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        gridImg.CopyTo(stream);
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
        var response = new { success = true, message = "Directory already exist" };
        return Task.FromResult<IActionResult>(Ok(response));
    }

    [HttpPost("uploadImg")]
    public void UploadImages([FromForm] List<IFormFile> imageFiles, [FromForm] string address)
    {
        //only true if one or more images are inserted
        if (imageFiles != null && imageFiles.Count > 0)
        {
            //string-builder for path to the right directory
            string curdir = System.IO.Directory.GetCurrentDirectory();
            string subpath = curdir + "/ClientApp/src/assets/images/";
            string folderpath = System.IO.Path.Combine(subpath, address);

            if (!Directory.Exists(folderpath))
            {
                Directory.CreateDirectory(folderpath);
                _logger.LogInformation($"YOUR NEWLY CREATED FOLDER: {folderpath}");
            }

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

    [HttpGet("getImages")]
    public IActionResult GetImages([FromQuery] string address)
    {
        int imgCount;
        string[] images;
        string curdir = System.IO.Directory.GetCurrentDirectory();
        string subpath = curdir + "/ClientApp/src/assets/images/";
        string folderpath = System.IO.Path.Combine(subpath, address);
        try
        {
            if (!Directory.Exists(folderpath))
            {
                _logger.LogError("Finner ikke mappen!!");
                imgCount = 0;
                images = new string[0];
                return Ok(new { ImgCount = imgCount, Images = images });
            }


            images = System.IO.Directory.GetFiles(folderpath);
            imgCount = images.Length;

            for (int i = 0; i < images.Length; i++)
            {
                // Split stien ved directory-separatoren ("/" eller "\") og behold de tre siste delene
                string[] pathParts = images[i].Split(Path.DirectorySeparatorChar);
                if (pathParts.Length >= 4)
                {
                    images[i] = string.Join(Path.DirectorySeparatorChar.ToString(), pathParts[^4..]);
                }
            }

            _logger.LogWarning("Sjekker antall filer for: ", address);
            _logger.LogWarning("Antall filer: ", imgCount);
            return Ok(new { ImgCount = imgCount, Images = images });
        }
        catch (Exception e)
        {
            _logger.LogError($"Feil i sjekk av antall filer: {e.Message}");
            return StatusCode(500, "Something went wrong :0");
        }
    }
}
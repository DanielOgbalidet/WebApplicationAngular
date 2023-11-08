using Microsoft.EntityFrameworkCore;
using WebApplicationAngular.Models;

namespace WebApplicationAngular.DAL;

public class HouseRepository : IHouseRepository
{

    private readonly HouseDbContext _db;
    private readonly ILogger<HouseRepository> _logger;


    //Constructor to initialize the db database and logger for logging errors
    public HouseRepository(HouseDbContext db, ILogger<HouseRepository> logger)
    {
        _db = db;
        _logger = logger;
    }



    //Retrieves/brings out all houses from the database 
    public async Task<IEnumerable<House>> GetAll()
    {
        return await _db.Houses.ToListAsync();
    }


    //Retrives a house by it's id
    public async Task<House?> GetHouseById(int id)
    {
        return await _db.Houses.FindAsync(id);
    }


    //A new house is created and then added and saved to the database
    public async Task<bool> Create(House house)
    {
        try
        {
            _db.Houses.Add(house);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e) //Error handling if the house dosen't get created
        {
            _logger.LogError("[HouseRepository] creation failed for house {@house}, error message: {e}", house, e.Message);
            return false;
        }
    }



    //A house which is already in the database can get updated and saved with the new changes
    public async Task<bool> Update(House house)
    {
        try
        {
            _db.Houses.Update(house);
            await _db.SaveChangesAsync();
            return true;
        }

        //Error handling when an attempt of update fails
        catch (Exception e)
        {
            _logger.LogError("[HouseRepository] FindAsync(id) failed when updating the HouseId {HouseId:0000}, error message: {e}", house, e.Message);
            return false;
        }

    }


    //A house can get deleted from the database with it's specific id 
    public async Task<bool> Delete(int id)
    {
        try
        {
            var house = await _db.Houses.FindAsync(id); //Find the specific id of the house
            if (house == null)
            {
                _logger.LogError("[HouseRepository] house not found for the HouseId {HouseId:0000}", id);
                return false; //Returns false if a house with the specific id isn't found
            }


            //Successfully removes the house from the database and saves the changes
            _db.Houses.Remove(house);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e) //Error handling if deletion fails
        {
            _logger.LogError("[HouseRepository] house deletion failed for the HouseId {HouseId:0000}, error message: {e}", id, e.Message);
            return false;
        }
    }
}


using HotByte.DTOs;
using HotByte.Models;

namespace HotByte.Services.Interfaces
{
    public interface IRestaurantService
    {
        Task<IEnumerable<Restaurant>> GetAllAsync();

        Task<Restaurant?> GetByIdAsync(int id);
       

        Task<IEnumerable<MenuItemResponseDto>> GetMenuByRestaurantIdAsync(int restaurantId);
    }
}
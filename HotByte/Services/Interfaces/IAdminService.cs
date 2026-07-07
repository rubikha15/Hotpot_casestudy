using HotByte.DTOs;
using HotByte.Models;

namespace HotByte.Services.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<User>> GetUsersAsync();

        Task<IEnumerable<Restaurant>> GetRestaurantsAsync();

        Task<IEnumerable<Category>> GetCategoriesAsync();

        Task<DashboardDto> GetDashboardAsync();

        Task<decimal> GetRevenueAsync();
    }
}
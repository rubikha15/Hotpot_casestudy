using HotByte.DTOs;
using HotByte.Models;
using HotByte.Repositories.Interfaces;
using HotByte.Services.Interfaces;

namespace HotByte.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepo;
        private readonly IRestaurantRepository _restaurantRepo;
        private readonly ICategoryRepository _categoryRepo;
        private readonly IOrderRepository _orderRepo;

        public AdminService(
            IUserRepository userRepo,
            IRestaurantRepository restaurantRepo,
            ICategoryRepository categoryRepo,
            IOrderRepository orderRepo)
        {
            _userRepo = userRepo;
            _restaurantRepo = restaurantRepo;
            _categoryRepo = categoryRepo;
            _orderRepo = orderRepo;
        }

        public async Task<IEnumerable<User>>
            GetUsersAsync()
        {
            return await _userRepo.GetAllAsync();
        }

        public async Task<IEnumerable<Restaurant>>
            GetRestaurantsAsync()
        {
            return await _restaurantRepo.GetAllAsync();
        }

        public async Task<IEnumerable<Category>>
            GetCategoriesAsync()
        {
            return await _categoryRepo.GetAllAsync();
        }

        public async Task<decimal>
            GetRevenueAsync()
        {
            var orders =
                await _orderRepo.GetAllAsync();

            return orders.Sum(x => x.TotalAmount);
        }

        public async Task<DashboardDto>
            GetDashboardAsync()
        {
            var users =
                await _userRepo.GetAllAsync();

            var restaurants =
                await _restaurantRepo.GetAllAsync();

            var orders =
                await _orderRepo.GetAllAsync();

            return new DashboardDto
            {
                TotalUsers = users.Count(),
                TotalRestaurants =
                    restaurants.Count(),

                TotalOrders =
                    orders.Count(),

                TotalRevenue =
                    orders.Sum(x =>
                    x.TotalAmount)
            };
        }
    }
}
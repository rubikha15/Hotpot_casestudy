using NUnit.Framework;
using HotByte.Services.Implementations;
using HotByte.Repositories.Interfaces;
using Moq;
public class AdminServiceTests
{
    private AdminService _service;

    [SetUp]
    public void Setup()
    {
        var userRepo = new Mock<IUserRepository>();
        var restaurantRepo = new Mock<IRestaurantRepository>();
        var categoryRepo = new Mock<ICategoryRepository>();
        var orderRepo = new Mock<IOrderRepository>();

        userRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(new List<HotByte.Models.User>
            {
                new HotByte.Models.User { Id = 1, Name = "A" }
            });

        orderRepo.Setup(x => x.GetAllAsync())
            .ReturnsAsync(new List<HotByte.Models.Order>
            {
                new HotByte.Models.Order { TotalAmount = 100 }
            });

        _service = new AdminService(
            userRepo.Object,
            restaurantRepo.Object,
            categoryRepo.Object,
            orderRepo.Object
        );
    }

    [Test]
    public async Task GetDashboard_Should_Return_Data()
    {
        var result = await _service.GetDashboardAsync();

        Assert.That(result.TotalUsers, Is.EqualTo(1));
        Assert.That(result.TotalRevenue, Is.EqualTo(100));
    }
}
using HotByte.DTOs;
using HotByte.Models;
using HotByte.Repositories.Interfaces;
using HotByte.Services.Implementations;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Timers;

namespace HotByte.Tests.Services
{
    [TestFixture]
    public class CartServiceTests
    {
        private Mock<ICartRepository> _cartRepo = null!;
        private Mock<IMenuRepository> _menuRepo = null!;
        private CartService _service = null!;

        [SetUp]
        public void Setup()
        {
            _cartRepo = new Mock<ICartRepository>();
            _menuRepo = new Mock<IMenuRepository>();

            _service = new CartService(_cartRepo.Object, _menuRepo.Object);
        }

        [Test]
        public async Task AddItem_Should_Add_Item_To_Cart()
        {
            int userId = 1;

            _cartRepo.Setup(x => x.GetCartByUserIdAsync(userId))
                     .ReturnsAsync(new Cart { CartId = 1, CartItems = new List<CartItem>() });

            _menuRepo.Setup(x => x.GetByIdAsync(1))
                     .ReturnsAsync(new MenuItem { MenuItemId = 1, Price = 100 });

            _cartRepo.Setup(x => x.AddCartItemAsync(It.IsAny<CartItem>()))
                     .Returns(Task.CompletedTask);

            var dto = new AddCartItemDto
            {
                MenuItemId = 1,
                Quantity = 2
            };

            await _service.AddItemAsync(userId, dto);

            _cartRepo.Verify(x => x.AddCartItemAsync(It.IsAny<CartItem>()), Times.Once);
        }
    }
}
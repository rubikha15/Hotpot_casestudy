using NUnit.Framework;
using Moq;
using Microsoft.Extensions.Logging;

using HotByte.DTOs;
using HotByte.Models;
using HotByte.Repositories.Interfaces;
using HotByte.Services.Implementations;

namespace HotByte.Tests.Services
{
    public class OrderServiceTests
    {
        private Mock<IOrderRepository> _orderRepo;
        private Mock<ICartRepository> _cartRepo;
        private Mock<ILogger<OrderService>> _logger;

        private OrderService _service;

        [SetUp]
        public void Setup()
        {
            _orderRepo =
                new Mock<IOrderRepository>();

            _cartRepo =
                new Mock<ICartRepository>();

            _logger =
                new Mock<ILogger<OrderService>>();

            _service = new OrderService(
                _orderRepo.Object,
                _cartRepo.Object,
                _logger.Object);
        }

        [Test]
        public async Task PlaceOrder_Should_Create_Order()
        {
            var cart = new Cart
            {
                UserId = 1,
                CartItems = new List<CartItem>
                {
                    new CartItem
                    {
                        MenuItemId = 1,
                        Quantity = 2,
                        Price = 100
                    }
                }
            };

            _cartRepo
                .Setup(x => x.GetCartByUserIdAsync(1))
                .ReturnsAsync(cart);

            await _service.PlaceOrderAsync(
                1,
                new PlaceOrderDto
                {
                    ShippingAddress = "Chennai",
                    PaymentMethod = "COD"
                });

            _orderRepo.Verify(
                x => x.AddOrderAsync(
                    It.IsAny<Order>()),
                Times.Once);

            _cartRepo.Verify(
                x => x.ClearCartAsync(1),
                Times.Once);
        }

        [Test]
        public void PlaceOrder_Should_Throw_When_Cart_Not_Found()
        {
            _cartRepo
                .Setup(x => x.GetCartByUserIdAsync(1))
                .ReturnsAsync((Cart?)null);

            Assert.ThrowsAsync<Exception>(
                async () =>
                await _service.PlaceOrderAsync(
                    1,
                    new PlaceOrderDto
                    {
                        ShippingAddress = "Chennai",
                        PaymentMethod = "COD"
                    }));
        }

        [Test]
        public void PlaceOrder_Should_Throw_When_Cart_Empty()
        {
            _cartRepo
                .Setup(x => x.GetCartByUserIdAsync(1))
                .ReturnsAsync(
                    new Cart
                    {
                        UserId = 1,
                        CartItems = new List<CartItem>()
                    });

            Assert.ThrowsAsync<Exception>(
                async () =>
                await _service.PlaceOrderAsync(
                    1,
                    new PlaceOrderDto
                    {
                        ShippingAddress = "Chennai",
                        PaymentMethod = "COD"
                    }));
        }
    }
}
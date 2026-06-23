using NUnit.Framework;
using HotByte.Services.Implementations;
using HotByte.Data;
using HotByte.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace HotByte.Tests
{
    [TestFixture]
    public class RestaurantServiceTests
    {
        private AppDbContext _context;
        private RestaurantService _service;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _service = new RestaurantService(_context);
        }

        // =========================
        // CREATE TEST
        // =========================
        [Test]
        public async Task Create_Should_Add_Restaurant()
        {
            var restaurant = new Restaurant
            {
                RestaurantName = "Test Resto",
                Location = "Chennai",
                ContactNumber = "9999999999",
                Email = "test@r.com"
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            var result = await _service.GetAllAsync();

            Assert.That(result.Count(), Is.EqualTo(1));
        }

        // =========================
        // GET ALL TEST
        // =========================
        [Test]
        public async Task GetAll_Should_Return_Restaurants()
        {
            _context.Restaurants.Add(new Restaurant
            {
                RestaurantName = "R1",
                Location = "Chennai",
                ContactNumber = "1111111111",
                Email = "r1@gmail.com"
            });

            await _context.SaveChangesAsync();

            var result = await _service.GetAllAsync();

            Assert.That(result.Any(), Is.True);
        }

        // =========================
        // GET BY ID TEST
        // =========================
        [Test]
        public async Task GetById_Should_Return_Restaurant()
        {
            var restaurant = new Restaurant
            {
                RestaurantName = "R2",
                Location = "Madurai",
                ContactNumber = "2222222222",
                Email = "r2@gmail.com"
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            var result = await _service.GetByIdAsync(restaurant.RestaurantId);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.RestaurantName, Is.EqualTo("R2"));
        }

        // =========================
        // UPDATE TEST
        // =========================
        [Test]
        public async Task Update_Should_Modify_Restaurant()
        {
            var restaurant = new Restaurant
            {
                RestaurantName = "Old Name",
                Location = "Chennai",
                ContactNumber = "3333333333",
                Email = "old@gmail.com"
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            restaurant.RestaurantName = "Updated Name";

            _context.Restaurants.Update(restaurant);
            await _context.SaveChangesAsync();

            var updated = await _service.GetByIdAsync(restaurant.RestaurantId);

            Assert.That(updated.RestaurantName, Is.EqualTo("Updated Name"));
        }

        // =========================
        // DELETE TEST
        // =========================
        [Test]
        public async Task Delete_Should_Remove_Restaurant()
        {
            var restaurant = new Restaurant
            {
                RestaurantName = "Delete Me",
                Location = "Chennai",
                ContactNumber = "4444444444",
                Email = "del@gmail.com"
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            _context.Restaurants.Remove(restaurant);
            await _context.SaveChangesAsync();

            var result = await _service.GetByIdAsync(restaurant.RestaurantId);

            Assert.That(result, Is.Null);
        }

        // =========================
        // CLEANUP
        // =========================
        [TearDown]
        public void TearDown()
        {
            _context?.Dispose();
        }
    }
}
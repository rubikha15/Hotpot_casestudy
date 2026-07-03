using NUnit.Framework;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;

using HotByte.Data;
using HotByte.DTOs;
using HotByte.Helpers;
using HotByte.Models;
using HotByte.Services.Implementations;

namespace HotByte.Tests.Services
{
    public class AuthServiceTests
    {
        private AppDbContext _context;
        private AuthService _service;

        [SetUp]
        public void Setup()
        {
            var options =
                new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);

            var configData = new Dictionary<string, string?>
            {
                {"Jwt:Key","ThisIsMyVeryStrongSecretKey123456"},
                {"Jwt:Issuer","HotByte"},
                {"Jwt:Audience","HotByteUsers"}
            };

            IConfiguration config =
                new ConfigurationBuilder()
                .AddInMemoryCollection(configData)
                .Build();

            var jwtHelper = new JwtHelper(config);

            var logger =
                new Mock<ILogger<AuthService>>();

            _service = new AuthService(
                _context,
                jwtHelper,
                logger.Object);
        }

        [TearDown]
        public void Cleanup()
        {
            _context.Dispose();
        }

        [Test]
        public async Task Register_Should_Add_User()
        {
            var dto = new RegisterUserDto
            {
                Name = "Rubika",
                Email = "rubika@test.com",
                Password = "123456",
                ContactNumber = "9876543210",
                Address = "Chennai",
                Gender = "Female",
                Role = "User"
            };

            var result =
                await _service.RegisterAsync(dto);

            Assert.That(
                result,
                Is.EqualTo("User registered successfully"));

            Assert.That(
                _context.Users.Count(),
                Is.EqualTo(1));
        }

        [Test]
        public async Task Login_Should_Return_Token()
        {
            await _service.RegisterAsync(
                new RegisterUserDto
                {
                    Name = "Test",
                    Email = "test@test.com",
                    Password = "123456",
                    ContactNumber = "9999999999",
                    Address = "Chennai",
                    Gender = "Male",
                    Role = "User"
                });

            var token =
                await _service.LoginAsync(
                    new LoginDto
                    {
                        Email = "test@test.com",
                        Password = "123456"
                    });

            Assert.That(token, Is.Not.Null);
            Assert.That(token.Length, Is.GreaterThan(0));
        }

        [Test]
        public async Task Login_Should_Return_Invalid_Credentials()
        {
            var result =
                await _service.LoginAsync(
                    new LoginDto
                    {
                        Email = "wrong@test.com",
                        Password = "123"
                    });

            Assert.That(
                result,
                Is.EqualTo("Invalid credentials"));
        }

        [Test]
        public async Task ForgotPassword_Should_Return_ResetToken()
        {
            await _service.RegisterAsync(
                new RegisterUserDto
                {
                    Name = "Test",
                    Email = "test@test.com",
                    Password = "123456",
                    ContactNumber = "9999999999",
                    Address = "Chennai",
                    Gender = "Male"
                });

            var result =
                await _service.ForgotPasswordAsync(
                    new ForgotPasswordDto
                    {
                        Email = "test@test.com"
                    });

            Assert.That(
                result.Contains("Reset token generated"),
                Is.True);
        }

        [Test]
        public async Task ResetPassword_Should_Succeed()
        {
            await _service.RegisterAsync(
                new RegisterUserDto
                {
                    Name = "Test",
                    Email = "test@test.com",
                    Password = "123456",
                    ContactNumber = "9999999999",
                    Address = "Chennai",
                    Gender = "Male"
                });

            var result =
                await _service.ResetPasswordAsync(
                    new ResetPasswordDto
                    {
                        Email = "test@test.com",
                        NewPassword = "newpass123"
                    });

            Assert.That(
                result,
                Is.EqualTo("Password reset successfully"));
        }
    }
}
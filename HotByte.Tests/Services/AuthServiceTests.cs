using NUnit.Framework;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;

using HotByte.Data;
using HotByte.DTOs;
using HotByte.Helpers;
using HotByte.Services.Implementations;
using HotByte.Services.Interfaces;

namespace HotByte.Tests.Services
{
    public class AuthServiceTests
    {
        private AppDbContext _context = null!;
        private AuthService _service = null!;
        private Mock<IEmailService> _emailServiceMock = null!;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);

            var configData = new Dictionary<string, string?>
            {
                { "Jwt:Key", "ThisIsMyVeryStrongSecretKey123456789" },
                { "Jwt:Issuer", "HotByte" },
                { "Jwt:Audience", "HotByteUsers" }
            };

            IConfiguration config = new ConfigurationBuilder()
                .AddInMemoryCollection(configData)
                .Build();

            var jwtHelper = new JwtHelper(config);
            var logger = new Mock<ILogger<AuthService>>();

            _emailServiceMock = new Mock<IEmailService>();
            _emailServiceMock
                .Setup(x => x.SendEmailAsync(
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            _service = new AuthService(
                _context,
                jwtHelper,
                logger.Object,
                _emailServiceMock.Object);
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

            var result = await _service.RegisterAsync(dto);

            Assert.That(result, Is.EqualTo("User registered successfully"));
            Assert.That(_context.Users.Count(), Is.EqualTo(1));
        }

        [Test]
        public async Task Login_Should_Return_Token()
        {
            await _service.RegisterAsync(new RegisterUserDto
            {
                Name = "Test",
                Email = "test@test.com",
                Password = "123456",
                ContactNumber = "9999999999",
                Address = "Chennai",
                Gender = "Male",
                Role = "User"
            });

            var token = await _service.LoginAsync(new LoginDto
            {
                Email = "test@test.com",
                Password = "123456"
            });

            Assert.That(token, Is.Not.Null);
            Assert.That(token, Is.Not.EqualTo("Invalid credentials"));
            Assert.That(token.Length, Is.GreaterThan(20));
        }

        [Test]
        public async Task Login_Should_Return_Invalid_Credentials()
        {
            var result = await _service.LoginAsync(new LoginDto
            {
                Email = "wrong@test.com",
                Password = "123"
            });

            Assert.That(result, Is.EqualTo("Invalid credentials"));
        }

        [Test]
        public async Task ForgotPassword_Should_Send_ResetToken_Email()
        {
            await _service.RegisterAsync(new RegisterUserDto
            {
                Name = "Test",
                Email = "test@test.com",
                Password = "123456",
                ContactNumber = "9999999999",
                Address = "Chennai",
                Gender = "Male",
                Role = "User"
            });

            var result = await _service.ForgotPasswordAsync(new ForgotPasswordDto
            {
                Email = "test@test.com"
            });

            Assert.That(
                result,
                Is.EqualTo("Reset token has been sent to your registered email."));

            var user = await _context.Users
                .FirstAsync(x => x.Email == "test@test.com");

            Assert.That(user.ResetToken, Is.Not.Null);
            Assert.That(user.ResetTokenExpiry, Is.Not.Null);

            _emailServiceMock.Verify(x =>
                x.SendEmailAsync(
                    "test@test.com",
                    It.IsAny<string>(),
                    It.Is<string>(body => body.Contains(user.ResetToken!))),
                Times.Once);
        }

        [Test]
        public async Task ForgotPassword_Should_Return_User_Not_Found()
        {
            var result = await _service.ForgotPasswordAsync(new ForgotPasswordDto
            {
                Email = "unknown@test.com"
            });

            Assert.That(result, Is.EqualTo("User not found"));
        }

        [Test]
        public async Task ResetPassword_Should_Succeed_With_Valid_Token()
        {
            await _service.RegisterAsync(new RegisterUserDto
            {
                Name = "Test",
                Email = "test@test.com",
                Password = "123456",
                ContactNumber = "9999999999",
                Address = "Chennai",
                Gender = "Male",
                Role = "User"
            });

            await _service.ForgotPasswordAsync(new ForgotPasswordDto
            {
                Email = "test@test.com"
            });

            var user = await _context.Users
                .FirstAsync(x => x.Email == "test@test.com");

            var result = await _service.ResetPasswordAsync(new ResetPasswordDto
            {
                Email = "test@test.com",
                Token = user.ResetToken!,
                NewPassword = "newpass123"
            });

            Assert.That(result, Is.EqualTo("Password reset successfully"));
        }

        [Test]
        public async Task ResetPassword_Should_Return_User_Not_Found()
        {
            var result = await _service.ResetPasswordAsync(new ResetPasswordDto
            {
                Email = "unknown@test.com",
                Token = "dummy-token",
                NewPassword = "newpass123"
            });

            Assert.That(result, Is.EqualTo("User not found"));
        }
    }
}
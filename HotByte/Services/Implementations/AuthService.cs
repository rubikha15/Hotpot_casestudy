using HotByte.Data;
using HotByte.DTOs;
using HotByte.Helpers;
using HotByte.Models;
using HotByte.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace HotByte.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwt;
        private readonly ILogger<AuthService> _logger;
        private readonly IEmailService _emailService;

        public AuthService(
            AppDbContext context,
            JwtHelper jwt,
            ILogger<AuthService> logger,
            IEmailService emailService)
        {
            _context = context;
            _jwt = jwt;
            _logger = logger;
            _emailService = emailService;
        }

        // ================= REGISTER =================

        public async Task<string> RegisterAsync(RegisterUserDto dto)
        {
            var exists = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (exists != null)
                return "User already exists";

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = HashPassword(dto.Password),
                ContactNumber = dto.ContactNumber,
                Address = dto.Address,
                Gender = dto.Gender,
                Role = string.IsNullOrEmpty(dto.Role) ? "User" : dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return "User registered successfully";
        }

        // ================= LOGIN =================

        public async Task<string> LoginAsync(LoginDto dto)
        {
            _logger.LogInformation("Login attempt for Email: {Email}", dto.Email);

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user != null && VerifyPassword(dto.Password, user.Password))
            {
                return _jwt.GenerateToken(
                    user.Id,
                    user.Email,
                    user.Role
                );
            }

            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.Email == dto.Email);

            if (restaurant != null && VerifyPassword(dto.Password, restaurant.Password))
            {
                return _jwt.GenerateToken(
                    restaurant.RestaurantId,
                    restaurant.Email,
                    "Restaurant",
                    restaurant.RestaurantId
                );
            }

            return "Invalid credentials";
        }

        // ================= FORGOT PASSWORD =================

        public async Task<string> ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
                return "User not found";

            var resetToken = Guid.NewGuid().ToString("N");

            user.ResetToken = resetToken;
            user.ResetTokenExpiry = DateTime.Now.AddMinutes(15);

            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                user.Email,
                "HotByte Password Reset",
$@"Hello {user.Name},

We received a request to reset your HotByte account password.

Your Reset Token:

{resetToken}

This token is valid for 15 minutes.

If you didn't request this, please ignore this email.

Regards,
HotByte Team");

            return "Reset token has been sent to your registered email.";
        }

        // ================= RESET PASSWORD =================

        public async Task<string> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
                return "User not found";

            if (user.ResetToken != dto.Token)
                return "Invalid reset token";

            if (user.ResetTokenExpiry == null ||
                user.ResetTokenExpiry < DateTime.Now)
                return "Reset token expired";

            if (string.IsNullOrWhiteSpace(dto.NewPassword))
                return "Password cannot be empty";

            user.Password = HashPassword(dto.NewPassword);

            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            return "Password reset successfully";
        }

        // ================= HASH PASSWORD =================

        private string HashPassword(string password)
        {
            return Convert.ToBase64String(
                SHA256.HashData(
                    Encoding.UTF8.GetBytes(password)));
        }

        private bool VerifyPassword(string input, string hashed)
        {
            return HashPassword(input) == hashed;
        }
    }
}
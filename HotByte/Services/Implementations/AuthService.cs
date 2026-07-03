using HotByte.Data;
using HotByte.DTOs;
using HotByte.Helpers;
using HotByte.Models;
using HotByte.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;

namespace HotByte.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwt;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            AppDbContext context,
            JwtHelper jwt,
            ILogger<AuthService> logger)
        {
            _context = context;
            _jwt = jwt;
            _logger = logger;
        }

        // ================= REGISTER =================
        public async Task<string> RegisterAsync(RegisterUserDto dto)
        {
            _logger.LogInformation(
                "Registration attempt for Email: {Email}",
                dto.Email);

            var exists = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (exists != null)
            {
                _logger.LogWarning(
                    "Registration failed. User already exists: {Email}",
                    dto.Email);

                return "User already exists";
            }

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = HashPassword(dto.Password),
                ContactNumber = dto.ContactNumber,
                Address = dto.Address,
                Gender = dto.Gender,
                Role = string.IsNullOrEmpty(dto.Role)
                    ? "User"
                    : dto.Role
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "User registered successfully: {Email}",
                dto.Email);

            return "User registered successfully";
        }

        // ================= LOGIN =================
        public async Task<string> LoginAsync(LoginDto dto)
        {
            _logger.LogInformation(
                "Login attempt for Email: {Email}",
                dto.Email);

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
            {
                _logger.LogWarning(
                    "Login failed. User not found: {Email}",
                    dto.Email);

                return "Invalid credentials";
            }

            if (!VerifyPassword(dto.Password, user.Password))
            {
                _logger.LogWarning(
                    "Login failed. Invalid password for Email: {Email}",
                    dto.Email);

                return "Invalid credentials";
            }

            var token = _jwt.GenerateToken(
                user.Email,
                user.Role);

            _logger.LogInformation(
                "Login successful: {Email}",
                dto.Email);

            return token;
        }

        // ================= FORGOT PASSWORD =================
        public async Task<string> ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            _logger.LogInformation(
                "Forgot password request received for Email: {Email}",
                dto.Email);

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
            {
                _logger.LogWarning(
                    "Forgot password failed. User not found: {Email}",
                    dto.Email);

                return "User not found";
            }

            var resetToken = Guid.NewGuid().ToString();

            user.Password = HashPassword(resetToken);

            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Reset token generated successfully for Email: {Email}",
                dto.Email);

            return $"Reset token generated: {resetToken}";
        }

        // ================= RESET PASSWORD =================
        public async Task<string> ResetPasswordAsync(ResetPasswordDto dto)
        {
            _logger.LogInformation(
                "Reset password request received for Email: {Email}",
                dto.Email);

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
            {
                _logger.LogWarning(
                    "Reset password failed. User not found: {Email}",
                    dto.Email);

                return "User not found";
            }

            if (string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                _logger.LogWarning(
                    "Reset password failed. Empty password provided for Email: {Email}",
                    dto.Email);

                return "Invalid password";
            }

            user.Password = HashPassword(dto.NewPassword);

            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Password reset successfully for Email: {Email}",
                dto.Email);

            return "Password reset successfully";
        }

        // ================= HASH =================
        private string HashPassword(string password)
        {
            return Convert.ToBase64String(
                SHA256.HashData(
                    Encoding.UTF8.GetBytes(password)));
        }

        private bool VerifyPassword(
            string input,
            string hashed)
        {
            return HashPassword(input) == hashed;
        }
    }
}
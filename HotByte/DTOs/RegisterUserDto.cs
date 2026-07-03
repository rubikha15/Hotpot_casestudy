namespace HotByte.DTOs
{
    public class RegisterUserDto
    {
        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string ContactNumber { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string Gender { get; set; } = string.Empty;

        public string Role { get; set; } = "User";
    }
}
using HotByte.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace HotByte.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var fromEmail = _config["EmailSettings:Email"]
                ?? throw new Exception("EmailSettings:Email is missing.");

            var password = _config["EmailSettings:Password"]
                ?? throw new Exception("EmailSettings:Password is missing.");

            var host = _config["EmailSettings:Host"]
                ?? throw new Exception("EmailSettings:Host is missing.");

            var portString = _config["EmailSettings:Port"]
                ?? throw new Exception("EmailSettings:Port is missing.");

            int port = int.Parse(portString);

            var email = new MimeMessage();

            email.From.Add(MailboxAddress.Parse(fromEmail));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            email.Body = new TextPart("plain")
            {
                Text = body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(fromEmail, password);

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);
        }
    }
}
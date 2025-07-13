namespace Football_3TL.Services.Email
{
    using MailKit.Net.Smtp;
    using MailKit.Security;
    using MimeKit;

    public class EmailService : IEmailService
    {
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("FootBall 3TL", "huynbaooo@gmail.com"));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = body;
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync("huynbaooo@gmail.com", "drterlotkkaxedvq");
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }

}

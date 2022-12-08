using ContactPro.Domain.Entities;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ContactPro.Domain.Services;

public class EmailService
{
    private readonly MailSettings _mailSettings;
    private readonly UtilityService _utilityService;

    public EmailService(IOptions<MailSettings> mailSettings, UtilityService utilityService)
    {
        _mailSettings = mailSettings.Value;
        _utilityService = utilityService;
    }

    public async Task SendEmailAsync(ICollection<Contact> contacts, string subject, string htmlMessage)
    {
        var mimeMessage = new MimeMessage();
        foreach(Contact contact in contacts) {
            mimeMessage.To.Add(MailboxAddress.Parse(contact.Email));
        }
        mimeMessage.Sender = MailboxAddress.Parse(_utilityService.GetCurrentUserEmail());
        mimeMessage.Subject = subject;

        var body = new BodyBuilder();
        body.HtmlBody = htmlMessage;
        mimeMessage.Body = body.ToMessageBody();

        using var smtp = new SmtpClient();
        smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
        smtp.Authenticate(_mailSettings.Email, _mailSettings.Password);
        await smtp.SendAsync(mimeMessage);
        smtp.Disconnect(true);
    }
}

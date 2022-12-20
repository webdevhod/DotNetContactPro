using System.Collections.Generic;
using System.Threading.Tasks;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ContactPro.Domain.Services;

public class MailService : IMailService
{
    private readonly ILogger<MailService> _log;
    private readonly MailSettings _mailSettings;
    private readonly EmailService _emailService;
    private readonly UtilityService _utilityService;

    public MailService(ILogger<MailService> log, IOptions<MailSettings> mailSettings, EmailService emailService, UtilityService utilityService)
    {
        _log = log;
        _mailSettings = mailSettings.Value;
        _emailService = emailService;
        _utilityService = utilityService;
    }

    public virtual async Task SendPasswordResetMail(User user)
    {
        string message = $"Dear {user.Login},<br><br>To reset your ContactPro password for account {user.Login}, please click on the URL:<br>{_utilityService.GetAbsoluteUri()}account/reset/finish/?key={user.ResetKey}<br><br>Regards,<br>ContactPro Team";
        await _emailService.SendEmailAsync(_mailSettings.Email, user.Email, "ContactPro password reset", message);

        _log.LogDebug($"Password reset email sent for User: {user}");
    }

    public virtual async Task SendActivationEmail(User user)
    {
        string message = $"Dear {user.Login},<br><br>Your ContactPro account {user.Login} has been created, please click on the URL below to activate it:<br>{_utilityService.GetAbsoluteUri()}account/activate?key={user.ActivationKey}<br><br>Regards,<br>ContactPro Team";
        await _emailService.SendEmailAsync(_mailSettings.Email, user.Email, "ContactPro account activation is required", message);

        _log.LogDebug($"Activation email sent for User: {user}");
    }

    public virtual async Task SendCreationEmail(User user)
    {
        string message = $"Dear {user.Login},<br><br>Your ContactPro account <strong>{user.Login}</strong> has been created.<br><br>Regards,<br>ContactPro Team";
        await _emailService.SendEmailAsync(_mailSettings.Email, user.Email, $"ContactPro account {user.Login} created", message);

        _log.LogDebug($"Creation email sent for User: {user}");
    }
}

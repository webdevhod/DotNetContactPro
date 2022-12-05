using ContactPro.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Security.Claims;

namespace ContactPro.Domain.Services
{
    public class UtilityService
    {
        private readonly UserManager<User> _userManager;
        private readonly ClaimsPrincipal User;
        private readonly string UserId;

        public UtilityService(UserManager<User> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            User = httpContextAccessor.HttpContext.User;
            UserId = _userManager.Users.Where(user => user.Login == GetCurrentUserName()).SingleOrDefault().Id;
        }

        public string GetCurrentUserId()
        {
            return UserId;
        }

        public string GetCurrentUserName()
        {
            return _userManager.GetUserName(User);
        }

        public DateTime GetNowInUtc()
        {
            return DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
        }
    }
}


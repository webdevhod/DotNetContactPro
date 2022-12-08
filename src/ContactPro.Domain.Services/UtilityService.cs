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
        private readonly User currentUser;
        private readonly string UserId;

        public UtilityService(UserManager<User> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            User = httpContextAccessor.HttpContext.User;
            currentUser = _userManager.Users.Where(user => user.Login == GetCurrentUserName()).SingleOrDefault();
            Console.WriteLine("currentUser");
            Console.WriteLine(currentUser);
        }

        public string GetCurrentUserEmail()
        {
            return currentUser.Email;
        }

        public string GetCurrentUserId()
        {
            return currentUser.Id;
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


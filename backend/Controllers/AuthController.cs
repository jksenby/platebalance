using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlateBalance.Api.Models;

namespace PlateBalance.Api.Controllers
{
    [ApiController]
    [Route("auth")]
    [Authorize]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();
            return Ok(new
            {
                user.Email,
                user.Id
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterRequestDto request,
            UserManager<User> userManager)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || 
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FirstName))
            {
                return BadRequest("All fields are required.");
            }
            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
            };

            var result = await userManager.CreateAsync(user, request.Password);

            if(!result.Succeeded) 
            {
                return BadRequest(result.Errors);
            }
            return Ok(new
            {
                userId = user.Id,
                Message = "User registered successfully!"
            });
        }
    }
}

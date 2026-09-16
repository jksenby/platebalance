using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlateBalance.Api.Models;

namespace PlateBalance.Api.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();
            return Ok(new
            {
                user.Email,
                user.Id,
                user.FirstName
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult<BaseResponse>> Logout()
        {
            try
            {
                await _signInManager.SignOutAsync();
                return Ok(new BaseResponse { Message = "User logged out successfully!", Success = true });
            } 
            catch
            {
                return BadRequest(new BaseResponse { Message = "Error logging out user.", Success = false });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponse>> Register(
            [FromBody] RegisterRequestDto request,
            UserManager<User> userManager)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || 
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FirstName))
            {
                return BadRequest(new RegisterResponse { Message = "All fields are required.", Success = false });
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
                return BadRequest(new RegisterResponse { Message = string.Join("; ", result.Errors.Select(e => e.Description)), Success = false });
            }
            return Ok(new RegisterResponse
            {
                UserId = user.Id,
                Message = "User registered successfully!",
                Success = true
            });
        }
    }
}

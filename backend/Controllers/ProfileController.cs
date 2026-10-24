using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlateBalance.Api.Models;

namespace PlateBalance.Api.Controllers
{
    [ApiController]
    [Route("profile")]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public ProfileController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [Authorize]
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteProfile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound(new BaseResponse{ Message = "User not found.", Success = false });
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new BaseResponse{ Message = "Failed to delete profile.", Success = false });
            }

            return Ok(new BaseResponse{ Message = "Profile deleted successfully.", Success = true });
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateDto model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound(new BaseResponse{ Message = "User not found.", Success = false });
            }

            user.Email = model.Email ?? user.Email;
            user.FirstName = model.FirstName ?? user.FirstName;
            user.DateOfBirth = model.DateOfBirth ?? user.DateOfBirth;
            user.Gender = model.Gender ?? user.Gender;
            user.Age = model.Age ?? user.Age;
            user.Weight = model.Weight ?? user.Weight;
            user.Height = model.Height ?? user.Height;
            user.PhysicalActivityFactor = model.PhysicalActivityFactor ?? user.PhysicalActivityFactor;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new BaseResponse{ Message = "Failed to update profile.", Success = false });
            }

            return Ok(new BaseResponse{ Message = "Profile updated successfully.", Success = true });
        }
    }
}

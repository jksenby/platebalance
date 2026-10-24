using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PlateBalance.Api.Models;

namespace PlateBalance.Api.Controllers
{
    [ApiController]
    [Route("nutrition")]
    public class NutritionCalculatorController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public NutritionCalculatorController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("calculate")]
        public async Task<IActionResult> CalculateNutrition()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound(new BaseResponse { Message = "User not found.", Success = false });
            }
            var dailyCalories = 0.0;
            if (user.Gender == Gender.Male)
            {
                dailyCalories = (user.Weight * 10) + (user.Height * 6.25) - (user.Age * 5) + 5 ?? 0.0;
            } else if (user.Gender == Gender.Female)
            {
                dailyCalories = (user.Weight * 10) + (user.Height * 6.25) - (user.Age * 5) - 161 ?? 0.0;
            }

            if(dailyCalories == 0.0)
            {
                return BadRequest(new BaseResponse { Message = "Invalid user data for nutrition calculation.", Success = false });
            }

            var bmr = dailyCalories;
            dailyCalories *= user.PhysicalActivityFactor ?? 1.375f;

            var protein = (dailyCalories * 0.3) / 4;
            var fat = (dailyCalories * 0.25) / 9;
            var carbs = (dailyCalories * 0.45) / 4;

            return Ok(new
            {
                Bmr = Math.Round(bmr, MidpointRounding.AwayFromZero),
                DailyCalories = Math.Round(dailyCalories, MidpointRounding.AwayFromZero),
                Protein = Math.Round(protein, MidpointRounding.AwayFromZero),
                Fat = Math.Round(fat, MidpointRounding.AwayFromZero),
                Carbs = Math.Round(carbs, MidpointRounding.AwayFromZero)
            });
        }
    }
}

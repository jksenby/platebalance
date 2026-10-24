using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace PlateBalance.Api.Models
{
    public class User: IdentityUser
    {
        [PersonalData]
        public string FirstName { get; set; } = string.Empty;
        [PersonalData]
        public DateOnly? DateOfBirth { get; set; }
        [PersonalData]
        public Gender? Gender { get; set; }
        [PersonalData]
        [Range(0, 120, ErrorMessage = "Age must be between 0 and 120.")]
        public int? Age { get; set; }
        [PersonalData]
        public float? Height { get; set; }
        [PersonalData]
        public float? Weight { get; set; }
        [PersonalData]
        public float? PhysicalActivityFactor { get; set; }
    }
}

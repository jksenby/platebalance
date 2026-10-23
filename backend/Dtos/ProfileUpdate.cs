using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

public record ProfileUpdateDto
(
   string? FirstName,
   string? Email,
   DateOnly? DateOfBirth,
   string? Gender,
   int? Age,
   float? Height,
   float? Weight
);
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Routing;
using System.Linq;

public class ApiPrefixConvention : IApplicationModelConvention
{
    private readonly AttributeRouteModel _routePrefix;

    public ApiPrefixConvention(string prefix)
    {
        // Define the prefix as a route model template
        _routePrefix = new AttributeRouteModel(new RouteAttribute(prefix));
    }

    public void Apply(ApplicationModel application)
    {
        foreach (var controller in application.Controllers)
        {
            foreach (var selector in controller.Selectors)
            {
                if (selector.AttributeRouteModel != null)
                {
                    // Combine the existing route (e.g., "[controller]") with our prefix
                    selector.AttributeRouteModel = AttributeRouteModel.CombineAttributeRouteModel(
                        _routePrefix,
                        selector.AttributeRouteModel
                    );
                }
                else
                {
                    // Fallback for controllers that don't specify a route attribute
                    selector.AttributeRouteModel = _routePrefix;
                }
            }
        }
    }
}
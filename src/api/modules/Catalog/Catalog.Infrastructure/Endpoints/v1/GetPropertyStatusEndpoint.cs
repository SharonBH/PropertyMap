using FSH.Framework.Infrastructure.Auth.Policy;
using FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Get.v1;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace FSH.Starter.WebApi.Catalog.Infrastructure.Endpoints.v1;
public static class GetPropertyStatusEndpoint
{
    internal static RouteHandlerBuilder MapGetPropertyStatusEndpoint(this IEndpointRouteBuilder endpoints)
    {
        return endpoints
            .MapGet("/propertystatuses/{id:guid}", async (Guid id, ISender mediator) =>
            {
                var response = await mediator.Send(new GetPropertyStatusRequest(id));
                return Results.Ok(response);
            })
            .WithName(nameof(GetPropertyStatusEndpoint))
            .WithSummary("Gets a PropertyStatus by ID")
            .WithDescription("Gets a PropertyStatus by ID")
            .Produces<PropertyStatusResponse>()
            .RequirePermission("Permissions.PropertyStatuses.View")
            .MapToApiVersion(1);
    }
}

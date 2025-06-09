using FSH.Framework.Infrastructure.Auth.Policy;
using FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Create.v1;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace FSH.Starter.WebApi.Catalog.Infrastructure.Endpoints.v1;
public static class CreatePropertyStatusEndpoint
{
    internal static RouteHandlerBuilder MapPropertyStatusCreationEndpoint(this IEndpointRouteBuilder endpoints)
    {
        return endpoints
            .MapPost("/propertystatuses", async (CreatePropertyStatusCommand request, ISender mediator) =>
            {
                var response = await mediator.Send(request);
                return Results.Ok(response);
            })
            .WithName(nameof(CreatePropertyStatusEndpoint))
            .WithSummary("Creates a PropertyStatus")
            .WithDescription("Creates a PropertyStatus")
            .Produces<CreatePropertyStatusResponse>()
            .RequirePermission("Permissions.PropertyStatuses.Create")
            .MapToApiVersion(1);
    }
}

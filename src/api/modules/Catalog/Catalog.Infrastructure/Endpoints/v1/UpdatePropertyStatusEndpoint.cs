using FSH.Framework.Infrastructure.Auth.Policy;
using FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Update.v1;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace FSH.Starter.WebApi.Catalog.Infrastructure.Endpoints.v1;
public static class UpdatePropertyStatusEndpoint
{
    internal static RouteHandlerBuilder MapPropertyStatusUpdateEndpoint(this IEndpointRouteBuilder endpoints)
    {
        return endpoints
            .MapPut("/propertystatuses/{id:guid}", async (Guid id, UpdatePropertyStatusCommand request, ISender mediator) =>
            {
                if (id != request.Id) return Results.BadRequest();
                var response = await mediator.Send(request);
                return Results.Ok(response);
            })
            .WithName(nameof(UpdatePropertyStatusEndpoint))
            .WithSummary("Updates a PropertyStatus")
            .WithDescription("Updates a PropertyStatus")
            .Produces<UpdatePropertyStatusResponse>()
            .RequirePermission("Permissions.PropertyStatuses.Update")
            .MapToApiVersion(1);
    }
}

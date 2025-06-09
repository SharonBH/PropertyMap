using FSH.Framework.Infrastructure.Auth.Policy;
using FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Delete.v1;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace FSH.Starter.WebApi.Catalog.Infrastructure.Endpoints.v1;
public static class DeletePropertyStatusEndpoint
{
    internal static RouteHandlerBuilder MapPropertyStatusDeleteEndpoint(this IEndpointRouteBuilder endpoints)
    {
        return endpoints
            .MapDelete("/propertystatuses/{id:guid}", async (Guid id, ISender mediator) =>
            {
                await mediator.Send(new DeletePropertyStatusCommand(id));
                return Results.NoContent();
            })
            .WithName(nameof(DeletePropertyStatusEndpoint))
            .WithSummary("Deletes a PropertyStatus by ID")
            .WithDescription("Deletes a PropertyStatus by ID")
            .Produces(StatusCodes.Status204NoContent)
            .RequirePermission("Permissions.PropertyStatuses.Delete")
            .MapToApiVersion(1);
    }
}

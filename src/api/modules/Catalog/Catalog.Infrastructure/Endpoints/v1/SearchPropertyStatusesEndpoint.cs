using FSH.Framework.Core.Paging;
using FSH.Framework.Infrastructure.Auth.Policy;
using FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Get.v1;
using FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Search.v1;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace FSH.Starter.WebApi.Catalog.Infrastructure.Endpoints.v1;
public static class SearchPropertyStatusesEndpoint
{
    internal static RouteHandlerBuilder MapSearchPropertyStatusesEndpoint(this IEndpointRouteBuilder endpoints)
    {
        return endpoints
            .MapPost("/propertystatuses/search", async (ISender mediator, [FromBody] SearchPropertyStatusCommand command) =>
            {
                var response = await mediator.Send(command);
                return Results.Ok(response);
            })
            .WithName(nameof(SearchPropertyStatusesEndpoint))
            .WithSummary("Searches PropertyStatuses with pagination and filtering")
            .WithDescription("Searches PropertyStatuses with pagination and filtering")
            .Produces<PagedList<PropertyStatusResponse>>()
            .RequirePermission("Permissions.PropertyStatuses.View")
            .MapToApiVersion(1);
    }
}

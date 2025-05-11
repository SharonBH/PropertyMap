using FSH.Framework.Core.Paging;
using FSH.Framework.Infrastructure.Auth.Policy;
using FSH.Starter.WebApi.Catalog.Application.Properties.Get.v1;
using FSH.Starter.WebApi.Catalog.Application.Properties.Search.v1;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace FSH.Starter.WebApi.Catalog.Infrastructure.Endpoints.v1;

public static class SearchPropertiesEndpoint
{
    internal static RouteHandlerBuilder MapGetPropertiesListEndpoint(this IEndpointRouteBuilder endpoints)
    {
        return endpoints
            .MapPost("/search", async (ISender mediator, [FromBody] SearchPropertiesCommand command) =>
            {
                var response = await mediator.Send(command);
                return Results.Ok(response);
            })
            .WithName(nameof(SearchPropertiesEndpoint))
            .WithSummary("Gets a list of Properties")
            .WithDescription("Gets a list of Properties with pagination and filtering support")
            .Produces<PagedList<PropertyResponse>>()
            .RequirePermission("Permissions.Properties.View")
            .MapToApiVersion(1);
    }
}


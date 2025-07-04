using MediatR;

namespace FSH.Starter.WebApi.Catalog.Application.Properties.Update.v1;

public sealed record UpdatePropertyCommand(
    Guid Id,
    string? Name,
    string? Description,
    Guid? NeighborhoodId,
    string? Address,
    decimal? AskingPrice,
    double? Size,
    int? Rooms,
    int? Bathrooms,
    Guid? PropertyTypeId,
    Guid? AgencyId,
    DateTime? ListedDate,
    DateTime? SoldDate,
    decimal? SoldPrice,
    string? FeatureList,
    Guid? PropertyStatusId,
    decimal? MarkerYaw,
    decimal? MarkerPitch,
    IReadOnlyList<UpdatePropertyImageDto>? Images) : IRequest<UpdatePropertyResponse>;

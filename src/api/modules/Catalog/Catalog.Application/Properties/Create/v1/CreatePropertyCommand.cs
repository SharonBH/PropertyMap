using MediatR;

namespace FSH.Starter.WebApi.Catalog.Application.Properties.Create.v1;

public sealed record CreatePropertyCommand(
    string Name,
    string Description,
    Guid NeighborhoodId,
    string Address,
    decimal AskingPrice,
    double Size,
    int Rooms,
    int Bathrooms,
    Guid PropertyTypeId,
    Guid AgencyId,
    DateTime ListedDate,
    string FeatureList,
    Guid PropertyStatusId,
    decimal MarkerYaw,
    decimal MarkerPitch) : IRequest<CreatePropertyResponse>;

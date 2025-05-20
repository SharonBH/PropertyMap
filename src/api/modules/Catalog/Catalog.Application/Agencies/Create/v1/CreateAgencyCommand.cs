using MediatR;

namespace FSH.Starter.WebApi.Catalog.Application.Agencies.Create.v1;

public sealed record CreateAgencyCommand(
    string Name,
    string Email,
    string Telephone,
    string Address,
    string Description,
    string LogoURL,
    string PrimaryColor,
    string AdditionalInfo) : IRequest<CreateAgencyResponse>;

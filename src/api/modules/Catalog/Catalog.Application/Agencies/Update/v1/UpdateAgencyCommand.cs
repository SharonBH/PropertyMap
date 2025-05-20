using MediatR;

namespace FSH.Starter.WebApi.Catalog.Application.Agencies.Update.v1;
public sealed record UpdateAgencyCommand(
    Guid Id,
    string? Name,
    string? Description = null,
    string? Email = null,
    string? Telephone = null,
    string? Address = null,
    string? LogoURL = null,
    string? PrimaryColor = null,
    string? AdditionalInfo = null) : IRequest<UpdateAgencyResponse>;

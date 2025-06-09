using MediatR;
using System;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Create.v1;
public class CreatePropertyStatusCommand : IRequest<CreatePropertyStatusResponse>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

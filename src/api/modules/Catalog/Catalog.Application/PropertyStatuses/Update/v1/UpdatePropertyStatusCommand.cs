using MediatR;
using System;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Update.v1;
public class UpdatePropertyStatusCommand : IRequest<UpdatePropertyStatusResponse>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

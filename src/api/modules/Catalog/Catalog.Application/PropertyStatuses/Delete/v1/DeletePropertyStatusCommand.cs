using MediatR;
using System;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Delete.v1;
public class DeletePropertyStatusCommand : IRequest
{
    public Guid Id { get; set; }
    public DeletePropertyStatusCommand(Guid id)
    {
        Id = id;
    }
}

using FSH.Framework.Core.Persistence;
using FSH.Starter.WebApi.Catalog.Domain;
using FSH.Starter.WebApi.Catalog.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Delete.v1;
public sealed class DeletePropertyStatusHandler(
    ILogger<DeletePropertyStatusHandler> logger,
    [FromKeyedServices("catalog:propertystatuses")] IRepository<PropertyStatus> repository)
    : IRequestHandler<DeletePropertyStatusCommand>
{
    public async Task Handle(DeletePropertyStatusCommand request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);
        var propertyStatus = await repository.GetByIdAsync(request.Id, cancellationToken);
        _ = propertyStatus ?? throw new PropertyStatusNotFoundException(request.Id);
        await repository.DeleteAsync(propertyStatus, cancellationToken);
        logger.LogInformation("PropertyStatus with id : {PropertyStatusId} deleted", propertyStatus.Id);
    }
}

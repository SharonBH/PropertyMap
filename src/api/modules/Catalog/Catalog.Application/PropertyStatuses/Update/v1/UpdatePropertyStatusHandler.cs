using FSH.Framework.Core.Persistence;
using FSH.Starter.WebApi.Catalog.Domain;
using FSH.Starter.WebApi.Catalog.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Update.v1;
public sealed class UpdatePropertyStatusHandler(
    ILogger<UpdatePropertyStatusHandler> logger,
    [FromKeyedServices("catalog:propertystatuses")] IRepository<PropertyStatus> repository)
    : IRequestHandler<UpdatePropertyStatusCommand, UpdatePropertyStatusResponse>
{
    public async Task<UpdatePropertyStatusResponse> Handle(UpdatePropertyStatusCommand request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);
        var propertyStatus = await repository.GetByIdAsync(request.Id, cancellationToken);
        _ = propertyStatus ?? throw new PropertyStatusNotFoundException(request.Id);
        var updatedPropertyStatus = propertyStatus.Update(request.Name, request.Description);
        await repository.UpdateAsync(updatedPropertyStatus, cancellationToken);
        logger.LogInformation("PropertyStatus with id : {PropertyStatusId} updated.", propertyStatus.Id);
        return new UpdatePropertyStatusResponse(propertyStatus.Id);
    }
}

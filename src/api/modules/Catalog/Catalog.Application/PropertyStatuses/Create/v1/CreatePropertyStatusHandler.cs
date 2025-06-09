using FSH.Framework.Core.Persistence;
using FSH.Starter.WebApi.Catalog.Domain;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace FSH.Starter.WebApi.Catalog.Application.PropertyStatuses.Create.v1;
public sealed class CreatePropertyStatusHandler(
    ILogger<CreatePropertyStatusHandler> logger,
    [FromKeyedServices("catalog:propertystatuses")] IRepository<PropertyStatus> repository)
    : IRequestHandler<CreatePropertyStatusCommand, CreatePropertyStatusResponse>
{
    public async Task<CreatePropertyStatusResponse> Handle(CreatePropertyStatusCommand request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);
        var propertyStatus = PropertyStatus.Create(request.Name!, request.Description);
        await repository.AddAsync(propertyStatus, cancellationToken);
        logger.LogInformation("propertyStatus created {PropertyStatusId}", propertyStatus.Id);
        return new CreatePropertyStatusResponse(propertyStatus.Id);
    }
}

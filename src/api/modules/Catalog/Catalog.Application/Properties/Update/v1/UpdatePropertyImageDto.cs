namespace FSH.Starter.WebApi.Catalog.Application.Properties.Update.v1;

public sealed record UpdatePropertyImageDto(
    Guid? Id,
    string ImageUrl,
    bool IsMain
);

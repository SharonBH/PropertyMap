namespace FSH.Starter.WebApi.Catalog.Application.Properties.Get.v1;

public sealed record PropertyImageResponse(
    Guid Id,
    string ImageUrl,
    bool IsMain
);

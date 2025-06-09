namespace FSH.Starter.WebApi.Catalog.Application.Properties.Get.v1;

public sealed record PropertyResponse(
    Guid Id,
    string Name,
    string Description,
    string Address,
    decimal AskingPrice,
    double Size,
    int Rooms,
    int Bathrooms,
    Guid NeighborhoodId,
    Guid PropertyTypeId,
    //string NeighborhoodName,
    //string PropertyTypeName,
    DateTime ListedDate,
    DateTime? SoldDate,
    decimal? SoldPrice,
    string FeatureList,
    //string PropertyStatusName,
    Guid PropertyStatusId,
    decimal MarkerYaw,
    decimal MarkerPitch);

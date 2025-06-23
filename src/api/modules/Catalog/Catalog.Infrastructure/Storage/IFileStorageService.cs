namespace FSH.Starter.WebApi.Catalog.Infrastructure.Storage;

public interface IFileStorageService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, string? subfolder = null, CancellationToken cancellationToken = default);
}

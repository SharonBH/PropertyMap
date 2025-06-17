using Microsoft.Extensions.Configuration;

namespace FSH.Starter.WebApi.Catalog.Infrastructure.Storage;

public class LocalFileStorageService : IFileStorageService
{
    private readonly string _basePath;
    private readonly string _publicUrlBase;

    public LocalFileStorageService(IConfiguration config)
    {
        // Save files to wwwroot/uploads by default, so they are served as static files
        _basePath = config["LocalStorage:Path"] ?? Path.Combine("wwwroot", "uploads");
        _publicUrlBase = config["LocalStorage:PublicUrlBase"] ?? "/uploads/";
        if (!Directory.Exists(_basePath))
            Directory.CreateDirectory(_basePath);
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var safeFileName = Path.GetRandomFileName() + Path.GetExtension(fileName);
        var filePath = Path.Combine(_basePath, safeFileName);
        using (var fs = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(fs, cancellationToken);
        }
        return _publicUrlBase.TrimEnd('/') + "/" + safeFileName;
    }
}

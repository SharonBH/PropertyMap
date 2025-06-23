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

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, string? subfolder = null, CancellationToken cancellationToken = default)
    {
        var safeFileName = Path.GetRandomFileName() + Path.GetExtension(fileName);
        string targetPath = _basePath;
        string publicUrlBase = _publicUrlBase;
        if (!string.IsNullOrWhiteSpace(subfolder))
        {
            targetPath = Path.Combine(_basePath, subfolder);
            publicUrlBase = _publicUrlBase.TrimEnd('/') + "/" + subfolder;
            if (!Directory.Exists(targetPath))
                Directory.CreateDirectory(targetPath);
        }
        var filePath = Path.Combine(targetPath, safeFileName);
        using (var fs = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(fs, cancellationToken);
        }
        return publicUrlBase.TrimEnd('/') + "/" + safeFileName;
    }
}

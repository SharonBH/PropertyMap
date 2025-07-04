import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";

import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

// Check if running in CI/CD environment (GitHub Actions, etc.)
const isCI = env.CI === 'true';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target: env.ASPNETCORE_HTTPS_PORT ? 
                  `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
                  env.ASPNETCORE_URLS ? 
                    env.ASPNETCORE_URLS.split(';')[0] : 
                    'https://localhost:32769',
                secure: false
            }
        },
        port: parseInt(env.DEV_SERVER_PORT || '57401'),
        // Only use HTTPS in development, not in CI
        https: isCI ? undefined : createHttpsConfig()
    }
});

/**
 * Creates HTTPS configuration for local development
 * Falls back to HTTP if certificates can't be created or used
 */
function createHttpsConfig() {
    try {
        // Option 1: Try to use existing dev certificates
        const baseFolder =
            env.APPDATA !== undefined && env.APPDATA !== ''
                ? `${env.APPDATA}/ASP.NET/https`
                : `${env.HOME}/.aspnet/https`;

        const certificateName = "prperty-map.client";
        const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
        const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

        // If certificates exist, try to use them
        if (fs.existsSync(certFilePath) && fs.existsSync(keyFilePath)) {
            try {
                return {
                    key: fs.readFileSync(keyFilePath),
                    cert: fs.readFileSync(certFilePath),
                };
            } catch (err) {
                console.warn('Error reading existing certificates, will try to create new ones:', err);
                // Fall through to certificate generation
            }
        } else {
            console.log('No certificates found, will try to create them...');
        }

        // Option 2: Try to generate certificates
        try {
            if (!fs.existsSync(baseFolder)) {
                fs.mkdirSync(baseFolder, { recursive: true });
            }

            console.log("Running dotnet dev-certs to generate HTTPS certificates...");
            const devCertsProcess = child_process.spawnSync('dotnet', [
                'dev-certs',
                'https',
                '--export-path',
                certFilePath,
                '--format',
                'Pem',
                '--no-password',
            ], { stdio: 'inherit' });

            if (devCertsProcess.status === 0) {
                console.log('Certificates generated successfully!');
                return {
                    key: fs.readFileSync(keyFilePath),
                    cert: fs.readFileSync(certFilePath),
                };
            } else {
                console.warn('Failed to generate certificates using dotnet dev-certs tool.');
            }
        } catch (err) {
            console.warn('Error running dotnet dev-certs tool:', err);
        }

        // Option 3: Fallback to HTTP for development
        console.log('Falling back to HTTP for development server.');
        return undefined;

    } catch (err) {
        console.error('Error setting up HTTPS:', err);
        return undefined;
    }
}

import {defineConfig} from 'orval';

export default defineConfig({
    homemap: {
        input: './server-api.json',
        output: {
            target: './src/api/homemapapi.ts',
            client: 'react-query',
            override: {
                mutator: {
                    path: './src/api/customAxiosClient.ts',
                    name: 'customInstance',
                },
            }
        },
    },
});
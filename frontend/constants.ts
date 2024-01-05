export const baseUrl = 'http://localhost:8000';


export function buildUrl(path: string): string {
    return `${baseUrl}${path}`;
}
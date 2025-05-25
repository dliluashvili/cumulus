export function extractParams(path: string): string[] {
    const paramRegex = /:(\w+)/g
    const params: string[] = []
    let match: any
    while ((match = paramRegex.exec(path)) !== null) {
        params.push(match[1])
    }
    return params
}

export function transformRoute(path: string): string {
    return path.replace(/:(\w+)/g, '{$1}')
}

export function generateRoutePathVariations(path: string): string[] {
    path = transformRoute(path)
    const normalizedPath = path.replace(/^\/+|\/+$/g, '')
    const paths = [`/${normalizedPath}`, normalizedPath, `/${normalizedPath}/`, `${normalizedPath}/`]
    return [...new Set(paths)].filter((p) => p !== '')
}

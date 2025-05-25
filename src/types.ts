export const ROUTE_METADATA_KEY = Symbol('route')
export const PARAM_METADATA_KEY = Symbol('param')
export const INJECTABLE_PROVIDERS_METADATA_KEY = Symbol('injectable')
export const INJECTABLE_CONTROLLER_METADATA_KEY = Symbol('controller')

export interface RequestedParamMetadata {
    name?: string
    all: boolean
    type: 'param'
    index: number
    from: 'route' | 'body' | 'query'
    pipe?: any
}

export interface Route {
    owner: string
    method: string
    httpMethod: string
    pathes: string[]
    params?: {
        keys: string[]
        requested: RequestedParamMetadata[]
    }
    basePath?: string
}

export type Routes = Array<Route>

export interface RouteMetadata {
    [key: string]: Route[]
}

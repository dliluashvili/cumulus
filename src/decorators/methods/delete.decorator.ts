import { generateRoutePathVariations, extractParams } from '../../utils'
import {
    PARAM_METADATA_KEY,
    ROUTE_METADATA_KEY,
    RequestedParamMetadata,
    RouteMetadata,
} from '../../types'

export function Delete(path: string) {
    return function (target: any, propertyKey: string) {
        const paramKeys = extractParams(path)

        const routes: RouteMetadata =
            Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || []

        if (!routes['DELETE']) {
            routes['DELETE'] = []
        }

        const paramMetadata: RequestedParamMetadata[] =
            Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey) || []

        routes['DELETE'].push({
            owner: target.constructor.name,
            method: propertyKey,
            httpMethod: 'DELETE',
            pathes: generateRoutePathVariations(path),
            params: {
                keys: paramKeys,
                requested: paramMetadata,
            },
        })

        Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, target.constructor)
    }
}

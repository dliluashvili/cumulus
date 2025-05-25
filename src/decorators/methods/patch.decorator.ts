import { generateRoutePathVariations, extractParams } from '../../utils'
import {
    PARAM_METADATA_KEY,
    ROUTE_METADATA_KEY,
    RequestedParamMetadata,
    RouteMetadata
} from '../../types'

export function Patch(path: string) {
    return function (target: any, propertyKey: string) {
        const paramKeys = extractParams(path)

        const routes: RouteMetadata =
            Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || []

        if (!routes['PATCH']) {
            routes['PATCH'] = []
        }

        const paramMetadata: RequestedParamMetadata[] =
            Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey) || []

        routes['PATCH'].push({
            owner: target.constructor.name,
            method: propertyKey,
            httpMethod: 'PATCH',
            pathes: generateRoutePathVariations(path),
            params: {
                keys: paramKeys,
                requested: paramMetadata,
            },
        })

        Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, target.constructor)
    }
}

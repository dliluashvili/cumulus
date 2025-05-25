import { PARAM_METADATA_KEY, RequestedParamMetadata } from 'types'

export function Body(paramName?: string): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol, index) {
        const requestedParams: RequestedParamMetadata[] =
            Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey) || []

        requestedParams.push({
            name: paramName || null,
            all: paramName ? false : true,
            type: 'param',
            from: 'body',
            index,
        })

        Reflect.defineMetadata(
            PARAM_METADATA_KEY,
            requestedParams,
            target,
            propertyKey
        )
    }
}

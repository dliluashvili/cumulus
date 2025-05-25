import { INJECTABLE_PROVIDERS_METADATA_KEY } from '../types'

export function Injectable() {
    return function (target: any) {
        const injectables: Set<string> =
            Reflect.getMetadata(INJECTABLE_PROVIDERS_METADATA_KEY, Reflect) || new Set()

        injectables.add(target.name)

        Reflect.defineMetadata(INJECTABLE_PROVIDERS_METADATA_KEY, injectables, Reflect)
    }
}

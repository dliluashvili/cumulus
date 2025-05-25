import { INJECTABLE_CONTROLLER_METADATA_KEY } from '../types'

export function Controller() {
    return function (target: any) {
        const injectableControllers: Set<string> =
            Reflect.getMetadata(INJECTABLE_CONTROLLER_METADATA_KEY, Reflect) ||
            new Set()

        injectableControllers.add(target.name)

        Reflect.defineMetadata(
            INJECTABLE_CONTROLLER_METADATA_KEY,
            injectableControllers,
            Reflect
        )
    }
}

import {
    INJECTABLE_PROVIDERS_METADATA_KEY,
    INJECTABLE_CONTROLLER_METADATA_KEY,
} from './types'

export type Providers = Map<string, any>
export type Conrtollers = Map<string, any>

export interface InitOptions {
    providers: Array<Function>
    controllers: Array<Function>
}

export class Container {
    private static instance: Container
    private providers: Providers = new Map<string, any>()
    private resolvedProviders = new Map<string, any>()

    init(options: InitOptions) {
        const { providers, controllers } = options

        const injectableProviders = this.getInjectableProviders()
        const injectableControllers = this.getInjectableControllers()

        if (controllers.length) {
            controllers.forEach((controller) => {
                if (!injectableControllers.has(controller.name)) {
                    throw new Error(
                        `Unable to register as a controller, ${controller.name} is not a injectable`
                    )
                }

                this.injectAsProvider(controller.name, controller, true)
            })
        }

        if (providers.length) {
            providers.forEach((provider) => {
                if (!injectableProviders.has(provider.name)) {
                    throw new Error(
                        `Unable to register as a provider, ${provider.name} is not a controller`
                    )
                }

                this.injectAsProvider(provider.name, provider)
            })
        }
    }

    injectAsProvider<T>(
        token: string,
        provider: Function,
        isController: boolean = false
    ) {
        this.providers.set(token, {
            target: provider,
            isController,
            dependencies:
                Reflect.getMetadata('design:paramtypes', provider) || [],
        })
    }

    static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container()
        }

        return Container.instance
    }

    getControllers() {
        return Array.from(this.providers.values()).filter(
            (provider) => provider.isController
        )
    }

    getInjectableProviders(): Set<string> {
        return (
            Reflect.getMetadata(INJECTABLE_PROVIDERS_METADATA_KEY, Reflect) ||
            new Set()
        )
    }

    getInjectableControllers(): Set<string> {
        return (
            Reflect.getMetadata(INJECTABLE_CONTROLLER_METADATA_KEY, Reflect) ||
            new Set()
        )
    }

    resolve<T>(token: string | Function): T {
        if (typeof token === 'function') {
            token = token.name
        }
        if (this.resolvedProviders.has(token)) {
            return this.resolvedProviders.get(token)
        }

        const provider = this.providers.get(token)

        if (!provider) {
            throw new Error(`No provider found for ${token}`)
        }

        const { target, dependencies } = provider

        const resolvedDependencies = dependencies.map((param: any) =>
            this.resolve(param.name)
        )

        const instance = new target(...resolvedDependencies)

        this.resolvedProviders.set(token, instance)

        return instance
    }
}

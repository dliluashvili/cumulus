import { Container } from './container'
import { Router } from './router'

enum METHOD_PARAMS {
    query = 'queryParams',
    body = 'body',
    route = 'parameters',
}

export class Application {
    private router: Router

    constructor(
        public readonly container: Container,
        public readonly eventObject: any
    ) {
        this.router = Router.createOrGetInstance(eventObject)
        this.router.scanRoutes(this.container)
    }

    start() {
        const controllers = this.container.getControllers()

        const args: unknown[] = []

        for (const controllerObj of controllers) {
            const controller = this.container.resolve(controllerObj.target)

            const requestedRoute = this.getRouter().findRoute(
                controllerObj.target.name
            )

            if (!requestedRoute) continue

            const requestedParams = requestedRoute.params.requested

            for (const requestedParam of requestedParams) {
                let value: unknown

                if (requestedParam.all) {
                    value =
                        this.eventObject[METHOD_PARAMS[requestedParam.from]] ||
                        {}
                } else if (requestedParam.name) {
                    value =
                        this.eventObject[METHOD_PARAMS[requestedParam.from]]?.[
                            requestedParam.name
                        ]
                }

                if (requestedParam.pipe && value !== undefined) {
                    value = requestedParam.pipe(value)
                }
                args[requestedParam.index] = value
            }

            return controller[requestedRoute.method](...args)
        }
    }

    setRouter(router: Router) {
        if (!Object.keys(router.routes).length) {
            router.scanRoutes(this.container)
        }

        this.router = router
    }

    getRouter() {
        return this.router
    }

    getRoutes() {
        if (this.router.routes.length) {
            return this.router.routes
        }

        return this.router.scanRoutes(this.container)
    }
}

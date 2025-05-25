import { Container } from './container'
import { Router } from './router'

enum METHOD_PARAMS {
    query = 'queryParams',
    body = 'body',
    route = 'parameters',
}

export class Application {
    public router: Router

    constructor(
        public readonly container: Container,
        public readonly eventObject: any
    ) {
        this.router = Router.createOrGetInstance(eventObject)
    }

    start() {
        const controllers = this.container.getControllers()

        const args: unknown[] = []

        for (const controllerObj of controllers) {
            const controller = this.container.resolve(controllerObj.target)

            const requestedRoute = this.container
                .getRouter()
                .findRoute(controllerObj.target.name)

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
}

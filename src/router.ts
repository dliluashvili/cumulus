import { ROUTE_METADATA_KEY, RouteMetadata, Routes } from './types'
import { Container } from './container'

export class Router {
    public static instance: Router

    routes: RouteMetadata = {}

    constructor(public readonly awsEvent: any) {}

    static createOrGetInstance(awsEvent?: any) {
        if (!Router.instance) {
            Router.instance = new Router(awsEvent)
        }

        return Router.instance
    }

    findByHttpMethod(): Routes {
        return this.routes[this.awsEvent.httpMethod]
    }

    findRoute(controllerName?: string) {
        const routesByHttpMethod = this.findByHttpMethod()

        const route = routesByHttpMethod.find(
            (r) =>
                r.pathes.includes(this.awsEvent.resource) &&
                r.params.keys.length ===
                    Object.keys(this.awsEvent.parameters).length
        )

        if (!route || (controllerName && controllerName !== route.owner)) {
            throw new Error('Not found')
        }

        return route
    }

    scanRoutes(container: Container) {
        const controllers = container.getControllers()
        
        for (const controller of controllers) {
            const controllerInstance = container.resolve(controller.target)
            const controllerPrototype =
                Object.getPrototypeOf(controllerInstance)
            const controllerClass = controllerPrototype.constructor
            const basePath =
                Reflect.getMetadata('basePath', controllerClass) || ''
            const _routes: RouteMetadata =
                Reflect.getMetadata(ROUTE_METADATA_KEY, controllerClass) || {}

            for (const httpMethod in _routes) {
                const routes = _routes[httpMethod]
                this.routes[httpMethod] = routes.map((route) => {
                    return {
                        ...route,
                        basePath,
                    }
                })
            }
        }

        return this.routes
    }
}

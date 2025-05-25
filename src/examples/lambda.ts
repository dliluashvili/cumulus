import * as Reflect from 'reflect-metadata'
import { Container } from '../container'
import { Router } from '../router'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { Application } from '../application'

export default () => {
    if (!Reflect) {
        throw new Error('Reflect wasnt imported')
    }
}

const awsEvent = {
    httpMethod: 'GET',
    resource: '/users/{id}',
    parameters: {
        id: '123',
    },
    body: {
        name: 'John Doe',
    },
    queryParams: {
        lang: 'en',
    },
}

const container = Container.getInstance()

container.init({
    controllers: [UserController],
    providers: [UserService],
})

const application = new Application(container, awsEvent)

const res = application.start()

console.log('res', res)

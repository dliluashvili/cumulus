import { Injectable } from '../decorators'

@Injectable()
export class UserService {
    getUsers() {
        return [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane One' },
        ]
    }

    getUser(id: string) {
        return { id, name: 'John Doe' }
    }
}

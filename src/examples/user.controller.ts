import { Get, Param, Controller, Query, Post, Body } from '../decorators'
import { UserService } from './user.service'

function toInt(val: string) {
    return parseInt(val)
}

function langPipe(val: string) {
    if (val === 'en') {
        return 'eng'
    }

    return val
}

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/users')
    getUsers() {
        return this.userService.getUsers()
    }

    @Get('/users/:id')
    getUser(
        @Param('id', toInt) id: string,
        @Query('lang', langPipe) lang: string
    ) {
        console.log('language', lang)
        const user = this.userService.getUser(id)

        return user
    }

    @Post('/users')
    create(@Body() body: any) {
        console.log('body', body)
    }
}

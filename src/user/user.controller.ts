import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { UpdateUserDTO } from './dto/updateUser.dto'
import { IDValidationPipe } from '../pipes/id.validation.pipes'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('id') id: string) {
		return this.userService.byId(id)
	}

	@Get(':id')
	@Auth('admin')
	async getUser(@Param('id', IDValidationPipe) id: string) {
		return this.userService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(@User('id') id: string, @Body() dto: UpdateUserDTO) {
		return this.userService.updateProfile(id, dto)
	}
	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateUser(
		@Param('id', IDValidationPipe) id: string,
		@Body() dto: UpdateUserDTO
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Get('count')
	@Auth('admin')
	async userCount() {
		return this.userService.getCount()
	}

	@Get()
	@Auth('admin')
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAll(searchTerm)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteUser(@Param('id', IDValidationPipe) id: string) {
		return this.userService.delete(id)
	}
}

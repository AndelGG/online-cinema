import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ActorService } from './actor.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { IDValidationPipe } from '../pipes/id.validation.pipes'
import { ActorDto } from './actor.dto'

@Controller('actors')
export class ActorController {
	constructor(private readonly ActorService: ActorService) {}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateActor(
		@Param('id', IDValidationPipe) id: string,
		@Body() dto: ActorDto
	) {
		return this.ActorService.updateActor(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('')
	@HttpCode(200)
	@Auth('admin')
	async createActor() {
		return this.ActorService.createActor()
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth()
	async deleteActor(@Param('id') id: string) {
		return this.ActorService.deleteActor(id)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.ActorService.bySlug(slug)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm: string) {
		return this.ActorService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id', IDValidationPipe) id: string) {
		return this.ActorService.byId(id)
	}
}

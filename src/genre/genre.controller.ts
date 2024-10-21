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
import { GenreService } from './genre.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { IDValidationPipe } from '../pipes/id.validation.pipes'
import { CreateGenreDto } from './dto/create-genre.dto'

@Controller('genres')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateGenre(
		@Param('id', IDValidationPipe) id: string,
		@Body() dto: CreateGenreDto
	) {
		return this.genreService.updateGenre(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('')
	@HttpCode(200)
	@Auth('admin')
	async createGenre() {
		return this.genreService.createGenre()
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth()
	async deleteGenre(@Param('id', IDValidationPipe) id: string) {
		return this.genreService.deleteGenre(id)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug', IDValidationPipe) slug: string) {
		return this.genreService.bySlug(slug)
	}

	@Get('collections')
	async getCollections() {
		return this.genreService.getCollections()
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm: string) {
		return this.genreService.getAll()
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id', IDValidationPipe) id: string) {
		return this.genreService.byId(id)
	}
}

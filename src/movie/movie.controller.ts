import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post, Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { MovieService } from './Movie.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { Types } from 'mongoose'
import { IDValidationPipe } from '../pipes/id.validation.pipes'
import { CreateMovieDto } from './dto/create-movie.dto'
import { GenresIdsDto } from './dto/genresIds.dto'

@Controller('movies')
export class MovieController {
	constructor(private readonly MovieService: MovieService) {}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateActor(
		@Param('id', IDValidationPipe) id: string,
		@Body() dto: CreateMovieDto,
	) {
		return this.MovieService.update(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('')
	@HttpCode(200)
	@Auth('admin')
	async createActor() {
		return this.MovieService.createMovie()
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteActor(@Param('id') id: string) {
		return this.MovieService.deleteMovie(id)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm: string) {
		return this.MovieService.getAll(searchTerm)
	}

	@Post('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.MovieService.updateCountOpened(slug)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth()
	async deleteMovie(@Param('id') id: string) {
		return this.MovieService.deleteMovie(id)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.MovieService.bySlug(slug)
	}

	@Get('by-actor/:actorId')
	async byActor(@Param('actorId') actorId: Types.ObjectId) {
		return this.MovieService.byActor(actorId)
	}

	@Post('by-genres')
	@HttpCode(200)
	async byGenres(@Body() dto: GenresIdsDto) {
		return this.MovieService.byGenres(dto.genresIds)
	}

	@Get('most-popular')
	async getMostPopular() {
		return this.MovieService.getMostPopular()
	}
}

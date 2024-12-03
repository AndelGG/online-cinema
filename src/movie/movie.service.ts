import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { MovieModel } from './movie.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateMovieDto } from './dto/create-movie.dto'
import { Types } from 'mongoose'
import { GenresIdsDto } from './dto/genresIds.dto'
import { ObjectId } from 'mongodb'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
	) {}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{ title: new RegExp(searchTerm, 'i') },
				],
			}

		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('actors genres')
			.exec()
	}

	async byId(id: string) {
		const Movie = this.MovieModel.findById(id)
		if (!Movie) throw new NotFoundException(`Movie with id ${id} not found`)
		return Movie
	}

	async byActor(actorId: Types.ObjectId) {
		const docs = await this.MovieModel.find({ actors: actorId }).exec()
		if (!docs) throw new NotFoundException('Movies not found')
		return docs
	}

	async bySlug(slug: string) {
		const docs = await this.MovieModel.findOne({ slug }).populate('actors genres').exec()
		if (!docs) throw new NotFoundException('Movie not found')
		return docs
	}

	async byGenres(genreIds: ObjectId[]) {
		const docs = await this.MovieModel.find({ genres: {$in: genreIds}}).exec()
		if (!docs) throw new NotFoundException('Movies not found')
		return docs
	}

	async updateCountOpened(slug: string) {
		const updateMovie = this.MovieModel.findByIdAndUpdate({slug}, {
			$inc: { countOpened: 1 },
		}, {new: true}).exec()

		if (!updateMovie)
			throw new NotFoundException(`Movie not found`)

		return updateMovie
	}

	async createMovie() {
		const defaultValue: CreateMovieDto = {
			actors: [], bigPoster: '', genres: [], poster: '', title: '', videoUrl: '',
			slug: ''
		}

		const Movie = await this.MovieModel.create(defaultValue)
		return Movie._id
	}

	async getMostPopular() {
		return  await this.MovieModel.find({ countOpened: {$gt: 0} }).sort({countOpened: -1}).populate('genres').exec()
	}

	async deleteMovie(id: string) {
		const deleteMovie = await this.MovieModel.findByIdAndDelete(id).exec()

		if (!deleteMovie)
			throw new NotFoundException(`Movie with id ${id} not found`)

		return deleteMovie
	}

	async update(id: string, dto: CreateMovieDto) {
		const updateDocs = this.MovieModel.findByIdAndUpdate(id, dto, {
			new: true,
		}).exec()
	if (!updateDocs) throw new NotFoundException(`Movie with id ${id} not found`)

		return updateDocs
	}
}



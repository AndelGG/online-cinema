import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GenreModel } from './genre.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGenreDto } from './dto/create-genre.dto'
import { MovieService } from '../movie/movie.service'
import { ICollection } from './genre.interface'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
		private readonly movieService: MovieService
	) {}

	async bySlug(slug: string) {
		const doc = await this.GenreModel.findOne({ slug }).exec()
		if (!doc) throw new NotFoundException('Genre not found')
		return doc
	}

	async byId(id: string) {
		return this.GenreModel.findById(id)
	}

	async updateGenre(id: string, dto: CreateGenreDto) {
		const updateGenre = this.GenreModel.findByIdAndUpdate(id, dto, {
			new: true,
		}).exec()

		if (!updateGenre)
			throw new NotFoundException(`Genre with id ${id} not found`)

		return updateGenre
	}

	async createGenre() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: '',
		}

		const genre = await this.GenreModel.create(defaultValue)
		return genre._id
	}

	async getCollections() {
		const genres = await this.getAll()
		return await Promise.all(
			genres.map(async (genre) => {
				const movieByGenre = await this.movieService.byGenres([genre._id])

				const result: ICollection = {
					_id: String(genre._id),
					image: movieByGenre[0].bigPoster,
					slug: genre.slug,
					title: genre.name,
				}

				return result
			})
		)
	}

	async deleteGenre(id: string) {
		const deleteGenre = await this.GenreModel.findByIdAndDelete(id).exec()

		if (!deleteGenre)
			throw new NotFoundException(`Genre with id ${id} not found`)

		return deleteGenre
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{ name: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') },
					{ description: new RegExp(searchTerm, 'i') },
				],
			}

		return this.GenreModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}
}

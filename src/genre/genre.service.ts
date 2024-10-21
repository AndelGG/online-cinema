import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GenreModel } from './genre.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGenreDto } from './dto/create-genre.dto'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
	) {}

	async bySlug(slug: string) {
		return await this.GenreModel.findOne({ slug }).exec()
	}

	async byId(id: string) {
		return this.GenreModel.findById(id)
	}

	async updateGenre(id: string, dto: CreateGenreDto) {
		return this.GenreModel.findByIdAndUpdate(id, dto, {
			new: true,
		}).exec()
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
		return await this.getAll()
	}

	async deleteGenre(id: string) {
		return await this.GenreModel.findByIdAndDelete(id).exec()
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

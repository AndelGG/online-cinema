import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ActorModel } from './actor.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ActorDto } from './actor.dto'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
	) {}

	async bySlug(slug: string) {
		const doc = await this.ActorModel.findOne({ slug }).exec()
		if (!doc) throw new NotFoundException('Actor not found')
		return doc
	}

	async byId(id: string) {
		const actor = this.ActorModel.findById(id)
		if (!actor) throw new NotFoundException(`Actor with id ${id} not found`)
		return actor
	}

	async updateActor(id: string, dto: ActorDto) {
		const updateActor = this.ActorModel.findByIdAndUpdate(id, dto, {
			new: true,
		}).exec()

		if (!updateActor)
			throw new NotFoundException(`Actor with id ${id} not found`)

		return updateActor
	}

	async createActor() {
		const defaultValue: ActorDto = {
			name: '',
			slug: '',
			photo: '',
		}

		const Actor = await this.ActorModel.create(defaultValue)
		return Actor._id
	}

	async deleteActor(id: string) {
		const deleteActor = await this.ActorModel.findByIdAndDelete(id).exec()

		if (!deleteActor)
			throw new NotFoundException(`Actor with id ${id} not found`)

		return deleteActor
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{ name: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') },
				],
			}

		return this.ActorModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateUserDTO } from './dto/updateUser.dto'
import { genSalt, hash } from 'bcryptjs'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
	) {}
	async byId(_id: string) {
		const user = await this.userModel.findById(_id)

		if (!user) throw new NotFoundException(`User with id ${_id} not found`)

		return user
	}

	async updateProfile(_id: string, dto: UpdateUserDTO) {
		const user = await this.byId(_id)
		const isSameUser = await this.userModel.findById({ email: dto.email })
		if (isSameUser && String(_id) !== String(isSameUser._id)) {
			throw new NotFoundException(`Email busy`)
		}
		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)

			user.email = dto.email

			if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin

			await user.save()
			return
		}
	}

	async getCount() {
		this.userModel.find().count().exec()
	}

	async delete(id: string) {
		return await this.userModel.findByIdAndDelete(id).exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [{ email: new RegExp(searchTerm, 'i') }],
			}

		return this.userModel
			.find(options)
			.select('-password -updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.exec()
	}
}

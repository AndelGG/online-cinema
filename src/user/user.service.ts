import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
	) {}
	async byId(_id: number): Promise<UserModel> {
		const user = await this.userModel.findById(_id)

		if (!user) throw new NotFoundException(`User with id ${_id} not found`)

		return user
	}
}

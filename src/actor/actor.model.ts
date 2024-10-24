import { prop } from '@typegoose/typegoose'

export class ActorModel {
	@prop({ unique: true })
	slug: string

	@prop()
	name: string

	@prop()
	photo: string
}

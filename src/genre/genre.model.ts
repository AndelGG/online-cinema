import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

export class GenreModel extends TimeStamps implements Base {
	@prop()
	name: string;

	@prop({ unique: true })
	slug: string;

	@prop()
	description: string;

	@prop()
	icon: string;

	_id!: ObjectId;
	id!: string;
}

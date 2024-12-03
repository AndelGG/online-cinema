import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop, Ref } from '@typegoose/typegoose'
import { MovieModel } from '../movie/movie.model'
import { ObjectId } from 'mongodb'


export class UserModel extends TimeStamps implements Base {
  id: string
  _id: ObjectId

  @prop()
  email: string
  @prop()
  password: string
  @prop({default: false})
  isAdmin: boolean
  @prop({default: [], ref: () => MovieModel})
  favorites?: Ref<MovieModel>[]
}

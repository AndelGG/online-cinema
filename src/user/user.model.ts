import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop } from '@typegoose/typegoose'

export interface UserModel extends Base {}

export class UserModel extends TimeStamps{
  @prop()
  email: string
  @prop()
  password: string
  @prop({default: false})
  isAdmin: boolean
  @prop({default: []})
  favorites?: []
}
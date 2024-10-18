import { createParamDecorator } from '@nestjs/common'
import { UserModel } from '../user.model'

type TypeData = keyof UserModel

export const User = createParamDecorator((data: TypeData, ctx) => {
	const request = ctx.switchToHttp().getRequest()
	const user = request.user
	return data ? user[data] : user
})

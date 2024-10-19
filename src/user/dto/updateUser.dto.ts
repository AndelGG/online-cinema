import { IsEmail } from 'class-validator'

export class UpdateUserDTO {
	@IsEmail()
	email: string
	password?: string
	isAdmin?: boolean
}

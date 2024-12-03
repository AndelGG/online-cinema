import { Module } from '@nestjs/common'
import { GenreService } from './genre.service'
import { GenreController } from './genre.controller'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { GenreModel } from './genre.model'
import { MovieModule } from '../movie/movie.module'

@Module({
	imports: [
		ConfigModule,
		TypegooseModule.forFeature([
			{
				typegooseClass: GenreModel,
				schemaOptions: {
					collection: 'Genre',
				},
			},
		]), MovieModule
	],
	providers: [GenreService],
	controllers: [GenreController],
})
export class GenreModule {}

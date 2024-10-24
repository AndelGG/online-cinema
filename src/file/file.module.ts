import { Module } from '@nestjs/common'
import { FileService } from './file.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { FileController } from './file.controller'
import { path } from 'app-root-path'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}`,
			serveRoot: '/uploads',
		}),
	],
	providers: [FileService],
	controllers: [FileController],
})
export class FileModule {}

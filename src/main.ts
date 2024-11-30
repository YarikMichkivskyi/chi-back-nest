import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Demo API')
        .setDescription('API description')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'access-token',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(configService.get<number>('PORT'));
    // console.log(process.env);
}

bootstrap();

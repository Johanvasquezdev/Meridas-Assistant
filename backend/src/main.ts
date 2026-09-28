import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('[MERIDAS] Starting backend application bootstrap...');
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );
  const config = app.get(ConfigService);

  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'development' ? false : undefined,
  }));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = config.get<number>('PORT') ?? 3001;
  await app.listen(port);
  console.log(`[MERIDAS] Backend server successfully listening on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('[MERIDAS FATAL BOOTSTRAP ERROR]:', err);
  process.exit(1);
});

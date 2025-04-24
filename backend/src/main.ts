import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import connectDB from './config/db';

async function bootstrap() {
  await connectDB();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error('Error during bootstrap:', err));

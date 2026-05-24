import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { validationPipe } from './common/pipes/validation.pipe';
import { EventsService } from './events/events.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(validationPipe);

  const port = process.env.PORT || 7777;
  await app.listen(port);
  console.log(`Pixler API running at http://localhost:${port}`);

  const eventsService = app.get(EventsService);
  eventsService.emitAppEvent({
    type: 'pixler.boot',
    version: '0.0.1',
    timestamp: Date.now(),
  });
}

bootstrap();

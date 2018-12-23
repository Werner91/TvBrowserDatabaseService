import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServerSettings} from './constants/server.constants';
import { Logger } from '@nestjs/common';
import { UpdateService } from './update/update.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Logger.log('Server is running at ' + ServerSettings.HOSTNAME + ":" + ServerSettings.HOSTPORT, 'Bootstrap');
  await app.listen(ServerSettings.HOSTPORT);
  
  const updateService = app.get<UpdateService>(UpdateService);
  await updateService.runUpdate();
}
bootstrap();
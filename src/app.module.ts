import { Module } from '@nestjs/common';
import { PlaceModule } from './place/place.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlaceService } from './place/place.service';

@Module({
  imports: [PlaceModule, PrismaModule],
  controllers: [],
  providers: []
})
export class AppModule {}

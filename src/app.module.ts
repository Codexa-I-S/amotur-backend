import { Module } from '@nestjs/common';
import { PlaceModule } from './place/place.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlaceService } from './place/place.service';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PlaceModule, PrismaModule, UserModule, UploadModule],
  controllers: [],
  providers: []
})
export class AppModule {}

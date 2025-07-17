import { Module } from '@nestjs/common';
import { PlaceModule } from './place/place.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlaceService } from './place/place.service';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true})
    ,PlaceModule, PrismaModule, AuthModule, UploadModule, UserModule, DashboardModule],
  controllers: [],
  providers: []
})
export class AppModule {}

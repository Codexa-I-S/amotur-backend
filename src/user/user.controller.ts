import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    findAll() {
        return this.userService.findAll()
   }
   
   @ApiBearerAuth()
   @Get(':id')
   findOne (@Param('id') id: string) {
        return this.userService.findOne(id)
   }

   @ApiBearerAuth()
   @Put(':id')
   update(@Param('id') id: string, @Body() data: UpdateUserDto) {
      return this.userService.update(id, data)
   }

   @ApiBearerAuth()
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.userService.remove(id)
   }

} 

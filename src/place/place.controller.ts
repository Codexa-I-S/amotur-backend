import { Controller, Get, Query } from '@nestjs/common';
import { PlaceService } from './place.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('place')
export class PlaceController {

    constructor(private placeService: PlaceService){}

    @Get('all')
    findAll(){
        return this.placeService.findAll()
    }

    @Get()
    findAllfromTyoe(@Query('type') type?: string){
        if(type){
            return this.placeService.findAllFromType(type)
        }
    }
}

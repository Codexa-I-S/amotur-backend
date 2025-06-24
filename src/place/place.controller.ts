import { Controller, Get, Query } from '@nestjs/common';
import { PlaceService } from './place.service';

@Controller('place')
export class PlaceController {

    constructor(private placeService: PlaceService){}

    @Get()
    findAll(@Query('type') type: string){
        if(type){
            return this.placeService.findAllFromType(type)
        }
        return this.placeService.findAll()
    }
}

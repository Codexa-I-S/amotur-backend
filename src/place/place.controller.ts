import { Controller, Get } from '@nestjs/common';
import { PlaceService } from './place.service';

@Controller('place')
export class PlaceController {

    constructor(private placeService: PlaceService){}

    @Get()
    findAll(){
        return this.placeService.findAll()
    }
}

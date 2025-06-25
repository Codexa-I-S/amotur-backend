import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PlaceService } from './place.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { createplaceDto } from './place.dto';

@Controller('place')
export class PlaceController {

    constructor(private placeService: PlaceService){}

    @Post()
    crete(@Body() data: createplaceDto) {
        return this.placeService.create(data)
    }

    @Get('all')
    @ApiOperation({summary: 'Listar Todos os locais'})
    @ApiResponse({status:200, description: "Lista de locais retornada com sucesso!!"})
    findAll(){
        return this.placeService.findAll()
    }

    @Get()
    @ApiOperation({summary: 'Listar Todos os locais por tipo'})
    @ApiQuery({name:'type',type:String, description:'Tipo '})
    @ApiResponse({status:200,description: 'Listar locais pelo o tipo retornada com sucesso!!'})
    findAllfromTyoe(@Query('type') type?: string){
        if(type){
            return this.placeService.findAllFromType(type)
        }
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data:any) {
        return this.placeService.update(id, data)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.placeService.remove(id)
    }
}



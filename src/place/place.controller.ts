import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { PlaceService } from './place.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { createplaceDto, updateplaceDto } from './place.dto';

@Controller('place')
export class PlaceController {

    constructor(private placeService: PlaceService){}
    
    @Post()
    @ApiOperation({summary: 'Cria um local'})
    @ApiResponse({status:201, description: "Local criado com sucesso!!"})
    @ApiResponse({status:400, description: "Dados inválidos"})
    @ApiBody({type:createplaceDto})
    @HttpCode(HttpStatus.CREATED)
    crete(@Body() data: createplaceDto) {
        try {
            return this.placeService.create(data)
        } catch (error) {
            throw new HttpException('Dados inválidos', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('all')
    @ApiOperation({summary: 'Listar Todos os locais'})
    @ApiResponse({status:200, description: "Lista de locais retornada com sucesso!!"})
    @HttpCode(HttpStatus.OK)
    findAll(){
        return this.placeService.findAll()
    }

    @Get()
    @ApiOperation({summary: 'Listar Todos os locais por tipo'})
    @ApiQuery({name:'type',type:String, description:'Tipo do local',example:"hotel,restaurante"})
    @ApiResponse({status:200,description: 'Listar locais pelo o tipo retornada com sucesso!!'})
    @ApiResponse({status:400, description: "Dados inválidos"})
    @HttpCode(HttpStatus.OK)

    findAllfromTyoe(@Query('type') type?: string){
        if(type){
            return this.placeService.findAllFromType(type)
        }else{
            throw  new HttpException('type inválidos', HttpStatus.BAD_REQUEST);
        }
    }

    @Put('id=:id')
    @ApiOperation({summary: 'Atualiza um local'})
    @ApiResponse({status:201, description: "Local atualizado com sucesso!!"})
    @ApiResponse({status:400, description: "Dados inválidos"})
    @ApiBody({type:updateplaceDto})
    @ApiParam({ name: 'id', type: String, description: 'Id do local',example:"4f4e7edf-2c82-4a43-ab47-d49ed9d0cb0a" })
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: string, @Body() data:updateplaceDto) {
        try {
            return this.placeService.update(id, data)
        } catch (error) {
            new HttpException('Dados inválidos', HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('id=:id')
    @ApiOperation({summary: 'Deleta um local'})
    @ApiResponse({status:200, description: "Local deletado com sucesso!!"})
    @ApiResponse({status:404, description: "Registro não encontrado"})
    @ApiParam({ name: 'id', type: String, description: 'Id do local',example:"4f4e7edf-2c82-4a43-ab47-d49ed9d0cb0a" })
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id: string) {
        try {
            return this.placeService.remove(id)
        } catch (error) {
            return new HttpException('Registro não encontrado', HttpStatus.NOT_FOUND);
        }
    }
}



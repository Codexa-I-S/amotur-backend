import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseInterceptors, UseGuards } from '@nestjs/common';
import { PlaceService } from './place.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { UploadService } from 'src/upload/upload.service';
import { diskStorage } from 'multer';
import { createplaceDto, updateplaceDto } from './place.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@ApiBearerAuth()
@Controller('place')
export class PlaceController {

    constructor(private placeService: PlaceService, private uploadService: UploadService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard,AdminGuard)
    @Post()
    @ApiOperation({ summary: 'Cria um local' })
    @ApiResponse({ status: 201, description: "Local criado com sucesso!!" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 409, description: 'Coordenadas já cadastradas.' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Cria um local',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'luar Do Sertão' },
                localization: { type: 'string', example: 'amontada' },
                type: { type: 'string', example: 'Pousada' },
                description: { type: 'string', example: 'A melhor pousada' },
                coordinates: { type: 'string', example: { "lat": 1236363, "lng": -4253674 } },
                contacts: { type: 'string', example: { "telefone": "(88)9458484247", "email": "luardosertao@gamil.com", "site": "www.luardoSertao.com" } },
                logo: { type: 'string', format: 'binary' },
                photos: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    })
    @UseInterceptors(
        AnyFilesInterceptor({
            storage: diskStorage({
                filename: (req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, unique + extname(file.originalname));
                },
            }),
            limits: {
                fileSize: 500 * 1024, // 500kb
            },
        }),
    )
    async createPlace(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: any,) {
        try {
            const logoFile = files.find((file) => file.fieldname === 'logo');
            const photoFiles = files.filter((file) => file.fieldname === 'photos');
            // Aqui você pode fazer o upload (ex: Cloudinary) e salvar no banco
            if (!logoFile) {
                throw new BadRequestException('Logo é obrigatória');
            }
            const logoUrl = await this.uploadService.uploadImage(logoFile.path);
            if (!logoUrl) {
                throw new BadRequestException('Logo é obrigatória');
            }
            const uploadedImages = await Promise.all(photoFiles.map(f => this.uploadService.uploadImage(f.path)));
            const photoUrls = uploadedImages.filter((url): url is string => !!url);
            const parsedBody = {
            ...body,
            coordinates: JSON.parse(body.coordinates),
            contacts: JSON.parse(body.contacts),
            logo: logoUrl,
            images: photoUrls,
            };

            const dto = plainToInstance(createplaceDto, parsedBody);
            const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

            if (errors.length > 0) {
            console.error(errors);
            throw new BadRequestException('Dados inválidos: ' + JSON.stringify(errors));
            }            
            return this.placeService.create(dto)
        } catch (error) {
            throw new HttpException('Dados inválidos', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('all')
    @ApiOperation({ summary: 'Listar Todos os locais' })
    @ApiResponse({ status: 200, description: "Lista de locais retornada com sucesso!!" })
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.placeService.findAll()
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('id=:id')
    @ApiOperation({ summary: 'Lista um local por id' })
    @ApiResponse({ status: 200, description: "Local encotrado com sucesso!!" })
    @ApiResponse({ status: 404, description: "Local não encontrado" })
    @ApiParam({ name: 'id', type: String, description: 'Id do local', example: "4f4e7edf-2c82-4a43-ab47-d49ed9d0cb0a" })
    @HttpCode(HttpStatus.OK)
    findFromId(@Param('id') id: string) {
        return this.placeService.findById(id)
    }

    @Get()
    @ApiOperation({ summary: 'Listar Todos os locais por tipo' })
    @ApiQuery({ name: 'type', type: String, description: 'Tipo do local', example: "hotel,restaurante" })
    @ApiResponse({ status: 200, description: 'Listar locais pelo o tipo retornada com sucesso!!' })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @HttpCode(HttpStatus.OK)

    findAllfromTyoe(@Query('type') type?: string) {
        if (type) {
            return this.placeService.findAllFromType(type)
        } else {
            throw new HttpException('type inválidos', HttpStatus.BAD_REQUEST);
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard,AdminGuard)
    @Put('id=:id')
    @ApiOperation({ summary: 'Atualiza um local' })
    @ApiResponse({ status: 200, description: 'Local atualizado com sucesso!' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 409, description: 'Coordenadas já cadastradas.' })
    @ApiParam({ name: 'id', type: String, description: 'Id do local', example: "4f4e7edf-2c82-4a43-ab47-d49ed9d0cb0a" })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Atualiza um local',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'luar Do Sertão' },
                type: { type: 'string', example: 'Pousada' },
                description: { type: 'string', example: 'A melhor pousada' },
                coordinates: {
                    type: 'string',
                    example: '{"lat":1236363,"lng":-4253674}',
                },
                contacts: {
                    type: 'string',
                    example: '{"telefone":"(88)9458484247","email":"luardosertao@gmail.com","site":"www.luardoSertao.com"}',
                },
                logo: { type: 'string', format: 'binary' },
                photos: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    })
    @UseInterceptors(
        AnyFilesInterceptor({
            storage: diskStorage({
                filename: (req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, unique + extname(file.originalname));
                },
            }),
            limits: {
                fileSize: 500 * 1024, // 500kb
            },
        }),
    )
    async updatePlace(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: any,
    ) {
        try {
            const logoFile = files.find((file) => file.fieldname === 'logo');
            const photoFiles = files.filter((file) => file.fieldname === 'photos');

            let logoUrl: string | undefined;
            if (logoFile) {
                logoUrl = await this.uploadService.uploadImage(logoFile.path);
            }

            let photoUrls: string[] | undefined;
            if (photoFiles.length > 0) {
                const uploadedImages = await Promise.all(
                    photoFiles.map((f) => this.uploadService.uploadImage(f.path)),
                );
                photoUrls = uploadedImages.filter((url): url is string => !!url);
            }
            const rawData = {
            ...body,
            ...(body.coordinates && { coordinates: JSON.parse(body.coordinates) }),
            ...(body.contacts && { contacts: JSON.parse(body.contacts) }),
            ...(logoUrl && { logo: logoUrl }),
            ...(photoUrls && photoUrls.length > 0 && { images: photoUrls }),
            };

            // Transforma em instância do DTO de update
            const dto = plainToInstance(updateplaceDto, rawData);

            // Valida apenas os campos presentes
            const errors = await validate(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: true, // <- ESSENCIAL para DTO parcial
            });

            if (errors.length > 0) {
            console.error(errors);
            throw new BadRequestException('Dados inválidos: ' + JSON.stringify(errors));
            }

            return this.placeService.update(id, dto);
        } catch (error) {
            throw new HttpException('Dados inválidos', HttpStatus.BAD_REQUEST);
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard,AdminGuard)
    @Delete('id=:id')
    @ApiOperation({ summary: 'Deleta um local' })
    @ApiResponse({ status: 200, description: "Local deletado com sucesso!!" })
    @ApiResponse({ status: 404, description: "Registro não encontrado" })
    @ApiParam({ name: 'id', type: String, description: 'Id do local', example: "4f4e7edf-2c82-4a43-ab47-d49ed9d0cb0a" })
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id: string) {
        try {
            return this.placeService.remove(id)
        } catch (error) {
            return new HttpException('Registro não encontrado', HttpStatus.NOT_FOUND);
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard,AdminGuard)
    @Get('page')
    @ApiOperation({ summary: 'Listar Todos os locais por paginação' })
    @ApiQuery({ name: 'page', type: Number, description: 'Numero da página', example: "1" })
    @ApiQuery({ name: 'limit', type: Number, description: 'limite por página', example: "10" })
    @ApiResponse({ status: 200, description: 'Listar locais por pagina com sucesso!!' })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @HttpCode(HttpStatus.OK)
    pagination(
        @Query('page') page = '1',
        @Query('limit') limit = '10',
    ) {
    return this.placeService.pagination(+page, +limit);
  }
}



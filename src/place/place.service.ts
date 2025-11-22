import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Place } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { createplaceDto, updateplaceDto } from './place.dto';

import { PlaceType } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';
import { ImageObject } from './types/image_object';


@Injectable()
export class PlaceService {

    constructor(
        private prisma: PrismaService,
        private cloudinary: UploadService

    ) { }

    async create(dto: createplaceDto): Promise<Place> {
        const { coordinates, contacts, ...rest } = dto;
        const { lat, lng } = coordinates
        const existingCoordinate = await this.prisma.place.findFirst({
            where: {
                coordinates: {
                    equals: { lat, lng }
                },
            },
        });
        if (existingCoordinate) {
            throw new ConflictException('Coordenadas já cadastradas.');
        }

        const data: Prisma.PlaceCreateInput = {
            ...dto,
            coordinates: {
                lat: coordinates.lat,
                lng: coordinates.lng,
            },
            ...(contacts && {
                contacts: {
                    ...(contacts.telefone && { telefone: contacts.telefone }),
                    ...(contacts.email && { email: contacts.email }),
                    ...(contacts.site && { site: contacts.site }),
                }
            }),
            logo: dto.logo as ImageObject,
            images: dto.images as ImageObject[]
        };
        return this.prisma.place.create({ data });
    }

    async findAll(): Promise<Place[]> {
        return this.prisma.place.findMany()
    }

    async findAllFromType(type: PlaceType[]): Promise<Place[]> {
        const types = type
        return this.prisma.place.findMany({
            where: {
                type: { in: types }
            }
        })
    }

    async findById(id: string): Promise<Place | null> {
        const foundPlace = await this.prisma.place.findUnique({ where: { id } })

        if (!foundPlace) {
            throw new NotFoundException(`Local com ID ${id} não encontrado!`)
        }

        return foundPlace
    }

    async update(id: string, dto: updateplaceDto): Promise<Place | null> {
        const foundId = await this.prisma.place.findUnique({ where: { id } })

        if (!foundId) {
            throw new NotFoundException(`Local com esse ID ${id} não encontrado!`)
        }

        const { coordinates, contacts,logo, images, ...rest } = dto;

        const cleanRest = Object.fromEntries(
            Object.entries(rest).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );

        let newImages : ImageObject[] | undefined;

        if(images && images.length>0){
            newImages = (images as ImageObject[]).length > 0 ? (images as ImageObject[]) : undefined;
            const oldImages = foundId.images as ImageObject[]
            await Promise.all(oldImages.map(
                (image) => this.cloudinary.deleteImage(image.public_id)
            ))
        }
        
        let newLogo : ImageObject | undefined 
        if(logo && logo.url){
            newLogo = (logo as ImageObject).url ? (logo as ImageObject) : undefined;
            const oldlogo = foundId.logo as ImageObject
            await this.cloudinary.deleteImage(oldlogo.public_id)
        }


        const data: Prisma.PlaceUpdateInput = {
            ...cleanRest,
            ...(coordinates && {
                coordinates: {
                    lat: coordinates.lat,
                    lng: coordinates.lng,
                },
            }),
            ...(contacts && {
                contacts: {
                    ...(contacts.telefone && { telefone: contacts.telefone }),
                    ...(contacts.email && { email: contacts.email }),
                    ...(contacts.site && { site: contacts.site }),
                },
            }),
        ...(newLogo && { logo: newLogo }),
        ...(newImages && { images: newImages }),
        };
        return await this.prisma.place.update({ where: { id }, data })
    }

    async remove(id: string): Promise<Place> {
        //verifica se existe o local
        const place = await this.prisma.place.findUnique({
            where: { id }
        })
        if (!place) throw new BadRequestException('Local não encontrado!')

        //apaga as imagens no cloudinary
        const images = place.images as ImageObject[]

        images.push(place.logo as ImageObject)
        
        await Promise.all(images.map(
            (image) => this.cloudinary.deleteImage(image.public_id)
        ))

        // apaga o local no banco de dados
        const result = await this.prisma.place.delete({
            where: { id }
        })

        return result
    }

    async pagination(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [items, total] = await this.prisma.$transaction([
            this.prisma.place.findMany({
                skip,
                take: limit,
                orderBy: {
                    name: 'asc',
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    localization: true
                }
            }),
            this.prisma.place.count(),
        ]);

        return {
            data: items,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }

}

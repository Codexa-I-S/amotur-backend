import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Place } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { createplaceDto, updateplaceDto } from './place.dto';


@Injectable()
export class PlaceService {

    constructor(private prisma: PrismaService){}

    async create(dto: createplaceDto): Promise<Place>{
         const { coordinates, contacts, ...rest } = dto;
        const data: Prisma.PlaceCreateInput = {
            ...dto,
            coordinates: {
            lat: coordinates.lat,
            lon: coordinates.lon,
            },
            ...(contacts && {
                contacts: {
                ...(contacts.telefone && { telefone: contacts.telefone }),
                ...(contacts.email && { email: contacts.email }),
                ...(contacts.site && { site: contacts.site }),
                }
            })
        };
  return this.prisma.place.create({ data });
    }

    async findAll(): Promise<Place[]> {
        return this.prisma.place.findMany()
    }

    async findAllFromType(type: string): Promise<Place[]> {
        const types = type.split(','); // Divide a string em um array
        return this.prisma.place.findMany({
            where: {
                type:{in:types}
            }
        }) 
    }

    async update(id: string, dto:updateplaceDto): Promise<Place | null> {
        const foundId = await this.prisma.place.findUnique({where:{id}})

        if(!foundId) {
            throw new NotFoundException(`Local com esse ID ${id} não encontrado!`)
        }
    const { coordinates, contacts, ...rest } = dto;

  const data: Prisma.PlaceUpdateInput = {
    ...rest,
    ...(coordinates && {
      coordinates: {
        lat: coordinates.lat,
        lon: coordinates.lon,
      },
    }),
    ...(contacts && {
      contacts: {
        ...(contacts.telefone && { telefone: contacts.telefone }),
        ...(contacts.email && { email: contacts.email }),
        ...(contacts.site && { site: contacts.site }),
      },
    }),
  };
        return await this.prisma.place.update({where: {id}, data})
    }

    async remove(id: string): Promise<Place | null> {
        try{
            return await this.prisma.place.delete({where:{id}})
        }catch {
            throw new NotFoundException(`Local com esse ID ${id} não encontrado!`)
        }
    }

}

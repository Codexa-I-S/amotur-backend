import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Place } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class PlaceService {

    constructor(private prisma: PrismaService){}

    async create(data: Prisma.PlaceCreateInput): Promise<Place>{
        return this.prisma.place.create({data})
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

    async update(id: string, data: Prisma.PlaceUpdateInput): Promise<Place | null> {
        const foundId = await this.prisma.place.findUnique({where:{id}})

        if(!foundId) {
            throw new NotFoundException(`Local com esse ID ${id} não encontrado!`)
        }

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

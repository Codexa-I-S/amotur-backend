import { Injectable } from '@nestjs/common';
import { Prisma, Place } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class PlaceService {

    constructor(private prisma: PrismaService){}

    async findAll(): Promise<Place[]> {
        return this.prisma.place.findMany()
    }

}

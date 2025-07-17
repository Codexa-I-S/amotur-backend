import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) {}

    async contarLugares(): Promise<number> {
        return this.prisma.place.count()
    }

    async contarUsers(): Promise<number> {
        return this.prisma.users.count()
    }

    async contarLocaisPorTipo() {
        const resultado = await this.prisma.place.groupBy({
            by: ['type'],
            _count: {
                _all: true
            },
            orderBy: {
                type: 'asc',
            },
        })

        return resultado.map(r => ({
            type: r.type,
            quantidade: r._count._all,
        }))
    }
}

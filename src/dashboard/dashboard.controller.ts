import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/admin.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}


    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    async quantidade(): Promise<{totalDeLugares: number, totalDeUsers: number, lugaresPorTipo:{ type: string; quantidade: number; }[], lugaresPorRegiao:{ location: string; quantidade: number; }[]}> {
        const totalDeLugares = await this.dashboardService.contarLugares()
        const totalDeUsers = await this.dashboardService.contarUsers()
        const lugaresPorTipo = await this.dashboardService.contarLocaisPorTipo()
        const lugaresPorRegiao = await this.dashboardService.contarLocaisPorRegiao()

        return {
            totalDeLugares: totalDeLugares,
            totalDeUsers: totalDeUsers,
            lugaresPorTipo: lugaresPorTipo,
            lugaresPorRegiao: lugaresPorRegiao
        }
    }
}

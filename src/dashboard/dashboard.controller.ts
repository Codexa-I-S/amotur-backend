import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    async quantidade(): Promise<{totalDeLugares: number, totalDeUsers: number, lugaresPorTipo:{ type: string; quantidade: number; }[] }> {
        const totalDeLugares = await this.dashboardService.contarLugares()
        const totalDeUsers = await this.dashboardService.contarUsers()
        const lugaresPorTipo = await this.dashboardService.contarLocaisPorTipo()

        return {
            totalDeLugares: totalDeLugares,
            totalDeUsers: totalDeUsers,
            lugaresPorTipo: lugaresPorTipo
        }
    }
}

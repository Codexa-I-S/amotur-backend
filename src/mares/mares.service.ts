import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ajuste o caminho conforme necessário
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class MaresService implements OnModuleInit {
  constructor(private prisma: PrismaService) { }

  async onModuleInit() {
    // Este método será chamado assim que o módulo for inicializado
    // Ideal para executar a importação automaticamente ao iniciar a aplicação
    console.log('MaresService inicializado. Iniciando importação de marés...');
    await this.importarMaresDoJson();
  }

  async importarMaresDoJson() {
    const jsonPath = path.join(__dirname, '..', '..', 'mares_todas.json'); // Caminho correto para o JSON
    try {
      const rawData = fs.readFileSync(jsonPath, 'utf-8');
      const maresData = JSON.parse(rawData);

      console.log(`Iniciando importação de ${maresData.length} dias de marés...`);

      for (const dia of maresData) {
        const { data, dados } = dia;

        for (const evento of dados) {
          const { hora, altura } = evento;

          try {
            await this.prisma.mare.upsert({
              where: {
                data_hora: { // Nome do índice único composto definido no schema.prisma
                  data: data,
                  hora: hora,
                },
              },
              update: {
                // Não precisamos atualizar nada se existir, pois hora/data/altura são a chave única
              },
              create: {
                data: data,
                hora: hora,
                altura: altura,
              },
            });
            // console.log(`Processado: ${data} ${hora} - ${altura}m`);
          } catch (e) {
            console.error(`Erro inesperado ao processar ${data} ${hora}:`, e.message);
          }
        }
      }
      console.log('\nImportação de marés concluída!');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(`Erro: Arquivo JSON '${jsonPath}' não encontrado.`);
      } else if (error instanceof SyntaxError) {
        console.error(`Erro: Arquivo JSON inválido '${jsonPath}'.`, error.message);
      } else {
        console.error('Erro durante a importação:', error);
      }
    }
  }
  async getMaresDeUmaData(data: string): Promise<{ data: string; dados: Array<{ hora: string; altura: number }> } | null> {

    const maresDoDia = await this.prisma.mare.findMany({
      where: {
        // Filtra por data. No Prisma, um campo DateTime @db.Date no schema
        // permite a comparação direta com um objeto Date.
        data
      },
      orderBy: {
        hora: 'asc', // Garante que as horas estejam em ordem
      },
    });

    if (maresDoDia.length === 0) {
      return null; // Nenhuma maré encontrada para esta data
    }

    // Formata os dados para corresponder ao formato do frontend
    return {
      data: data, // Usa a string da data original para a saída
      dados: maresDoDia.map(mare => ({
        hora: mare.hora,
        altura: mare.altura,
      })),
    };
  }
}

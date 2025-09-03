import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { EventoFoto } from "./eventos.fotos.entity";
import { EventosFotosService } from "./eventos.fotos.service";


@Controller('eventos-fotos')
export class EventosFotosController {
    constructor(private eventosFotosService: EventosFotosService) {}

// Rota para adicionar uma ou várias fotos
  @Post()
  async addFotoOuFotos(
    @Body() body: { eventoId: string; url?: string; urls?: string[] }
  ): Promise<EventoFoto | EventoFoto[]> {
    if (body.urls && body.urls.length > 0) {
      // Adiciona várias fotos
      return this.eventosFotosService.addFotos(body.eventoId, body.urls);
    }
    if (body.url) {
      // Adiciona uma única foto
      return this.eventosFotosService.addFoto(body.eventoId, body.url);
    }
    throw new Error('É necessário enviar pelo menos uma URL ou um array de URLs');
  }

    @Get()
    async findAll(): Promise<EventoFoto[]> {
        return this.eventosFotosService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<EventoFoto | null> {
        return this.eventosFotosService.findById(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string> {
        return this.eventosFotosService.delete(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: { url: string }): Promise<EventoFoto | null> {
        return this.eventosFotosService.updateFotos(id, body.url);
    }
}
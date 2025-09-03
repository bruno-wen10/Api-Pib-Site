import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { EventosVideosService } from "./eventos.videos.service";
import { EventoVideo } from "./eventos-videos.entity";

@Controller('eventos-videos')
export class EventosVideosController {
    constructor(private eventosVideosService: EventosVideosService) {}

    // Rota para adicionar um ou vários vídeos
    @Post()
    async addVideoOuVideos(
        @Body() body: { eventoId: string; url?: string; urls?: string[] }
    ): Promise<EventoVideo | EventoVideo[]> {
        if (body.urls && body.urls.length > 0) {
            return Promise.all(
                body.urls.map(url => this.eventosVideosService.addVideo(body.eventoId, url))
            );
        }
        if (body.url) {
            return this.eventosVideosService.addVideo(body.eventoId, body.url);
        }
        throw new Error('É necessário enviar pelo menos uma URL ou um array de URLs');
    }

    @Get()
    async findAll(): Promise<EventoVideo[]> {
        return this.eventosVideosService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<EventoVideo | null> {
        return this.eventosVideosService.findById(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string> {
        return this.eventosVideosService.delete(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: { url: string }): Promise<EventoVideo | null> {
        return this.eventosVideosService.updateVideo(id, body.url);
    }
}

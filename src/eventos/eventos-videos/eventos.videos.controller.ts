import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { EventosVideosService } from "./eventos.videos.service";
import { EventoVideo } from "./eventos-videos.entity";
import { FilesInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";

@Controller('eventos-videos')
export class EventosVideosController { 
    constructor(private eventosVideosService: EventosVideosService) {}

    // Rota para adicionar um ou vários vídeos
    @Post()
@UseInterceptors(FilesInterceptor('videos', 20, {
  storage: diskStorage({
    destination: '../../../files-uplouds/videos/uploads-videos-evento', // pasta irmã de src
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
}))

    async addVideoOuVideos(
        @Body() body: { eventoId: string },
        @UploadedFiles() files: Express.Multer.File[]
    ): Promise<EventoVideo | EventoVideo[]> {
        if(!body.eventoId) {
            throw new Error('Evento ID é necessário');
        }
        if(!files || files.length === 0) {
            throw new Error('É necessário enviar pelo menos um vídeo');
        }
        return this.eventosVideosService.addVideos(body.eventoId, files)
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

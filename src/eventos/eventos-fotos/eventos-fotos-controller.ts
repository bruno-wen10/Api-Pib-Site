import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { EventoFoto } from "./eventos.fotos.entity";
import { EventosFotosService } from "./eventos.fotos.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller('eventos-fotos')
export class EventosFotosController {
    constructor(private eventosFotosService: EventosFotosService) {}

// Rota para adicionar uma ou várias fotos
  @Post()
    @UseInterceptors(FilesInterceptor('fotos', 20, {
        storage: diskStorage({
            destination: '../../../files-uplouds/fotos/uploads-fotos-evento', // pasta irmã de src
            filename: (req, file, cb) => {
                // Gera um nome único para cada arquivo
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + extname(file.originalname));
            }
        })
    })) // 'fotos' é o nome do campo no form-data
    
    async addFotoOuFotos(
        @Body() body: { eventoId: string },
        @UploadedFiles() files: Express.Multer.File[]
    ): Promise<EventoFoto[]> {
        if (!body.eventoId) {
            throw new Error('O eventoId é obrigatório');
        }
        if (!files || files.length === 0) {
            throw new Error('É necessário enviar pelo menos uma foto');
        }
        // Salva as fotos recebidas via upload
        return this.eventosFotosService.addFotosFromFiles(body.eventoId, files);
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
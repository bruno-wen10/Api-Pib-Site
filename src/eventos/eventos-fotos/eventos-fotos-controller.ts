// eventos-fotos/eventos.fotos.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path"; // 1. Importe 'join' do módulo 'path'
import { EventoFoto } from "./eventos.fotos.entity";
import { EventosFotosService } from "./eventos.fotos.service";

@Controller('eventos-fotos')
export class EventosFotosController {
    constructor(private eventosFotosService: EventosFotosService) {}

    @Post()
    @UseInterceptors(FilesInterceptor('fotos', 20, {
        storage: diskStorage({
            // 2. Use path.join e process.cwd() para criar um caminho absoluto e seguro
            destination: join(process.cwd(), 'files-uploads', 'fotos', 'uploads-fotos-evento'),
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + extname(file.originalname));
            }
        })
    }))
    async addFotoOuFotos(
        @Body('eventoId', ParseUUIDPipe) eventoId: string, // 3. Extraia e valide o eventoId diretamente
        @UploadedFiles() files: Express.Multer.File[]
    ): Promise<EventoFoto[]> {
        if (!files || files.length === 0) {
            // 4. Use exceções HTTP padrão do NestJS
            throw new BadRequestException('É necessário enviar pelo menos uma foto');
        }
        
        return this.eventosFotosService.addFotosFromFiles(eventoId, files);
    }

    // --- Demais rotas (com validação de UUID adicionada) ---

    @Get()
    async findAll(): Promise<EventoFoto[]> {
        return this.eventosFotosService.findAll();
    }

    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<EventoFoto | null> {
        return this.eventosFotosService.findById(id);
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
        // Lembrete: Esta ação apaga apenas a referência no banco de dados.
        // O arquivo físico continua no servidor.
        return this.eventosFotosService.delete(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('url') url: string
    ): Promise<EventoFoto | null> {
        return this.eventosFotosService.updateFotos(id, url);
    }
}

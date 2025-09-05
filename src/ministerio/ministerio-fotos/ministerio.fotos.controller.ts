// ministerio-fotos/ministerio.fotos.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors, BadRequestException, ParseUUIDPipe } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path"; // 1. Importe 'join' do módulo 'path'
import { MinisterioFotosService } from "./ministerio.fotos.service";
import { MinisterioFotos } from "./ministerio.foto.intity";

// Não precisa desta linha, ela é para testes e não funciona como importação
// import {teste} from '../../../files-uplouds/fotos/uplaud-fotos-ministerios/b'

@Controller('ministerio-fotos')
export class MinisterioFotosController {
    constructor(private ministerioFotosService: MinisterioFotosService) {}

    @Post()
    @UseInterceptors(FilesInterceptor('fotos', 20, {
        storage: diskStorage({
            // 2. Use path.join e process.cwd() para criar um caminho absoluto e seguro
            destination: join(process.cwd(), 'files-uploads', 'fotos', 'uplaud-fotos-ministerios'),
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + extname(file.originalname));
            }
        })
    }))
    async addFotoOuFotos(
        @Body('ministerioId', ParseUUIDPipe) ministerioId: string, // 3. Use o decorador @Body para pegar um campo específico e valide-o
        @UploadedFiles() files: Express.Multer.File[]
    ): Promise<MinisterioFotos[]> {
        // A validação do ministerioId já é feita pelo ParseUUIDPipe
        
        if (!files || files.length === 0) {
            // 4. Use as exceções HTTP do NestJS para respostas de erro padronizadas
            throw new BadRequestException('É necessário enviar pelo menos uma foto');
        }
        
        return this.ministerioFotosService.addFotosFromFiles(ministerioId, files);
    }

    // ... o resto do seu controller está bom ...

    @Get()
    async findAll(): Promise<MinisterioFotos[]> {
        return this.ministerioFotosService.findAll();
    }

    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<MinisterioFotos | null> {
        return this.ministerioFotosService.findById(id);
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
        // Lembrete: Isso só apaga do banco. O arquivo físico permanece no servidor.
        return this.ministerioFotosService.delete(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body('url') url: string): Promise<MinisterioFotos | null> {
        return this.ministerioFotosService.updateFotos(id, url);
    }
}

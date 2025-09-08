import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors, BadRequestException, ParseUUIDPipe } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { MinisterioFotosService } from "./ministerio.fotos.service";
import { MinisterioFotos } from "./ministerio.foto.intity";
import { CreateMinisterioFotosDto } from "./dto-ministerio-fotos/create-ministerio-fotos.dto";

@Controller('ministerio-fotos')
export class MinisterioFotosController {
    constructor(private ministerioFotosService: MinisterioFotosService) {}

    @Post()
    @UseInterceptors(FilesInterceptor('fotos', 20, {
        storage: diskStorage({
            destination: join(process.cwd(), 'files-uploads', 'fotos', 'uplaud-fotos-ministerios'),
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + extname(file.originalname));
            }
        })
    }))
    async addFotoOuFotos(
        @Body() body: CreateMinisterioFotosDto, // ← Alterado para usar DTO
        @UploadedFiles() files: Express.Multer.File[]
    ): Promise<MinisterioFotos[]> {
        if (!files || files.length === 0) {
            throw new BadRequestException('É necessário enviar pelo menos uma foto');
        }
        
        return this.ministerioFotosService.addFotosFromFiles(body.ministerioId, files);
    }

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
        return this.ministerioFotosService.delete(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body('url') url: string): Promise<MinisterioFotos | null> {
        return this.ministerioFotosService.updateFotos(id, url);
    }
}
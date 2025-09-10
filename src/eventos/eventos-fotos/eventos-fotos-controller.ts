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
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { EventoFoto } from "./eventos.fotos.entity";
import { EventosFotosService } from "./eventos.fotos.service";

@Controller('eventos-fotos')
export class EventosFotosController {
  constructor(private eventosFotosService: EventosFotosService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('fotos', 20, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(process.cwd(), 'files-uploads', 'fotos', 'uploads-fotos-evento');
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  async addFotoOuFotos(
    @Body('eventoId', ParseUUIDPipe) eventoId: string,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<EventoFoto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('É necessário enviar pelo menos uma foto');
    }

    return this.eventosFotosService.addFotosFromFiles(eventoId, files);
  }

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
    return this.eventosFotosService.delete(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('fileName') fileName: string
  ): Promise<EventoFoto | null> {
    return this.eventosFotosService.updateFotos(id, fileName);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto-eventos/create-evento-dto';
import { Evento } from './eventos.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
   @UseInterceptors(FileInterceptor('imagemEvento', {
    storage: require('multer').diskStorage({
      destination: '../../files-uplouds/imagens',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      }
    })
   }))
  create(
    @Body() eventoDto: CreateEventoDto,
    @UploadedFile() imagemEvento: Express.Multer.File
  ): Promise<Evento> {

    if (imagemEvento) {
    eventoDto.imagemEvento = imagemEvento.filename; // <- salva o nome do arquivo no DTO
  }
  return this.eventosService.createEvento(eventoDto);
  }

  @Get()
  findAll(): Promise<Evento[]> {
    return this.eventosService.findAll();
  }

  @Get(':id')
findById(@Param('id') id: string): Promise<Evento | null> {
  return this.eventosService.findById(id);
}


  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() evento: Partial<Evento>,
  ): Promise<Evento> {
    return this.eventosService.update(id, evento);
  }

  @Patch(':id')
  async updatePartial(
    @Param('id') id: string,
    @Body() evento: Partial<Evento>,
  ): Promise<Evento> {
    return this.eventosService.updatePartial(id, evento);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string): Promise<{ message: string }> {
    const message = await this.eventosService.softDelete(id);
    return { message };
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string): Promise<{ message: string }> {
    const message = await this.eventosService.restore(id);
    return { message };
  }

  @Get('destaque/listar')
  findEventDestaque(): Promise<Evento[]> {
    return this.eventosService.findEventDestaque();
  }
}


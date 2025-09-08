import { Controller, Get, Post, Body, Param, Delete, Put, Patch, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto-eventos/create-evento-dto';
import { Evento } from './eventos.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
@UseInterceptors(FileInterceptor('imagemEvento', {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(process.cwd(), 'files-uploads', 'imagens', 'imagens-eventos');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueSuffix}${extname(file.originalname)}`;
      cb(null, fileName);
    }
  }),
}))
async create(
  @Body() eventDto: CreateEventoDto,
  @UploadedFile() imagemEvento?: Express.Multer.File, // opcional
): Promise<Evento> {

  if (imagemEvento) {
    console.log('Uploaded file details:', imagemEvento);
    eventDto.imagemEvento = imagemEvento.filename;  // <-- só seta se existir
  } else {
    console.log('Nenhuma imagem foi enviada, continuando sem imagem.');
  }

  return this.eventosService.createEvento(eventDto);
}


  @Get()
  findAll(): Promise<Evento[]> {
    return this.eventosService.findAll();
  }

  @Get(':id')
  findById(@Param(':id') id: string): Promise<Evento | null> {
    return this.eventosService.findById(id);
  }

  @Put(':id')
  update(
    @Param(':id') id: string,
    @Body() evento: Partial<Evento>,
  ): Promise<Evento> {
    return this.eventosService.update(id, evento);
  }

  @Patch(':id')
  async updatePartial(
    @Param(':id') id: string,
    @Body() evento: Partial<Evento>,
  ): Promise<Evento> {
    return this.eventosService.updatePartial(id, evento);
  }

 @Delete(':id')
async Delete(@Param('id') id: string): Promise<{ message: string }> {
  const message = await this.eventosService.Delete(id); // chama o método certo
  return { message };
}


  @Post(':id/restore')
  async restore(@Param(':id') id: string): Promise<{ message: string }> {
    const message = await this.eventosService.restore(id);
    return { message };
  }

  @Get('destaque/listar')
  findEventDestaque(): Promise<Evento[]> {
    return this.eventosService.findEventDestaque();
  }
}

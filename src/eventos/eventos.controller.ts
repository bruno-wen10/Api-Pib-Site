import { EventosFotosService } from './eventos-fotos/eventos.fotos.service';
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
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  UploadedFiles,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto-eventos/create-evento-dto';
import { Evento } from './eventos.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('eventos')
export class EventosController {
  constructor(
    private readonly eventosService: EventosService,
    private readonly eventosFotosService: EventosFotosService
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
        { name: 'imagemEvento', maxCount: 1 },
        { name: 'fotos', maxCount: 10 },
      ], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let uploadPath: string;
          const basePath = join(process.cwd(), 'files-uploads');


          if (
            file.fieldname === 'imagemEvento'
          ) {
            uploadPath = join(basePath, 'imagens', 'imagens-eventos');

          } else if (file.fieldname === 'fotos') {

            uploadPath = join(basePath, 'fotos', 'fotos-eventos');

          } else {
            uploadPath = join(basePath, 'outros');
          }
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() eventDto: CreateEventoDto,
     @UploadedFiles()
    files?:{
      imagemEvento?: Express.Multer.File[];
      fotos?: Express.Multer.File[];
    }){

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    if (files?.imagemEvento?.[0]) {
      eventDto.imagemEvento = `${backendUrl}/uploads/imagens/imagens-eventos/${files.imagemEvento[0].filename}`;
    }
    if (files?.fotos) {
      eventDto.fotos = files.fotos.map(file => ({
        url: `${backendUrl}/uploads/fotos/fotos-eventos/${file.filename}`
      }));
    }
    // 5. Cria o evento principal com os dados de texto e URLs do banner/logo
    const novoEvento =
      await this.eventosService.CreateEvento(eventDto);

    // 6. Se houver fotos da galeria, delega a criação para o serviço de fotos
    if (files?.fotos && files.fotos.length > 0) {
      await this.eventosFotosService.addFotosFromFiles(
        novoEvento.id,
        files.fotos,
      );
    }

    // 7. Retorna o evento recém-criado (sem as fotos, para performance)
    return novoEvento;
  }

  @Get()
  findAll(): Promise<Evento[]> {
    return this.eventosService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Evento | null> {
    return this.eventosService.findById(id);
  }



  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagemEvento', maxCount: 1 },
        { name: 'fotos', maxCount: 10 },
      ],
       {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = join(
              process.cwd(),
              'files-uploads',
              'imagens',
              'imagens-eventos',
            );
            if (!existsSync(uploadPath)) {
              mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },

          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileName = `${uniqueSuffix}${extname(file.originalname)}`;
            cb(null, fileName);
          },
        }),
      },
    ),
  )
  async updatePartial(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() evento: Partial<Evento>,
     @UploadedFiles()
        files?: {
          imagemEvento?: Express.Multer.File[];
         
        },
  ): Promise<Evento> {
    // 4. O Controller monta as URLs e modifica o DTO
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    if (files?.imagemEvento?.[0]) {
      evento.imagemEvento = `${backendUrl}/uploads/imagens/imagens-eventos/${files.imagemEvento[0].filename}`;
    }
    return this.eventosService.update(id, evento);
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

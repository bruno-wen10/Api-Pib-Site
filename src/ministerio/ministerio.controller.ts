import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'; // Importe o serviço de fotos
import { CreateMinisterioDto } from './dto-ministerio/create-ministerio-dto';
import { MinisterioService } from './ministerio.service';
import { Ministerio } from './ministerio.intity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { MinisterioFotosService } from './ministerio-fotos/ministerio.fotos.service';

@Controller('ministerios')
export class MinisterioController {
  constructor(
    private readonly ministerioService: MinisterioService,
    private readonly ministerioFotosService: MinisterioFotosService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagem_banner', maxCount: 1 },
        { name: 'logo_ministerio', maxCount: 1 },
        { name: 'fotos', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          // --- LÓGICA DE DESTINO CONDICIONAL APLICADA AQUI ---
          destination: (req, file, cb) => {
            let uploadPath: string;
            const basePath = join(process.cwd(), 'files-uploads');

            // Verifica o nome do campo do arquivo
            if (
              file.fieldname === 'imagem_banner' ||
              file.fieldname === 'logo_ministerio'
            ) {
              // Se for banner ou logo, salva na pasta de imagens do ministério
              uploadPath = join(basePath, 'imagens', 'imagens-ministerio');
            } else if (file.fieldname === 'fotos') {
              // Se for uma foto da galeria, salva na pasta de fotos do ministério
              uploadPath = join(basePath, 'fotos', 'uplaud-fotos-ministerios');
            } else {
              // Um caminho padrão para qualquer outro arquivo inesperado (boa prática)
              uploadPath = join(basePath, 'outros');
            }

            // O resto da lógica para criar a pasta continua a mesma
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
  async create(
    @Body() createMinisterioDto: CreateMinisterioDto,
    @UploadedFiles()
    files?: {
      imagem_banner?: Express.Multer.File[];
      logo_ministerio?: Express.Multer.File[];
      fotos?: Express.Multer.File[];
    },
  ) {
    // 4. O Controller monta as URLs e modifica o DTO
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    if (files?.imagem_banner?.[0]) {
      createMinisterioDto.imagem_banner = `${backendUrl}/uploads/imagens/imagens-ministerio/${files.imagem_banner[0].filename}`;
    }
    if (files?.logo_ministerio?.[0]) {
      createMinisterioDto.logo_ministerio = `${backendUrl}/uploads/imagens/imagens-ministerio/${files.logo_ministerio[0].filename}`;
    }

    // 5. Cria o ministério principal com os dados de texto e URLs do banner/logo
    const novoMinisterio =
      await this.ministerioService.CreateMinisterio(createMinisterioDto);

    // 6. Se houver fotos da galeria, delega a criação para o serviço de fotos
    if (files?.fotos && files.fotos.length > 0) {
      await this.ministerioFotosService.addFotosFromFiles(
        novoMinisterio.id,
        files.fotos,
      );
    }

    // 7. Retorna o ministério recém-criado (sem as fotos, para performance)
    return novoMinisterio;
  }

  @Get()
  async findAll() {
    return this.ministerioService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.ministerioService.findById(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagem_banner', maxCount: 1 },
        { name: 'logo_ministerio', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = join(
              process.cwd(),
              'files-uploads',
              'imagens',
              'imagens-ministerio',
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() ministerio: Partial<Ministerio>,
    @UploadedFiles()
    files?: {
      imagem_banner?: Express.Multer.File[];
      logo_ministerio?: Express.Multer.File[];
    },
  ): Promise<Ministerio> {
    // 4. O Controller monta as URLs e modifica o DTO
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    if (files?.imagem_banner?.[0]) {
      ministerio.imagem_banner = `${backendUrl}/uploads/imagens/imagens-ministerio/${files.imagem_banner[0].filename}`;
    }
    if (files?.logo_ministerio?.[0]) {
      ministerio.logo_ministerio = `${backendUrl}/uploads/imagens/imagens-ministerio/${files.logo_ministerio[0].filename}`;
    }
    return this.ministerioService.update(id, ministerio);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.ministerioService.delete(id);
  }
}

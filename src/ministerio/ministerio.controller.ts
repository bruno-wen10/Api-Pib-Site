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
} from "@nestjs/common";
import { CreateMinisterioDto } from "./dto-ministerio/create-ministerio-dto";
import { MinisterioService } from "./ministerio.service";
import { Ministerio } from "./ministerio.intity";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";

@Controller("ministerios")
export class MinisterioController {
  constructor(private readonly ministerioService: MinisterioService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "imagem_banner", maxCount: 1 },
        { name: "logo_ministerio", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = join(
              process.cwd(),
              "files-uploads",
              "imagens",
              "imagens-ministerio"
            );
            if (!existsSync(uploadPath)) {
              mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileName = `${uniqueSuffix}${extname(file.originalname)}`;
            cb(null, fileName);
          },
        }),
      }
    )
  )
  async create(
    @Body() createMinisterioDto: CreateMinisterioDto,
    @UploadedFiles()
    files?: {
      imagem_banner?: Express.Multer.File[];
      logo_ministerio?: Express.Multer.File[];
    }
  ) {
    if (files?.imagem_banner?.[0]) {
      createMinisterioDto.imagem_banner = `/uploads/imagens/imagens-ministerio/${files.imagem_banner[0].filename}`;
    }
    if (files?.logo_ministerio?.[0]) {
      createMinisterioDto.logo_ministerio = `/uploads/imagens/imagens-ministerio/${files.logo_ministerio[0].filename}`;
    }

    return this.ministerioService.CreateMinisterio(
      createMinisterioDto,
      files?.imagem_banner?.[0],
      files?.logo_ministerio?.[0]
    );
  }

  @Get()
  async findAll() {
    return this.ministerioService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.ministerioService.findById(id);
  }


    @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMinisterioDto: Partial<Ministerio>, // Use Partial para atualizações parciais
  ): Promise<Ministerio> {
    return this.ministerioService.update(id, updateMinisterioDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.ministerioService.delete(id);
  }
}

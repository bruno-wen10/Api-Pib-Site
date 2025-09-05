import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { CreateMinisterioDto } from "./dto-ministerio/create-ministerio-dto";
import { MinisterioService } from "./ministerio.service";
import { Ministerio } from "./ministerio.intity";
import { FileFieldsInterceptor } from "@nestjs/platform-express";



@Controller('ministerio')
    export class MinisterioController {
    constructor(private readonly ministerioService: MinisterioService) {}
    


    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'imagem_banner', maxCount: 1 },
        { name: 'logo_ministerio', maxCount: 1 }
    ], {
        storage: require('multer').diskStorage({
            destination: '../../files-uplouds/imagens/imagem-ministerio',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + '-' + file.originalname);
            }
        })
    }))
    async create(
  @UploadedFiles()
  files: {
    imagem_banner?: Express.Multer.File[];
    logo_ministerio?: Express.Multer.File[];
  },
  @Body() createMinisterioDto: CreateMinisterioDto,
) {
  return this.ministerioService.CreateMinisterio(
    createMinisterioDto,
    files?.imagem_banner?.[0],
    files?.logo_ministerio?.[0],
  );
}

    @Get()
    async findAll() {
        return this.ministerioService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.ministerioService.findById(id);
    }
    

    @Put(':id')
    async update(@Param('id') id: string, @Body() ministerio: Partial<Ministerio>) {
        return this.ministerioService.update(id, ministerio);
    }

    @Patch(':id')
    async updatePartial(@Param('id') id: string, @Body() ministerio: Partial<Ministerio>) {
        return this.ministerioService.updateParcial(id, ministerio);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.ministerioService.delete(id);
    }
}
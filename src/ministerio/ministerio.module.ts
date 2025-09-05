import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ministerio } from "./ministerio.intity";
import { MinisterioController } from "./ministerio.controller";
import { MinisterioService } from "./ministerio.service";
import { MinisterioFotos } from "./ministerio-fotos/ministerio.foto.intity";
import { MinisterioFotosController } from "./ministerio-fotos/ministerio.fotos.controller";
import { MinisterioFotosService } from "./ministerio-fotos/ministerio.fotos.service";



@Module({
    imports: [TypeOrmModule.forFeature([
        Ministerio,
        MinisterioFotos
    ])],
        controllers: [MinisterioController, MinisterioFotosController],
        providers: [MinisterioService, MinisterioFotosService],
        exports: [MinisterioService],
})

export class MinisterioModule {}
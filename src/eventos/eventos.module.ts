import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventosController } from "./eventos.controller";
import { EventosService } from "./eventos.service";
import { Evento } from "./eventos.entity";
import { EventoFoto } from "./eventos-fotos/eventos-fotos.entity";
import { EventoVideo } from "./eventos-videos/eventos-videos.entity";


@Module({
    imports: [TypeOrmModule.forFeature([
        Evento,
        EventoFoto,
        EventoVideo
    ])],
        controllers: [EventosController],
        providers: [EventosService],
        exports: [EventosService],
})

export class EventosModule {}
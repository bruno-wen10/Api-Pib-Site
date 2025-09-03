import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventosController } from "./eventos.controller";
import { EventosService } from "./eventos.service";
import { Evento } from "./eventos.entity";
import { EventoFoto } from "./eventos-fotos/eventos.fotos.entity";
import { EventoVideo } from "./eventos-videos/eventos-videos.entity";
import { EventosFotosController } from "./eventos-fotos/eventos-fotos-controller";
import { EventosVideosService } from "./eventos-videos/eventos.videos.service";
import { EventosFotosService } from "./eventos-fotos/eventos.fotos.service";
import { EventosVideosController } from "./eventos-videos/eventos.videos.controller";


@Module({
    imports: [TypeOrmModule.forFeature([
        Evento,
        EventoFoto,
        EventoVideo
    ])],
        controllers: [EventosController, EventosFotosController, EventosVideosController],
        providers: [EventosService, EventosVideosService, EventosFotosService, EventosVideosService],
        exports: [EventosService],
})

export class EventosModule {}
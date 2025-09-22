import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitante } from './visitante.entity';
import { VisitanteService } from './visitante.service';
import { VisitanteController } from './visitante.controller';
import { Voluntario } from 'src/Cadastro-visitantes/voluntarios/voluntario.entity';
import { SinchSmsService } from '../../sinch-sms.service';

@Module({
      imports: [
        TypeOrmModule.forFeature([Visitante, Voluntario]),
      ],
  controllers: [VisitanteController],
  providers: [VisitanteService, SinchSmsService],
  exports: [VisitanteService],
})
export class VisitanteModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitante } from './visitante.entity';
import { VisitanteService } from './visitante.service';
import { VisitanteController } from './visitante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Visitante])],
  controllers: [VisitanteController],
  providers: [VisitanteService],
  exports: [VisitanteService],
})
export class VisitanteModule {}

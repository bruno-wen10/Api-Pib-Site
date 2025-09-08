import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuralOracao } from './mural-oracao.intity';
import { MuralOracaoController } from './mural-oracao.controller';
import { MuralOracaoService } from './mural-oracao.service';
;

@Module({
  imports: [TypeOrmModule.forFeature([
    MuralOracao
])],
  controllers: [MuralOracaoController],
  providers: [MuralOracaoService],
  exports: [MuralOracaoService],
})
export class MuralOracaoModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membro } from './membro.entity';
import { MembrosService } from './membros.service';
import { MembrosController } from './membros.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Membro])],
  providers: [MembrosService],
  controllers: [MembrosController],
})
export class MembrosModule {}

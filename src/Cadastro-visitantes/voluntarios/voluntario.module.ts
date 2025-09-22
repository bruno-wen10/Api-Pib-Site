import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voluntario } from './voluntario.entity';
import { VoluntarioService } from './voluntario.service';
import { VoluntarioController } from './voluntario.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Voluntario])],
    controllers: [VoluntarioController],
    providers: [VoluntarioService],
    exports: [TypeOrmModule.forFeature([Voluntario])],
})
export class VoluntarioModule {}

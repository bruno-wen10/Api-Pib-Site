import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VisitanteService } from './visitante.service';
import { CreateVisitanteDto } from './dto/create-visitante.dto';
import { UpdateVisitanteDto } from './dto/update-visitante.dto';

@Controller('visitantes')
export class VisitanteController {
  constructor(private readonly visitanteService: VisitanteService) {}

  @Post()
  create(@Body() dto: CreateVisitanteDto) {
    return this.visitanteService.create(dto);
  }

  @Get()
  findAll() {
    return this.visitanteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitanteService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVisitanteDto) {
    return this.visitanteService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitanteService.remove(id);
  }
}

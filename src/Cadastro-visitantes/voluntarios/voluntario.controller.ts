import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VoluntarioService } from './voluntario.service';
import { CreateVoluntarioDto } from './dto/create-voluntario.dto';
import { UpdateVoluntarioDto } from './dto/update-voluntario.dto';

@Controller('voluntarios')
export class VoluntarioController {
  constructor(private readonly voluntarioService: VoluntarioService) {}

  @Post()
  create(@Body() dto: CreateVoluntarioDto) {
    return this.voluntarioService.create(dto);
  }

  @Get()
  findAll() {
    return this.voluntarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voluntarioService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVoluntarioDto) {
    return this.voluntarioService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voluntarioService.remove(id);
  }
}

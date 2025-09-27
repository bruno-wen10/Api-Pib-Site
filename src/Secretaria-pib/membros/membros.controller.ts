import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MembrosService } from './membros.service';
import { CreateMembroDto } from './dto/create-membro.dto';
import { UpdateMembroDto } from './dto/update-membro.dto';
import { FilterMembroDto } from './dto/filter-membro.dto';

@Controller('membros')
export class MembrosController {
  constructor(private readonly membrosService: MembrosService) {}

  @Post()
  create(@Body() dto: CreateMembroDto) {
    return this.membrosService.create(dto);
  }

  @Get()
  findAll() {
    return this.membrosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membrosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMembroDto) {
    return this.membrosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membrosService.remove(id);
  }

  @Post('filter')
  filter(@Body() filter: FilterMembroDto) {
    return this.membrosService.filter(filter);
  }
}

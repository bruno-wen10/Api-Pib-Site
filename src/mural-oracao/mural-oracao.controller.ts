import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MuralOracaoService } from './mural-oracao.service';
import { CreateMuralOracaoDto } from './dto-mural-oracao/mural-oracao-dto';
import { MuralOracao } from './mural-oracao.intity';
import { UpdateMuralOracaoDto } from './dto-mural-oracao/mural-oracao-update-dto';


@Controller('mural-oracao')
export class MuralOracaoController {
  constructor(private readonly muralOracaoService: MuralOracaoService) {}

  @Post()
  create(@Body() createMuralOracaoDto: CreateMuralOracaoDto): Promise<MuralOracao> {
    return this.muralOracaoService.create(createMuralOracaoDto);
  }

  @Get()
  findAll(): Promise<MuralOracao[]> {
    return this.muralOracaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MuralOracao> {
    return this.muralOracaoService.findOneById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMuralOracaoDto: UpdateMuralOracaoDto,
  ): Promise<MuralOracao> {
    return this.muralOracaoService.update(id, updateMuralOracaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.muralOracaoService.remove(id);
  }
}

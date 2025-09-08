import { PartialType } from '@nestjs/mapped-types';
import { CreateMuralOracaoDto } from './mural-oracao-dto';
;

export class UpdateMuralOracaoDto extends PartialType(CreateMuralOracaoDto) {}

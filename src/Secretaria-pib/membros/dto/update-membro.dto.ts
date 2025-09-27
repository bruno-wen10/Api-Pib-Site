import { PartialType } from '@nestjs/mapped-types';
import { CreateMembroDto } from './create-membro.dto';

export class UpdateMembroDto extends PartialType(CreateMembroDto) {
	membroAtivo?: boolean;
	dateCreate?: Date;
	dateUpdate?: Date;
}

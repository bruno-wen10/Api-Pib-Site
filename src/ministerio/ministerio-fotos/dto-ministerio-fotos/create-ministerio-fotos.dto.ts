import { IsUUID } from 'class-validator';

export class CreateMinisterioFotosDto {
  @IsUUID()
  ministerioId: string;
}
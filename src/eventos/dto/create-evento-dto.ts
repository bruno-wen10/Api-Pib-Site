export class CreateEventoDto {
  lideranca_responsavel: string;
  inscricao?: string;
  titulo: string;
  data_evento_inicio_inscricao?: string;
  data_evento_fim_inscricao?: string;
  local: string;
  descricao?: string;
  sobre_evento?: string;
  imagem?: string;
  destaque?: boolean;
  dataInicio_evento?: string;
  dataFim_evento?: string;
  fotos?: string[];
  videos?: string[];
}

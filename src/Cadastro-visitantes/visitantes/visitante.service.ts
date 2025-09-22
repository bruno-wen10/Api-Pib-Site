import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import twilio from 'twilio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitante } from './visitante.entity';
import { CreateVisitanteDto } from './dto/create-visitante.dto';
import { UpdateVisitanteDto } from './dto/update-visitante.dto';
import { Voluntario } from '../voluntarios/voluntario.entity';
import { SinchSmsService } from '../../sinch-sms.service';

@Injectable()
export class VisitanteService {
  constructor(
    @InjectRepository(Visitante)
    private visitanteRepository: Repository<Visitante>,
    @InjectRepository(Voluntario)
    private voluntarioRepository: Repository<Voluntario>,
    private sinchSmsService: SinchSmsService,
  ) {}

  async create(dto: CreateVisitanteDto): Promise<Visitante> {
    const visitante = this.visitanteRepository.create({
      ...dto,
    });

    if (dto.voluntarioVisitaId) {
      visitante.voluntarioVisita = await this.voluntarioRepository.findOne({ where: { id: dto.voluntarioVisitaId } }) ?? undefined;
      if (visitante.voluntarioVisita) {
        await this.sinchSmsService.sendSms(visitante.voluntarioVisita.celular, `Novo visitante na Pib: ${visitante.nome}. Entre em contato pelo WhatsApp para marcar uma visita: ${visitante.celular}`);
      }
    }
    if (dto.voluntarioAconselhamentoId) {
      visitante.voluntarioAconselhamento = await this.voluntarioRepository.findOne({ where: { id: dto.voluntarioAconselhamentoId } }) ?? undefined;
      if (visitante.voluntarioAconselhamento) {
        await this.sinchSmsService.sendSms(visitante.voluntarioAconselhamento.celular, `Novo visitante na Pib: ${visitante.nome}. Entre em contato pelo WhatsApp para marcar um aconselhamento (visitante pediu aconselhamento): ${visitante.celular}`);
      }
    }
    if (dto.voluntarioProgramacaoId) {
      visitante.voluntarioProgramacao = await this.voluntarioRepository.findOne({ where: { id: dto.voluntarioProgramacaoId } }) ?? undefined;
      if (visitante.voluntarioProgramacao) {
        await this.sinchSmsService.sendSms(visitante.voluntarioProgramacao.celular, `Novo visitante na Pib: ${visitante.nome}. Entre em contato pelo WhatsApp para marcar uma visita (Visitante deseja conhecer mais sobre as programações da Pib): ${visitante.celular}`);
      }
    }
    if (dto.voluntarioEstudoBiblicoId) {
      visitante.voluntarioEstudoBiblico = await this.voluntarioRepository.findOne({ where: { id: dto.voluntarioEstudoBiblicoId } }) ?? undefined;
      if (visitante.voluntarioEstudoBiblico) {
        await this.sinchSmsService.sendSms(visitante.voluntarioEstudoBiblico.celular, `Novo visitante na Pib: ${visitante.nome}. Entre em contato pelo WhatsApp para marcar um estudo bíblico (visitante deseja estudar a Bíblia): ${visitante.celular}`);
      }
    }
    if (dto.voluntarioOracaoId) {
      visitante.voluntarioOracao = await this.voluntarioRepository.findOne({ where: { id: dto.voluntarioOracaoId } }) ?? undefined;
      if (visitante.voluntarioOracao) {
        await this.sinchSmsService.sendSms(visitante.voluntarioOracao.celular, `Novo visitante na Pib: ${visitante.nome}. O visitante deixou um pedido de oração: ${visitante.celular}`);
      }
    }
    // Aqui pode ser chamado o envio de WhatsApp para cada voluntário vinculado
    const savedVisitante = await this.visitanteRepository.save(visitante);

    // Envia SMS para voluntários vinculados
    const voluntariosCelulares: string[] = [];
    if (visitante.voluntarioVisita?.celular) voluntariosCelulares.push(visitante.voluntarioVisita.celular);
    if (visitante.voluntarioAconselhamento?.celular) voluntariosCelulares.push(visitante.voluntarioAconselhamento.celular);
    if (visitante.voluntarioProgramacao?.celular) voluntariosCelulares.push(visitante.voluntarioProgramacao.celular);
    if (visitante.voluntarioEstudoBiblico?.celular) voluntariosCelulares.push(visitante.voluntarioEstudoBiblico.celular);
    if (visitante.voluntarioOracao?.celular) voluntariosCelulares.push(visitante.voluntarioOracao.celular);

    for (const celular of voluntariosCelulares) {
      try {
        await this.sinchSmsService.sendSms(
          celular,
          `Novo visitante cadastrado: ${visitante.nome}. Celular: ${visitante.celular}`,
        );
      } catch (err) {
        console.error('Falha ao enviar SMS para voluntário:', celular, err);
      }
    }

    return savedVisitante;
  }
  private async sendSmsMessage(to: string, body: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromSms = process.env.TWILIO_SMS_NUMBER; // Ex: '+1415xxxxxxx'
    const client = twilio(accountSid, authToken);
    try {
      await client.messages.create({
        body,
        from: fromSms,
        to: to.replace(/[^0-9+]/g, '') // Garante formato internacional
        });
      } catch (err) {
        console.error('Erro ao enviar SMS:', err);
      }
      // Sinch SMS API
      const sinchApiKey = process.env.SINCH_API_KEY;
      const sinchApiSecret = process.env.SINCH_API_SECRET;
      const sinchSmsNumber = process.env.SINCH_SMS_NUMBER; // Ex: '+55xxxxxxxxxx'
      const url = 'https://sms.api.sinch.com/xms/v1/' + sinchApiKey + '/batches';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(sinchApiKey + ':' + sinchApiSecret).toString('base64'),
          },
          body: JSON.stringify({
            from: sinchSmsNumber,
            to: [to.replace(/[^0-9+]/g, '')],
            body,
          }),
        });
        const responseText = await response.text();
        if (!response.ok) {
          console.error('Erro ao enviar SMS Sinch:', response.status, responseText);
          throw new Error(`Falha ao enviar SMS Sinch: ${response.status} - ${responseText}`);
        } else {
          console.log('SMS Sinch enviado com sucesso:', responseText);
        }
      } catch (err) {
        console.error('Erro inesperado ao enviar SMS Sinch:', err);
        throw err;
      }
  }

  async findAll(): Promise<Visitante[]> {
    return this.visitanteRepository.find({ relations: [
      'voluntarioVisita',
      'voluntarioAconselhamento',
      'voluntarioProgramacao',
      'voluntarioEstudoBiblico',
      'voluntarioOracao',
    ] });
  }

  async findOne(id: string): Promise<Visitante | null> {
    return this.visitanteRepository.findOne({ where: { id }, relations: [
      'voluntarioVisita',
      'voluntarioAconselhamento',
      'voluntarioProgramacao',
      'voluntarioEstudoBiblico',
      'voluntarioOracao',
    ] });
  }

  async update(id: string, dto: UpdateVisitanteDto): Promise<Visitante> {
    const visitante = await this.findOne(id);
    if (!visitante) throw new Error('Visitante não encontrado');
    Object.assign(visitante, dto);
    // Atualiza voluntários se IDs forem enviados
    if (dto.voluntarioVisitaId) visitante.voluntarioVisita = await this.voluntarioRepository.findOne({ where: { id: dto.voluntarioVisitaId } }) ?? undefined;
    if (dto.voluntarioAconselhamentoId) visitante.voluntarioAconselhamento = await this.voluntarioRepository.findOne({ where: { id: dto.voluntarioAconselhamentoId } }) ?? undefined;
    if (dto.voluntarioProgramacaoId) visitante.voluntarioProgramacao = await this.voluntarioRepository.findOne({ where: { id: dto.voluntarioProgramacaoId } }) ?? undefined;
    if (dto.voluntarioEstudoBiblicoId) visitante.voluntarioEstudoBiblico = await this.voluntarioRepository.findOne({ where: { id: dto.voluntarioEstudoBiblicoId } }) ?? undefined;
    if (dto.voluntarioOracaoId) visitante.voluntarioOracao = await this.voluntarioRepository.findOne({ where: { id: dto.voluntarioOracaoId } }) ?? undefined;
    return this.visitanteRepository.save(visitante);
  }

  async remove(id: string): Promise<void> {
    await this.visitanteRepository.delete(id);
  }

  async findByDataVisita(ano?: number, mes?: number, dia?: number): Promise<Visitante[]> {
    const query = this.visitanteRepository.createQueryBuilder('visitante');
    if (ano) {
      query.where('EXTRACT(YEAR FROM visitante.dataVisita) = :ano', { ano });
    }
    if (mes) {
      query.andWhere('EXTRACT(MONTH FROM visitante.dataVisita) = :mes', { mes });
    }
    if (dia) {
      query.andWhere('EXTRACT(DAY FROM visitante.dataVisita) = :dia', { dia });
    }
    return query.leftJoinAndSelect('visitante.voluntarioVisita', 'voluntarioVisita')
      .leftJoinAndSelect('visitante.voluntarioAconselhamento', 'voluntarioAconselhamento')
      .leftJoinAndSelect('visitante.voluntarioProgramacao', 'voluntarioProgramacao')
      .leftJoinAndSelect('visitante.voluntarioEstudoBiblico', 'voluntarioEstudoBiblico')
      .leftJoinAndSelect('visitante.voluntarioOracao', 'voluntarioOracao')
      .getMany();
  }
}

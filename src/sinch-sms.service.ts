import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SinchSmsService {
  async sendSms(to: string, message: string): Promise<any> {
    const sinchApiKey = process.env.SINCH_API_KEY;
    const sinchApiSecret = process.env.SINCH_API_SECRET;
    const sinchSmsNumber = process.env.SINCH_SMS_NUMBER;
    const url = `https://sms.api.sinch.com/xms/v1/${sinchApiKey}/batches`;
    try {
      const response = await axios.post(
        url,
        {
          from: sinchSmsNumber,
          to: [to],
          body: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${sinchApiKey}:${sinchApiSecret}`).toString('base64'),
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar SMS pelo Sinch:', error.response?.data || error.message);
      throw error;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';

/** Sends email through SMTP when configured; otherwise logs the message (development). */
@Injectable()
export class MailService {
  private readonly logger = new Logger('Mail');
  private transporter: Transporter | null = null;

  constructor() {
    const e = env();
    if (e.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({ host: e.SMTP_HOST, port: e.SMTP_PORT, secure: e.SMTP_PORT === 465, auth: e.SMTP_USER ? { user: e.SMTP_USER, pass: e.SMTP_PASS } : undefined });
    }
  }

  async send(to: string, subject: string, text: string) {
    if (!this.transporter) {
      this.logger.log(`[no SMTP configured] to=${to} subject="${subject}"\n${text}`);
      return;
    }
    try {
      await this.transporter.sendMail({ from: env().SMTP_FROM, to, subject, text });
    } catch (e) {
      this.logger.error(`Failed to send email to ${to}: ${(e as Error).message}`);
    }
  }
}

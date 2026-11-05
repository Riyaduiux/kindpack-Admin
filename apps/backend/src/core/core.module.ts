import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { StorageService } from './storage.service';
import { AuditService } from './audit.service';

/** Cross-cutting services available to every module (no import needed). */
@Global()
@Module({
  providers: [MailService, StorageService, AuditService],
  exports: [MailService, StorageService, AuditService],
})
export class CoreModule {}

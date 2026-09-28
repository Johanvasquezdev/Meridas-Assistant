import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { VerificationService } from './verification.service';

@Module({
  providers: [AiService, VerificationService],
  exports: [AiService, VerificationService],
})
export class AiModule {}

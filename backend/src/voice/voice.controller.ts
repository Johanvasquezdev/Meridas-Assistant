import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { IsString, IsUUID, MaxLength } from 'class-validator';
import { VoiceService } from './voice.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';

class SynthesizeDto {
  @IsString()
  @MaxLength(5000)
  text: string;
}

class SummarizeDto {
  @IsUUID()
  documentId: string;
}

@UseGuards(ClerkAuthGuard)
@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  async transcribe(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }
    return this.voiceService.transcribe(file.buffer, file.mimetype);
  }

  @Post('synthesize')
  async synthesize(@Body() dto: SynthesizeDto, @Res() res: Response) {
    const buffer = await this.voiceService.synthesize(dto.text);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Post('summarize')
  async summarize(
    @CurrentTenant() tenantId: string,
    @Body() dto: SummarizeDto,
    @Res() res: Response,
  ) {
    const { audioBuffer, summaryText } = await this.voiceService.summarizeDocument(
      dto.documentId,
      tenantId,
    );
    
    if (audioBuffer && audioBuffer.length > 0) {
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'X-Summary-Text': Buffer.from(summaryText).toString('base64'),
        'X-Audio-Available': 'true',
        'Access-Control-Expose-Headers': 'X-Summary-Text, X-Audio-Available',
      });
      res.end(audioBuffer);
    } else {
      res.set({
        'Content-Type': 'application/json',
        'X-Summary-Text': Buffer.from(summaryText).toString('base64'),
        'X-Audio-Available': 'false',
        'Access-Control-Expose-Headers': 'X-Summary-Text, X-Audio-Available',
      });
      res.json({
        summaryText,
        audioAvailable: false,
        message: 'Summary generated successfully. Use browser speech playback.',
      });
    }
  }

  @Post('search')
  @UseInterceptors(FileInterceptor('audio'))
  async search(
    @CurrentTenant() tenantId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }
    return this.voiceService.voiceSearch(file.buffer, file.mimetype, tenantId);
  }
}

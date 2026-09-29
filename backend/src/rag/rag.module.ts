import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { SearchModule } from '../search/search.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [SearchModule, DocumentsModule],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}

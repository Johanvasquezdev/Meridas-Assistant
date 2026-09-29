import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ConflictsService } from './conflicts.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { Request } from 'express';

interface ClerkUserRequest extends Request {
  user?: {
    authType: 'clerk';
    userId: string;
    email?: string;
    tenantId: string;
  };
}

@UseGuards(ClerkAuthGuard)
@Controller('conflicts')
export class ConflictsController {
  constructor(private readonly conflicts: ConflictsService) {}

  @Get()
  listConflicts(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
  ) {
    return this.conflicts.listConflicts(tenantId, status);
  }

  @Post(':id/resolve')
  @HttpCode(HttpStatus.OK)
  resolveConflict(
    @CurrentTenant() tenantId: string,
    @Param('id') conflictId: string,
    @Req() req: ClerkUserRequest,
    @Body() body: {
      decision: 'OVERRIDE_AUTHORITY' | 'MARK_FALSE_POSITIVE' | 'REQUEST_DOC_UPDATE';
      scopeOverride?: string;
      rationale: string;
      authoritativeClaimId?: string;
    },
  ) {
    const userId = req.user?.userId || 'unknown-user';
    return this.conflicts.resolveConflict({
      conflictId,
      userId,
      tenantId,
      decision: body.decision,
      scopeOverride: body.scopeOverride,
      rationale: body.rationale,
      authoritativeClaimId: body.authoritativeClaimId,
    });
  }

  @Get('health-summary')
  getHealthSummary(@CurrentTenant() tenantId: string) {
    return this.conflicts.getHealthSummary(tenantId);
  }
}

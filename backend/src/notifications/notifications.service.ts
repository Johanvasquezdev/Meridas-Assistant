import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { baseTemplate } from './templates/email.templates';
import { smsTemplates } from './templates/sms.templates';

// Using require as per prompt instructions for Brevo SDK
const brevo = require('@getbrevo/brevo');

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly emailApi: any;
  private readonly smsApi: any;
  private readonly campaignApi: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');

    // Transactional Email client
    this.emailApi = new brevo.TransactionalEmailsApi();
    this.emailApi.authentications.apiKey.apiKey = apiKey;

    // SMS client
    this.smsApi = new brevo.TransactionalSMSApi();
    this.smsApi.authentications.apiKey.apiKey = apiKey;

    // Campaigns client
    this.campaignApi = new brevo.EmailCampaignsApi();
    this.campaignApi.authentications.apiKey.apiKey = apiKey;
  }

  async createEmailCampaign(options: {
    name: string;
    subject: string;
    senderName?: string;
    senderEmail?: string;
    htmlContent: string;
    listIds: number[];
    scheduledAt?: string;
  }) {
    try {
      const emailCampaigns = new brevo.CreateEmailCampaign();
      
      emailCampaigns.name = options.name;
      emailCampaigns.subject = options.subject;
      emailCampaigns.sender = {
        name: options.senderName || this.configService.get<string>('BREVO_SENDER_NAME'),
        email: options.senderEmail || this.configService.get<string>('BREVO_SENDER_EMAIL'),
      };
      emailCampaigns.type = 'classic';
      emailCampaigns.htmlContent = options.htmlContent;
      emailCampaigns.recipients = { listIds: options.listIds };
      
      if (options.scheduledAt) {
        emailCampaigns.scheduledAt = options.scheduledAt;
      }

      const result = await this.campaignApi.createEmailCampaign(emailCampaigns);
      this.logger.log(`Email campaign created successfully: ${options.name}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create email campaign: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async sendEmail(to: string, subject: string, htmlContent: string) {
    try {
      const senderEmail = this.configService.get<string>('BREVO_SENDER_EMAIL');
      const senderName = this.configService.get<string>('BREVO_SENDER_NAME');

      await this.emailApi.sendTransacEmail({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: to }],
        subject,
        htmlContent,
      });

      this.logger.log(`Email sent successfully to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
    }
  }

  private async sendSms(to: string, content: string) {
    try {
      const sender = this.configService.get<string>('BREVO_SMS_SENDER');

      await this.smsApi.sendTransacSms({
        sender,
        recipient: to,
        content,
      });

      this.logger.log(`SMS sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}: ${error.message}`, error.stack);
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const content = `
      <h1>Welcome to MERIDAS Operational Intelligence, ${name}!</h1>
      <p>Your institutional verification workspace is now active, granting you zero-hallucination operational knowledge intelligence.</p>
      <p>Ready to get started? Ingest your operational directives, SOPs, and technical runbooks to verify knowledge across your enterprise.</p>
      <div class="button-container">
        <a href="${this.configService.get('FRONTEND_URL')}/dashboard" class="button">Go to Console</a>
      </div>
      <p class="muted">Need assistance? Reply to this dispatch and our systems team will be glad to assist.</p>
    `;
    const html = baseTemplate(content, 'Welcome to MERIDAS');
    await this.sendEmail(to, 'Welcome to MERIDAS Operational Intelligence', html);
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    const content = `
      <h1>Reset your MERIDAS credentials</h1>
      <p>We received an authorized request to reset your access passkey. Click the secure link below to set new credentials. This link expires in 1 hour.</p>
      <div class="button-container">
        <a href="${resetLink}" class="button">Reset Credentials</a>
      </div>
      <p class="muted">If you did not request this credential reset, contact your system administrator immediately.</p>
    `;
    const html = baseTemplate(content, 'Reset your MERIDAS credentials');
    await this.sendEmail(to, 'Reset your MERIDAS credentials', html);
  }

  async sendPlanConfirmationEmail(to: string, name: string, plan: string, amount: string): Promise<void> {
    const limits = plan.toLowerCase() === 'pro' ? '10,000 queries' : '1,000 queries';
    const content = `
      <h1>Your MERIDAS ${plan} Tier is Active</h1>
      <p>Hi ${name}, thank you for choosing MERIDAS. Continuous knowledge verification and contradiction detection are now provisioned.</p>
      <p><strong>Tier:</strong> ${plan}<br>
      <strong>Amount:</strong> ${amount}<br>
      <strong>Provisioned Quota:</strong> ${limits} per billing cycle</p>
      <div class="button-container">
        <a href="${this.configService.get('FRONTEND_URL')}/dashboard" class="button">Go to Console</a>
      </div>
    `;
    const html = baseTemplate(content, `Your MERIDAS ${plan} Tier is Active`);
    await this.sendEmail(to, `Your MERIDAS ${plan} Tier is Active`, html);
  }

  async sendTrialEndingEmail(to: string, name: string, daysLeft: number): Promise<void> {
    const content = `
      <h1>Your verification trial ends in ${daysLeft} days</h1>
      <p>Hi ${name}, your evaluation period for MERIDAS Operational Intelligence concludes in ${daysLeft} days.</p>
      <p>Maintain continuous conflict monitoring and high-assurance evidence retrieval across your directives by selecting a tier.</p>
      <div class="button-container">
        <a href="${this.configService.get('FRONTEND_URL')}/dashboard/billing" class="button">Inspect Tiers</a>
      </div>
    `;
    const html = baseTemplate(content, `Your trial ends in ${daysLeft} days`);
    await this.sendEmail(to, `Your trial ends in ${daysLeft} days`, html);
  }

  async sendTrialExpiredEmail(to: string, name: string): Promise<void> {
    const content = `
      <h1>Your MERIDAS evaluation has concluded</h1>
      <p>Hi ${name}, your trial period has completed. To preserve multi-repository citation indices and real-time conflict escalation, upgrade your workspace.</p>
      <div class="button-container">
        <a href="${this.configService.get('FRONTEND_URL')}/dashboard/billing" class="button">Activate Workspace</a>
      </div>
    `;
    const html = baseTemplate(content, 'Your MERIDAS evaluation has concluded');
    await this.sendEmail(to, 'Your MERIDAS evaluation has concluded', html);
  }

  async sendWelcomeSMS(to: string, name: string): Promise<void> {
    if (!to) return;
    const content = smsTemplates.welcome(name);
    await this.sendSms(to, content);
  }

  async sendPlanActivatedSMS(to: string, plan: string): Promise<void> {
    if (!to) return;
    const content = smsTemplates.planActivated(plan);
    await this.sendSms(to, content);
  }

  async sendTrialEndingSMS(to: string, daysLeft: number): Promise<void> {
    if (!to) return;
    const content = smsTemplates.trialEnding(daysLeft);
    await this.sendSms(to, content);
  }

  async sendOtpSMS(to: string, otp: string): Promise<void> {
    if (!to) return;
    const content = smsTemplates.otp(otp);
    await this.sendSms(to, content);
  }
}

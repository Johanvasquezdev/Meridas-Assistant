export const smsTemplates = {
  welcome: (name: string) => 
    `Hi ${name}! Welcome to MERIDAS Operational Intelligence. Your 14-day trial is active. Access your console: meridas.ai/dashboard`,
  
  planActivated: (plan: string) => 
    `MERIDAS: Your ${plan} plan is now active. Operational knowledge verification enabled. Console: meridas.ai/dashboard`,
  
  trialEnding: (daysLeft: number) => 
    `MERIDAS: Your trial ends in ${daysLeft} day(s). Upgrade now to keep continuous verification access: meridas.ai/dashboard/billing`,
  
  otp: (otp: string) => 
    `MERIDAS verification code: ${otp}. Valid for 10 minutes. Do not share this code.`
};

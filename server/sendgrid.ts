import { MailService } from '@sendgrid/mail';

let mailService: MailService | null = null;

function getMailService(): MailService {
  if (!mailService) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY environment variable must be set");
    }
    
    mailService = new MailService();
    mailService.setApiKey(apiKey);
  }
  return mailService;
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const mailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
    };
    
    if (params.text) mailData.text = params.text;
    if (params.html) mailData.html = params.html;
    
    // Ensure at least text or html is provided
    if (!params.text && !params.html) {
      mailData.text = params.subject;
    }

    await getMailService().send(mailData);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}
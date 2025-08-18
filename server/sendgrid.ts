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
    // Debug logging for API key validation
    const apiKey = process.env.SENDGRID_API_KEY;
    console.log('API Key status:', {
      exists: !!apiKey,
      format: apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : 'none',
      length: apiKey?.length
    });

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

    console.log('Sending email with data:', {
      to: mailData.to,
      from: mailData.from,
      subject: mailData.subject,
      hasText: !!mailData.text,
      hasHtml: !!mailData.html
    });

    await getMailService().send(mailData);
    console.log('Email sent successfully');
    return true;
  } catch (error: any) {
    console.error('SendGrid email error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      body: error.response?.body
    });
    return false;
  }
}
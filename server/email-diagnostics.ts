/**
 * Email Integration Diagnostics
 * Comprehensive testing and validation for SendGrid integration
 */

export interface EmailDiagnostics {
  apiKeyStatus: 'missing' | 'invalid_format' | 'unauthorized' | 'valid';
  apiKeyLength?: number;
  apiKeyPrefix?: string;
  environmentLoaded: boolean;
  lastError?: string;
  testResults: {
    connectionTest: boolean;
    authenticationTest: boolean;
    sendTest: boolean;
  };
}

export function validateApiKey(): EmailDiagnostics['apiKeyStatus'] {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) return 'missing';
  
  // SendGrid API keys should start with "SG." and be 69 characters long
  if (!apiKey.startsWith('SG.')) return 'invalid_format';
  if (apiKey.length !== 69) return 'invalid_format';
  
  // Additional format validation
  const parts = apiKey.split('.');
  if (parts.length !== 3) return 'invalid_format';
  
  return 'valid';
}

export function getEmailDiagnostics(): EmailDiagnostics {
  const apiKey = process.env.SENDGRID_API_KEY;
  const apiKeyStatus = validateApiKey();
  
  return {
    apiKeyStatus,
    apiKeyLength: apiKey?.length,
    apiKeyPrefix: apiKey ? `${apiKey.substring(0, 8)}...` : undefined,
    environmentLoaded: !!process.env.SENDGRID_API_KEY,
    testResults: {
      connectionTest: false,
      authenticationTest: false,
      sendTest: false
    }
  };
}

export async function runEmailDiagnostics(): Promise<EmailDiagnostics> {
  const diagnostics = getEmailDiagnostics();
  
  // Only run connection tests if API key format is valid
  if (diagnostics.apiKeyStatus === 'valid') {
    try {
      // Test SendGrid connection (simplified validation)
      const testResponse = await fetch('https://api.sendgrid.com/v3/user/profile', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (testResponse.ok) {
        diagnostics.testResults.connectionTest = true;
        diagnostics.testResults.authenticationTest = true;
        diagnostics.apiKeyStatus = 'valid';
      } else if (testResponse.status === 401) {
        diagnostics.apiKeyStatus = 'unauthorized';
        diagnostics.lastError = 'API key authentication failed';
      }
    } catch (error) {
      diagnostics.lastError = `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
  
  return diagnostics;
}
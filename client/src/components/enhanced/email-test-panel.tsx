import { useState } from "react";
import { Send, Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailTestResult {
  success: boolean;
  error?: string;
  timestamp: Date;
}

const EmailTestPanel = () => {
  const [emailData, setEmailData] = useState({
    to: "test@example.com",
    from: "noreply@przmo.com",
    subject: "PRZMO Email Integration Test",
    text: "This is a test email from the PRZMO Athletic Lifestyle application."
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<EmailTestResult | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
  };

  const testEmailIntegration = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();
      setTestResult({
        success: result.success,
        error: result.error,
        timestamp: new Date()
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Card className="w-96 bg-white/95 backdrop-blur-sm shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Email Integration Test</CardTitle>
          </div>
          <CardDescription>
            Test SendGrid email functionality
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-to">To Email</Label>
            <Input
              id="email-to"
              type="email"
              value={emailData.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              placeholder="recipient@example.com"
              data-testid="input-email-to"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-from">From Email</Label>
            <Input
              id="email-from"
              type="email"
              value={emailData.from}
              onChange={(e) => handleInputChange('from', e.target.value)}
              placeholder="sender@przmo.com"
              data-testid="input-email-from"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              value={emailData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Email subject"
              data-testid="input-email-subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-text">Message</Label>
            <Textarea
              id="email-text"
              value={emailData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="Email message content"
              rows={3}
              data-testid="textarea-email-text"
            />
          </div>

          <Button
            onClick={testEmailIntegration}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="button-send-test-email"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Test Email
              </>
            )}
          </Button>

          {testResult && (
            <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription className={testResult.success ? "text-green-800" : "text-red-800"}>
                    <div className="font-medium mb-1">
                      {testResult.success ? "Email Sent Successfully!" : "Email Failed to Send"}
                    </div>
                    {testResult.error && (
                      <div className="text-sm">
                        Error: {testResult.error}
                      </div>
                    )}
                    <div className="text-xs opacity-75 mt-1">
                      {testResult.timestamp.toLocaleString()}
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          {/* Troubleshooting Tips */}
          <div className="pt-2 border-t">
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                Troubleshooting Tips
              </summary>
              <div className="mt-2 space-y-1 text-gray-600">
                <div>• Ensure SendGrid API key is valid and active</div>
                <div>• Verify sender email is authenticated in SendGrid</div>
                <div>• Check SendGrid account status and quotas</div>
                <div>• Confirm environment variable is properly loaded</div>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTestPanel;
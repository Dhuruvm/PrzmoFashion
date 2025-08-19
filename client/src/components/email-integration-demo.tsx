import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface EmailResult {
  success: boolean;
  error?: string;
  timestamp: Date;
}

export default function EmailIntegrationDemo() {
  const [isVisible, setIsVisible] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: "customer@example.com",
    subject: "Welcome to PRZMO Athletic Lifestyle",
    message: "Thank you for choosing PRZMO! Your order has been confirmed and will be processed shortly."
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailResult, setEmailResult] = useState<EmailResult | null>(null);

  const handleSendEmail = async () => {
    setIsLoading(true);
    setEmailResult(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailForm.to,
          from: "noreply@przmo.com",
          subject: emailForm.subject,
          text: emailForm.message
        })
      });

      const result = await response.json();
      setEmailResult({
        success: result.success,
        error: result.error,
        timestamp: new Date()
      });
    } catch (error) {
      setEmailResult({
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown'}`,
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setEmailForm(prev => ({ ...prev, [field]: value }));
  };

  if (!isVisible) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm shadow-lg border-blue-200"
          data-testid="button-show-email-demo"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email Demo
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-50">
      <Card className="w-96 bg-white/95 backdrop-blur-sm shadow-xl border-2 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Email Integration</CardTitle>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200">
              Active
            </Badge>
          </div>
          <CardDescription>
            Test SMTP email functionality
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="demo-email-to">Recipient Email</Label>
            <Input
              id="demo-email-to"
              type="email"
              value={emailForm.to}
              onChange={(e) => updateForm('to', e.target.value)}
              placeholder="customer@example.com"
              data-testid="input-demo-email-to"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-email-subject">Subject</Label>
            <Input
              id="demo-email-subject"
              value={emailForm.subject}
              onChange={(e) => updateForm('subject', e.target.value)}
              placeholder="Email subject"
              data-testid="input-demo-email-subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-email-message">Message</Label>
            <Textarea
              id="demo-email-message"
              value={emailForm.message}
              onChange={(e) => updateForm('message', e.target.value)}
              placeholder="Email content"
              rows={4}
              data-testid="textarea-demo-email-message"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSendEmail}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-send-demo-email"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="outline"
              size="sm"
              className="px-3"
              data-testid="button-close-email-demo"
            >
              ×
            </Button>
          </div>

          {emailResult && (
            <Alert className={emailResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-start gap-2">
                {emailResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <AlertDescription className={emailResult.success ? "text-green-800" : "text-red-800"}>
                    <div className="font-medium mb-1">
                      {emailResult.success ? "Email Sent Successfully!" : "Email Failed"}
                    </div>
                    {emailResult.error && (
                      <div className="text-sm break-words">
                        {emailResult.error}
                      </div>
                    )}
                    <div className="text-xs opacity-75 mt-1">
                      {emailResult.timestamp.toLocaleString()}
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="pt-2 border-t text-xs text-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>SMTP Integration Active</span>
            </div>
            <div>From: noreply@przmo.com</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Mail, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailDiagnostics {
  smtpStatus: 'missing' | 'partial' | 'configured' | 'valid';
  smtpHost?: string;
  smtpUser?: string;
  hasAppPassword: boolean;
  environmentLoaded: boolean;
  lastError?: string;
  testResults: {
    connectionTest: boolean;
    authenticationTest: boolean;
    sendTest: boolean;
  };
}

const EmailStatusIndicator = () => {
  const [diagnostics, setDiagnostics] = useState<EmailDiagnostics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchDiagnostics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email-diagnostics');
      const data = await response.json();
      setDiagnostics(data);
    } catch (error) {
      console.error('Failed to fetch email diagnostics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-500';
      case 'configured': return 'bg-blue-500';
      case 'partial': return 'bg-yellow-500';
      case 'missing': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid': return 'Active';
      case 'configured': return 'Ready';
      case 'partial': return 'Partial';
      case 'missing': return 'Not Set';
      default: return 'Unknown';
    }
  };

  if (!diagnostics && !isLoading) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <Badge 
          variant="outline" 
          className={`cursor-pointer px-3 py-2 ${diagnostics ? getStatusColor(diagnostics.smtpStatus) : 'bg-gray-500'} text-white border-0 shadow-lg`}
          onClick={() => setIsExpanded(true)}
        >
          <Mail className="w-3 h-3 mr-1" />
          SMTP: {diagnostics ? getStatusText(diagnostics.smtpStatus) : 'Loading...'}
        </Badge>
      ) : (
        <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <CardTitle className="text-base">Email System Status</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <CardDescription>SMTP Integration Diagnostics</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {diagnostics && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(diagnostics.smtpStatus)}`} />
                    <span className="font-medium">{getStatusText(diagnostics.smtpStatus)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchDiagnostics}
                    disabled={isLoading}
                    className="h-7"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Environment:</span>
                    <span className={diagnostics.environmentLoaded ? 'text-green-600' : 'text-red-600'}>
                      {diagnostics.environmentLoaded ? 'Loaded' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SMTP Host:</span>
                    <span className="text-gray-600">
                      {diagnostics.smtpHost || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SMTP User:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">
                      {diagnostics.smtpUser || 'none'}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">App Password:</span>
                    <span className={diagnostics.hasAppPassword ? 'text-green-600' : 'text-red-600'}>
                      {diagnostics.hasAppPassword ? 'Set' : 'Missing'}
                    </span>
                  </div>
                </div>

                {diagnostics.smtpStatus === 'partial' && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 text-sm">
                      <div className="font-medium mb-1">SMTP Partially Configured</div>
                      <div>SMTP user is set but Gmail App Password is missing. Set GMAIL_APP_PASSWORD environment variable.</div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-600 mb-2">Test Results:</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      {diagnostics.testResults.connectionTest ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                      Connect
                    </div>
                    <div className="flex items-center gap-1">
                      {diagnostics.testResults.authenticationTest ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                      Auth
                    </div>
                    <div className="flex items-center gap-1">
                      {diagnostics.testResults.sendTest ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                      Send
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailStatusIndicator;
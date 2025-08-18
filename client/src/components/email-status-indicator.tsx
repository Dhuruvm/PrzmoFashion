import { useState, useEffect } from "react";
import { Mail, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailDiagnostics {
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
      case 'unauthorized': return 'bg-yellow-500';
      case 'missing':
      case 'invalid_format': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid': return 'Active';
      case 'unauthorized': return 'Invalid Key';
      case 'missing': return 'No Key';
      case 'invalid_format': return 'Bad Format';
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
          className={`cursor-pointer px-3 py-2 ${diagnostics ? getStatusColor(diagnostics.apiKeyStatus) : 'bg-gray-500'} text-white border-0 shadow-lg`}
          onClick={() => setIsExpanded(true)}
        >
          <Mail className="w-3 h-3 mr-1" />
          Email: {diagnostics ? getStatusText(diagnostics.apiKeyStatus) : 'Loading...'}
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
            <CardDescription>SendGrid Integration Diagnostics</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {diagnostics && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(diagnostics.apiKeyStatus)}`} />
                    <span className="font-medium">{getStatusText(diagnostics.apiKeyStatus)}</span>
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
                    <span className="text-gray-600">Key Format:</span>
                    <span className={diagnostics.apiKeyLength === 69 ? 'text-green-600' : 'text-red-600'}>
                      {diagnostics.apiKeyLength} chars
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Key Preview:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">
                      {diagnostics.apiKeyPrefix || 'none'}
                    </code>
                  </div>
                </div>

                {diagnostics.apiKeyStatus === 'unauthorized' && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 text-sm">
                      <div className="font-medium mb-1">API Key Issue Detected</div>
                      <div>The SendGrid API key exists but is invalid, expired, or from a suspended account.</div>
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
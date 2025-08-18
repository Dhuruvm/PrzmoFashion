import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Shield, 
  Key, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  Copy,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminSetupGuideProps {
  onClose?: () => void;
}

export function AdminSetupGuide({ onClose }: AdminSetupGuideProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const gmailSettings = {
    host: 'smtp.gmail.com',
    port: '587',
    email: 'przmo.official@gmail.com'
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">PRZMO Admin Setup Guide</h1>
        <p className="text-gray-600">Complete setup for secure email administration</p>
      </div>

      {/* Admin Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Admin Credentials</span>
          </CardTitle>
          <CardDescription>
            These credentials are used to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Admin Email:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                  {gmailSettings.email}
                </code>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(gmailSettings.email, 'Email')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Admin Password:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                  Dhuruv099
                </code>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard('Dhuruv099', 'Password')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="w-full justify-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Admin credentials are securely configured
          </Badge>
        </CardContent>
      </Card>

      {/* Gmail App Password Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Gmail App Password Setup</span>
          </CardTitle>
          <CardDescription>
            Required for secure SMTP email sending through Gmail
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Security Notice</AlertTitle>
            <AlertDescription>
              Gmail requires App Passwords for programmatic access. Regular passwords won't work for security reasons.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step-by-step setup:
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-medium">Go to Google Account Settings</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('https://myaccount.google.com', '_blank')}
                    className="mt-2"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Open Google Account
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-medium">Enable 2-Step Verification</p>
                  <p className="text-sm text-gray-600">Navigate to Security → 2-Step Verification</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-medium">Generate App Password</p>
                  <p className="text-sm text-gray-600">Go to Security → App passwords → Mail</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <p className="font-medium">Copy the 16-character password</p>
                  <p className="text-sm text-gray-600">Use this instead of your regular Gmail password</p>
                </div>
              </div>
            </div>
          </div>

          {/* SMTP Settings */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
            <h4 className="font-medium">SMTP Configuration:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Host:</span>
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {gmailSettings.host}
                </code>
              </div>
              <div className="flex justify-between">
                <span>Port:</span>
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {gmailSettings.port}
                </code>
              </div>
              <div className="flex justify-between">
                <span>Username:</span>
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                  {gmailSettings.email}
                </code>
              </div>
              <div className="flex justify-between">
                <span>Password:</span>
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  [App Password]
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Security Features</span>
          </CardTitle>
          <CardDescription>
            Built-in security measures for the admin system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>JWT Token Authentication</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Rate Limiting Protection</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Session Management</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Encrypted Credentials</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Login Attempt Monitoring</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Secure HTTP-Only Cookies</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close Guide
          </Button>
        )}
        <Button className="bg-red-600 hover:bg-red-700">
          <Shield className="h-4 w-4 mr-2" />
          Access Admin Panel
        </Button>
      </div>
    </div>
  );
}
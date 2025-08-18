import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { 
  Server, 
  Mail, 
  Key, 
  Shield, 
  Activity, 
  Settings, 
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Users
} from 'lucide-react';

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  pool?: boolean;
  maxConnections?: number;
  maxMessages?: number;
}

interface SMTPStatus {
  isConnected: boolean;
  config: {
    host?: string;
    port?: number;
    secure?: boolean;
  } | null;
  stats: {
    totalKeys: number;
    totalEmailsSent: number;
  };
}

interface APIKey {
  keyId: string;
  domain: string;
  createdAt: string;
  lastUsed: string;
  emailCount: number;
}

export function SMTPAdminPanel() {
  const { toast } = useToast();
  const [status, setStatus] = useState<SMTPStatus | null>(null);
  const [apiKeys, setAPIKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Configuration form
  const [config, setConfig] = useState<SMTPConfig>({
    host: '',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: ''
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100
  });

  // API Key generation
  const [newKeyDomain, setNewKeyDomain] = useState('');
  
  // Test email
  const [testEmail, setTestEmail] = useState('');
  const [testApiKey, setTestApiKey] = useState('');
  const [testDomain, setTestDomain] = useState('');

  // Load status on component mount
  useEffect(() => {
    loadStatus();
    loadAPIKeys();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/smtp/status');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to load SMTP status:', error);
    }
  };

  const loadAPIKeys = async () => {
    try {
      const response = await fetch('/api/smtp/keys');
      const data = await response.json();
      
      if (data.success) {
        setAPIKeys(data.data);
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const handleConfigureSMTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/smtp/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "SMTP Configured",
          description: "SMTP server has been configured successfully",
        });
        loadStatus();
      } else {
        toast({
          title: "Configuration Failed",
          description: data.message || "Failed to configure SMTP server",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: "An error occurred while configuring SMTP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAPIKey = async () => {
    if (!newKeyDomain.trim()) {
      toast({
        title: "Domain Required",
        description: "Please enter a domain for the API key",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/smtp/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ domain: newKeyDomain.trim() })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "API Key Generated",
          description: `New API key created for ${newKeyDomain}`,
        });
        setNewKeyDomain('');
        loadAPIKeys();
        
        // Show the generated key in a modal or copy to clipboard
        navigator.clipboard.writeText(data.data.apiKey).then(() => {
          toast({
            title: "Copied to Clipboard",
            description: "The API key has been copied to your clipboard",
          });
        });
      } else {
        toast({
          title: "Generation Failed",
          description: data.message || "Failed to generate API key",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "An error occurred while generating API key",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail.trim() || !testApiKey.trim() || !testDomain.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all test email fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/smtp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testEmail: testEmail.trim(),
          apiKey: testApiKey.trim(),
          domain: testDomain.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Test Email Sent",
          description: `Test email sent successfully to ${testEmail}`,
        });
      } else {
        toast({
          title: "Test Failed",
          description: data.message || "Failed to send test email",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Test Error",
        description: "An error occurred while sending test email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/smtp/keys/${keyId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "API Key Revoked",
          description: "API key has been revoked successfully",
        });
        loadAPIKeys();
      } else {
        toast({
          title: "Revocation Failed",
          description: data.message || "Failed to revoke API key",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Revocation Error",
        description: "An error occurred while revoking API key",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-2">
        <Server className="h-6 w-6" />
        <h1 className="text-2xl font-bold">SMTP Server Administration</h1>
      </div>
      
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Server Status</span>
          </CardTitle>
          <CardDescription>Current SMTP server status and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          {status ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                {status.isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">
                  {status.isConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-blue-500" />
                <span>{status.stats.totalKeys} API Keys</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-purple-500" />
                <span>{status.stats.totalEmailsSent} Emails Sent</span>
              </div>
              
              {status.config && (
                <>
                  <div className="text-sm text-gray-600">
                    <strong>Host:</strong> {status.config.host}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Port:</strong> {status.config.port}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Secure:</strong> {status.config.secure ? 'Yes' : 'No'}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-gray-500">Loading status...</div>
          )}
        </CardContent>
      </Card>

      {/* SMTP Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>SMTP Configuration</span>
          </CardTitle>
          <CardDescription>Configure SMTP server settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConfigureSMTP} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host">SMTP Host</Label>
                <Input
                  id="host"
                  value={config.host}
                  onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                  placeholder="smtp.gmail.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={config.port}
                  onChange={(e) => setConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 587 }))}
                  min={1}
                  max={65535}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="user">Username/Email</Label>
                <Input
                  id="user"
                  type="email"
                  value={config.auth.user}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    auth: { ...prev.auth, user: e.target.value } 
                  }))}
                  placeholder="your-email@gmail.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="pass">Password/App Password</Label>
                <Input
                  id="pass"
                  type="password"
                  value={config.auth.pass}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    auth: { ...prev.auth, pass: e.target.value } 
                  }))}
                  placeholder="your-password"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.secure}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, secure: checked }))}
              />
              <Label>Use SSL/TLS</Label>
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Configuring...' : 'Configure SMTP'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* API Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>API Key Management</span>
          </CardTitle>
          <CardDescription>Generate and manage API keys for SMTP access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newKeyDomain}
              onChange={(e) => setNewKeyDomain(e.target.value)}
              placeholder="Enter domain (e.g., myapp.com)"
            />
            <Button onClick={handleGenerateAPIKey} disabled={isLoading}>
              Generate Key
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="font-medium">Existing API Keys</h3>
            {apiKeys.length > 0 ? (
              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div key={key.keyId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{key.domain}</Badge>
                        <span className="text-sm text-gray-600">{key.keyId}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {key.emailCount} emails sent • Last used: {new Date(key.lastUsed).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRevokeKey(key.keyId)}
                    >
                      Revoke
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">No API keys generated yet</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Test Email</span>
          </CardTitle>
          <CardDescription>Send a test email to verify SMTP configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="testApiKey">API Key</Label>
              <Input
                id="testApiKey"
                value={testApiKey}
                onChange={(e) => setTestApiKey(e.target.value)}
                placeholder="Your API key"
              />
            </div>
            
            <div>
              <Label htmlFor="testDomain">Domain</Label>
              <Input
                id="testDomain"
                value={testDomain}
                onChange={(e) => setTestDomain(e.target.value)}
                placeholder="your-domain.com"
              />
            </div>
            
            <Button onClick={handleTestEmail} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Test Email'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
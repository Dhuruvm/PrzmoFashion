/**
 * Performance Tracker Component - Development/Monitoring Tool
 * Provides real-time performance metrics and monitoring capabilities
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { performanceMonitor, memoryMonitor } from '@/utils/performance';
import { BarChart3, Cpu, HardDrive, Zap, RefreshCw, Download } from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: {
    used: number;
    total: number;
    limit: number;
  } | null;
  fps: number;
  networkRequests: number;
  bundleSize: string;
}

interface ComponentMetric {
  name: string;
  renderTime: number;
  renders: number;
  lastRender: number;
}

/**
 * Performance Tracker - Only shows in development mode
 * Provides insights into app performance, memory usage, and component metrics
 */
export default function PerformanceTracker() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: null,
    fps: 60,
    networkRequests: 0,
    bundleSize: 'Unknown'
  });
  const [componentMetrics, setComponentMetrics] = useState<ComponentMetric[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Only show in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Initialize performance tracking
  useEffect(() => {
    if (!isDevelopment) return;

    const updateMetrics = () => {
      // Memory usage
      const memUsage = memoryMonitor.getUsage();
      if (memUsage) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: {
            used: Math.round(memUsage.usedJSHeapSize / 1024 / 1024),
            total: Math.round(memUsage.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(memUsage.jsHeapSizeLimit / 1024 / 1024)
          }
        }));
      }

      // Performance entries
      const entries = performanceMonitor.getEntries();
      const measureEntries = entries.filter(entry => entry.entryType === 'measure');
      
      // Component render times
      const componentTimes: { [key: string]: ComponentMetric } = {};
      measureEntries.forEach(entry => {
        if (entry.name.includes('-render')) {
          const componentName = entry.name.replace('-render', '');
          if (!componentTimes[componentName]) {
            componentTimes[componentName] = {
              name: componentName,
              renderTime: 0,
              renders: 0,
              lastRender: 0
            };
          }
          componentTimes[componentName].renderTime += entry.duration;
          componentTimes[componentName].renders += 1;
          componentTimes[componentName].lastRender = entry.startTime;
        }
      });

      setComponentMetrics(Object.values(componentTimes).sort((a, b) => b.renderTime - a.renderTime));
    };

    // Update metrics every 2 seconds
    const interval = setInterval(updateMetrics, 2000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, [isDevelopment]);

  // Clear performance data
  const clearMetrics = useCallback(() => {
    performanceMonitor.clear();
    setComponentMetrics([]);
    setMetrics(prev => ({
      ...prev,
      renderTime: 0,
      networkRequests: 0
    }));
  }, []);

  // Export performance data
  const exportMetrics = useCallback(() => {
    const data = {
      metrics,
      componentMetrics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [metrics, componentMetrics]);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Stop recording
      console.log('Performance recording stopped');
    } else {
      // Start recording
      clearMetrics();
      console.log('Performance recording started');
    }
  }, [isRecording, clearMetrics]);

  // Don't render in production
  if (!isDevelopment) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-white shadow-lg"
        onClick={() => setIsVisible(!isVisible)}
        data-testid="performance-toggle"
      >
        <BarChart3 className="h-4 w-4" />
      </Button>

      {/* Performance Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 w-96 max-h-[70vh] overflow-y-auto z-50 bg-white border rounded-lg shadow-2xl">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Performance Monitor</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={isRecording ? 'destructive' : 'secondary'}>
                    {isRecording ? 'Recording' : 'Idle'}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => setIsVisible(false)}>
                    ×
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Controls */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isRecording ? 'destructive' : 'default'}
                  onClick={toggleRecording}
                  className="flex-1"
                >
                  {isRecording ? 'Stop' : 'Start'} Recording
                </Button>
                <Button size="sm" variant="outline" onClick={clearMetrics}>
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={exportMetrics}>
                  <Download className="h-3 w-3" />
                </Button>
              </div>

              {/* Memory Usage */}
              {metrics.memoryUsage && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Memory Usage</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Used:</span>
                      <span>{metrics.memoryUsage.used} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>{metrics.memoryUsage.total} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Limit:</span>
                      <span>{metrics.memoryUsage.limit} MB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(metrics.memoryUsage.used / metrics.memoryUsage.limit) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Component Metrics */}
              {componentMetrics.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Component Renders</span>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {componentMetrics.slice(0, 5).map((component, index) => (
                      <div key={component.name} className="text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-gray-600 truncate">
                            {component.name}
                          </span>
                          <Badge
                            variant={component.renderTime > 50 ? 'destructive' : 'secondary'}
                            className="text-xs px-1"
                          >
                            {component.renderTime.toFixed(1)}ms
                          </Badge>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>{component.renders} renders</span>
                          <span>Avg: {(component.renderTime / component.renders).toFixed(1)}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Tips */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Tips</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  {metrics.memoryUsage && metrics.memoryUsage.used > 100 && (
                    <div className="text-orange-600">• High memory usage detected</div>
                  )}
                  {componentMetrics.some(c => c.renderTime / c.renders > 20) && (
                    <div className="text-red-600">• Slow component renders detected</div>
                  )}
                  {componentMetrics.length === 0 && (
                    <div className="text-gray-500">• No performance data yet. Interact with the app to see metrics.</div>
                  )}
                </div>
              </div>

              {/* Real-time Stats */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                <div className="flex justify-between">
                  <span>Components tracked:</span>
                  <span>{componentMetrics.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last updated:</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
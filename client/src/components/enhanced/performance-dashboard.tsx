import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Clock, Zap, Database, Wifi, Eye, EyeOff } from "lucide-react";

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  cacheHits: number;
  networkRequests: number;
  loadTime: number;
}

const PerformanceDashboard = memo(() => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    cacheHits: 0,
    networkRequests: 0,
    loadTime: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!isMonitoring) return;

    const updateMetrics = () => {
      try {
        // Performance API metrics
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        
        // Memory usage (if available)
        const memInfo = (performance as any).memory;
        
        setMetrics({
          renderTime: navigation ? (navigation.loadEventEnd - navigation.responseStart) : 0,
          memoryUsage: memInfo ? Math.round(memInfo.usedJSHeapSize / 1024 / 1024) : 0,
          bundleSize: resources.reduce((total, resource) => {
            return total + (resource.transferSize || 0);
          }, 0) / 1024,
          cacheHits: resources.filter(r => r.transferSize === 0).length,
          networkRequests: resources.length,
          loadTime: navigation ? (navigation.loadEventEnd - navigation.fetchStart) : 0
        });
      } catch (error) {
        console.warn('Performance metrics collection failed:', error);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);
    
    return () => clearInterval(interval);
  }, [isMonitoring]);

  if (!isVisible && process.env.NODE_ENV === 'production') {
    return null;
  }

  const getPerformanceStatus = (value: number, thresholds: { good: number; ok: number }) => {
    if (value <= thresholds.good) return { status: 'good', color: 'bg-green-500' };
    if (value <= thresholds.ok) return { status: 'ok', color: 'bg-yellow-500' };
    return { status: 'poor', color: 'bg-red-500' };
  };

  const renderTimeStatus = getPerformanceStatus(metrics.renderTime, { good: 100, ok: 300 });
  const memoryStatus = getPerformanceStatus(metrics.memoryUsage, { good: 50, ok: 100 });
  const loadTimeStatus = getPerformanceStatus(metrics.loadTime, { good: 1000, ok: 2000 });

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          data-testid="button-show-performance"
        >
          <Activity className="w-4 h-4 mr-2" />
          Performance
        </Button>
      ) : (
        <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-przmo-red" />
                <CardTitle className="text-lg">Performance Monitor</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  size="sm"
                  variant={isMonitoring ? "default" : "outline"}
                  className="h-8 px-2"
                  data-testid="button-toggle-monitoring"
                >
                  {isMonitoring ? (
                    <>
                      <Zap className="w-3 h-3 mr-1" />
                      Live
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 mr-1" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsVisible(false)}
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2"
                  data-testid="button-hide-performance"
                >
                  <EyeOff className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <CardDescription>
              Real-time performance metrics for PRZMO app
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Render Performance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Render Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{metrics.renderTime.toFixed(1)}ms</span>
                  <div className={`w-2 h-2 rounded-full ${renderTimeStatus.color}`}></div>
                </div>
              </div>
              <Progress 
                value={Math.min(metrics.renderTime / 10, 100)} 
                className="h-1" 
                data-testid="progress-render-time"
              />
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Memory</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{metrics.memoryUsage}MB</span>
                  <div className={`w-2 h-2 rounded-full ${memoryStatus.color}`}></div>
                </div>
              </div>
              <Progress 
                value={Math.min(metrics.memoryUsage, 100)} 
                className="h-1" 
                data-testid="progress-memory"
              />
            </div>

            {/* Load Time */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Load Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{(metrics.loadTime / 1000).toFixed(2)}s</span>
                  <div className={`w-2 h-2 rounded-full ${loadTimeStatus.color}`}></div>
                </div>
              </div>
              <Progress 
                value={Math.min(metrics.loadTime / 50, 100)} 
                className="h-1" 
                data-testid="progress-load-time"
              />
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">Requests</span>
                </div>
                <div className="text-lg font-bold text-black" data-testid="text-network-requests">
                  {metrics.networkRequests}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">Cache Hits</span>
                </div>
                <div className="text-lg font-bold text-green-600" data-testid="text-cache-hits">
                  {metrics.cacheHits}
                </div>
              </div>
            </div>

            {/* Bundle Size */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Bundle Size</span>
                <Badge variant="outline" className="text-xs">
                  {(metrics.bundleSize / 1024).toFixed(1)}MB
                </Badge>
              </div>
            </div>

            {/* Status Legend */}
            <div className="pt-2 border-t">
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Good</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600">OK</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Poor</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

PerformanceDashboard.displayName = 'PerformanceDashboard';

export default PerformanceDashboard;
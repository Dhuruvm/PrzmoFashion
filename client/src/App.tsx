import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import LoadingScreen from "@/components/loading-screen";
import { CartProvider } from "@/components/cart-context";
import PerformanceTracker from "@/components/monitoring/performance-tracker";
import EmailStatusIndicator from "@/components/email-status-indicator";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            {isLoading ? (
              <LoadingScreen onLoadingComplete={handleLoadingComplete} />
            ) : (
              <Router />
            )}
            <PerformanceTracker />
            {/* Email Status Indicator */}
            <EmailStatusIndicator />
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

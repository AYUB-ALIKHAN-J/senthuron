
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateProposal from "./pages/CreateProposal";
import NotFound from "./pages/NotFound";
import * as React from "react";

// Create the query client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateProposal />} />
          <Route path="/create/:id" element={<CreateProposal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;

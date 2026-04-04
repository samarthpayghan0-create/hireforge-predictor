import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import QuizPage from "@/pages/QuizPage";
import VoicePage from "@/pages/VoicePage";
import DashboardPage from "@/pages/DashboardPage";
import ResumePage from "@/pages/ResumePage";
import CodingPage from "@/pages/CodingPage";
import CareerPage from "@/pages/CareerPage";
import AdminPage from "@/pages/AdminPage";
import AiRoadmapPage from "@/pages/AiRoadmapPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppProvider>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/voice" element={<VoicePage />} />
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="/coding" element={<CodingPage />} />
                  <Route path="/career" element={<CareerPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/ai-roadmap" element={<AiRoadmapPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
export default App;

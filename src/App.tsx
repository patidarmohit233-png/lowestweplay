import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Maintenance from "./pages/Maintenance.tsx";
import { MAINTENANCE_MODE } from "./config/maintenance";
import ScrollToTop from "./components/ScrollToTop";
import Admin from "./pages/AdminGate.tsx";

import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import RefundPolicy from "./pages/RefundPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import Contact from "./pages/Contact.tsx";
import WeplayRecharge from "./pages/WeplayRecharge.tsx";
import WeplayTopupLanding from "./pages/WeplayTopupLanding.tsx";
import WeplayRedPacket from "./pages/WeplayRedPacket.tsx";
import PriceList from "./pages/PriceList.tsx";
import HowToTopUp from "./pages/HowToTopUp.tsx";
import Faq from "./pages/Faq.tsx";
import TrackOrder from "./pages/TrackOrder.tsx";
import MyAccount from "./pages/MyAccount.tsx";
import TrustSafety from "./pages/TrustSafety.tsx";
import WhyUs from "./pages/WhyUs.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import BlogList from "./pages/BlogList.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import NotFound from "./pages/NotFound.tsx";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={MAINTENANCE_MODE ? <Maintenance /> : <Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-lowest-shubham" element={<Admin />} />
          <Route path="/admin-lowest" element={<Admin />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          <Route path="/lowestweplay-recharge" element={<WeplayRecharge />} />
          <Route path="/lowestweplay-recharge-topup" element={<WeplayTopupLanding />} />
          <Route path="/lowestweplay-red-packet" element={<WeplayRedPacket />} />
          <Route path="/lowestweplay-top-up-price-list" element={<PriceList />} />
          <Route path="/how-to-top-up-lowestweplay" element={<HowToTopUp />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trust-safety" element={<TrustSafety />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

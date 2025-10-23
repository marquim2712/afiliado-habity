import { useState } from "react";
import { Link } from "react-router-dom";
import { AffiliateForm, type AffiliateData } from "@/components/AffiliateForm";
import { AffiliateResult } from "@/components/AffiliateResult";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const RegisterAffiliate = () => {
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);

  const handleSuccess = (data: AffiliateData) => {
    setAffiliateData(data);
  };

  const handleNewAffiliate = () => {
    setAffiliateData(null);
  };

  return (
    <div className="min-h-screen bg-background mobile-safe-area">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground touch-target">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bebas glow-primary">Cadastrar Novo Afiliado</h1>
              <p className="text-muted-foreground font-inter text-sm sm:text-base">Preencha os dados para cadastrar um novo afiliado</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 flex flex-col items-center">
        {!affiliateData ? (
          <AffiliateForm onSuccess={handleSuccess} />
        ) : (
          <AffiliateResult data={affiliateData} onNewAffiliate={handleNewAffiliate} />
        )}
      </main>
    </div>
  );
};

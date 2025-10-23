import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import heroImage from "@/assets/capa-sympla.jpg";

const Index = () => {

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Full Screen */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
        <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bebas text-center glow-primary mb-2 leading-tight">
            HABITY FIGHT
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-bebas text-secondary glow-secondary mb-6 sm:mb-8 text-center">
            AFILIADOS
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none">
            <Link to="/cadastrar" className="w-full sm:w-auto">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bebas text-xl px-8 py-6 w-full sm:w-auto transition-all duration-300 hover:scale-105 min-h-[44px] sm:min-h-0">
                <UserPlus className="mr-2 h-6 w-6" />
                Cadastrar Afiliado
              </Button>
            </Link>
            
            <Link to="/afiliados" className="w-full sm:w-auto">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bebas text-xl px-8 py-6 w-full sm:w-auto transition-all duration-300 hover:scale-105 min-h-[44px] sm:min-h-0">
                <Users className="mr-2 h-6 w-6" />
                Ver Afiliados
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
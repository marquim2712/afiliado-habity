import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Phone, MapPin, Calendar, ExternalLink, Copy, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AffiliateData {
  id: string;
  nome: string;
  telefone: string;
  cidade: string;
  descricao: string;
  codigo: string;
  link: string;
  status: string;
  created_at: any;
  data_cadastro: any;
}

export const AffiliatesList = () => {
  const [affiliates, setAffiliates] = useState<AffiliateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAffiliates();
  }, []);

  const loadAffiliates = async () => {
    try {
      setIsLoading(true);
      const affiliatesRef = collection(db, "afiliados");
      const q = query(affiliatesRef, orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);
      
      const affiliatesData: AffiliateData[] = [];
      querySnapshot.forEach((doc) => {
        affiliatesData.push({
          id: doc.id,
          ...doc.data(),
        } as AffiliateData);
      });
      
      setAffiliates(affiliatesData);
    } catch (error) {
      console.error("Erro ao carregar afiliados:", error);
      toast.error("Erro ao carregar lista de afiliados");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao copiar ${label.toLowerCase()}`);
    }
  };

  const deleteAffiliate = async (affiliateId: string, affiliateName: string) => {
    try {
      const affiliateRef = doc(db, "afiliados", affiliateId);
      await deleteDoc(affiliateRef);
      
      // Atualizar a lista local
      setAffiliates(prev => prev.filter(affiliate => affiliate.id !== affiliateId));
      
      toast.success(`Afiliado "${affiliateName}" excluído com sucesso!`);
    } catch (error) {
      console.error("Erro ao excluir afiliado:", error);
      toast.error("Erro ao excluir afiliado. Tente novamente.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Data não disponível";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="icon" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bebas glow-primary">Lista de Afiliados</h1>
                <p className="text-muted-foreground font-inter">Gerencie todos os afiliados cadastrados</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <Users className="h-5 w-5" />
              <span className="font-bebas text-lg">{affiliates.length} afiliados</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground font-inter">Carregando afiliados...</p>
            </div>
          </div>
        ) : affiliates.length === 0 ? (
          <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm border-glow">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bebas text-foreground mb-2">Nenhum afiliado encontrado</h3>
              <p className="text-muted-foreground font-inter mb-6">
                Ainda não há afiliados cadastrados no sistema.
              </p>
              <Link to="/">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bebas text-lg px-6 py-3">
                  Cadastrar Primeiro Afiliado
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {affiliates.map((affiliate) => (
              <Card key={affiliate.id} className="bg-card/80 backdrop-blur-sm border-glow hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-bebas glow-primary">
                        {affiliate.nome}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="font-inter">{affiliate.cidade}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={affiliate.status === "ativo" ? "default" : "secondary"}
                        className={affiliate.status === "ativo" ? "bg-primary text-primary-foreground" : ""}
                      >
                        {affiliate.status}
                      </Badge>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o afiliado <strong>"{affiliate.nome}"</strong>?
                              <br />
                              <br />
                              Esta ação não pode ser desfeita e todos os dados do afiliado serão permanentemente removidos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteAffiliate(affiliate.id, affiliate.nome)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir Afiliado
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-secondary" />
                        <span className="text-sm text-muted-foreground font-inter">Telefone:</span>
                      </div>
                      <p className="font-inter text-foreground">{affiliate.telefone}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground font-inter">Descrição:</span>
                      <p className="font-inter text-foreground">{affiliate.descricao}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground font-inter">Código:</span>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-input rounded-md text-sm text-foreground font-mono">
                        {affiliate.codigo}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(affiliate.codigo, "Código")}
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground font-inter">Link de vendas:</span>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-input rounded-md text-sm text-foreground font-mono break-all">
                        {affiliate.link}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(affiliate.link, "Link")}
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => window.open(affiliate.link, "_blank")}
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-inter">
                      Cadastrado em: {formatDate(affiliate.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

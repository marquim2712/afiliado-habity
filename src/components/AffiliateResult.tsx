import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Download, Plus, FolderOpen } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import type { AffiliateData } from "./AffiliateForm";

// COLOQUE O LINK DA PASTA DO GOOGLE DRIVE AQUI
const GOOGLE_DRIVE_LINK = "SEU_LINK_AQUI";

interface AffiliateResultProps {
  data: AffiliateData;
  onNewAffiliate: () => void;
}

export const AffiliateResult = ({ data, onNewAffiliate }: AffiliateResultProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.link);
      toast.success("Link copiado com sucesso!");
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `qrcode-${data.codigo}.png`;
    link.href = url;
    link.click();
    toast.success("QR Code baixado com sucesso!");
  };

  const copyDriveFolderLink = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_DRIVE_LINK);
      toast.success("Link da pasta copiado com sucesso!");
    } catch (error) {
      toast.error("Erro ao copiar link da pasta");
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-4 sm:space-y-6 animate-fade-in mx-4 sm:mx-auto">
      <Card className="bg-card/80 backdrop-blur-sm border-glow">
        <CardHeader className="px-4 sm:px-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 mb-4">
              <Check className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bebas glow-primary">
              Afiliado Cadastrado com Sucesso!
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="space-y-4 p-4 sm:p-6 bg-background/50 rounded-lg border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground font-inter">Nome:</p>
                <p className="text-base sm:text-lg font-semibold text-foreground font-inter break-words">{data.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-inter">Código:</p>
                <p className="text-base sm:text-lg font-semibold text-secondary glow-secondary font-bebas break-all">
                  {data.codigo}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-inter">Descrição:</p>
              <p className="text-base sm:text-lg font-semibold text-foreground font-inter break-words">{data.descricao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-inter mb-2">Link de vendas:</p>
              <div className="flex gap-2">
                <code className="flex-1 p-2 sm:p-3 bg-input rounded-md text-xs sm:text-sm text-foreground break-all font-mono">
                  {data.link}
                </code>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                  className="shrink-0 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground touch-target"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-lg sm:text-xl font-bebas text-foreground">📱 QR Code Gerado</h3>
            <div
              ref={qrRef}
              className="inline-block p-4 sm:p-6 bg-white rounded-lg shadow-lg"
            >
              <QRCodeCanvas 
                value={data.link} 
                size={window.innerWidth < 640 ? 200 : 256} 
                level="H" 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={copyToClipboard}
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bebas text-lg py-6 min-h-[44px] sm:min-h-0"
            >
              <Copy className="mr-2 h-5 w-5" />
              Copiar Link
            </Button>
            <Button
              onClick={downloadQRCode}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bebas text-lg py-6 min-h-[44px] sm:min-h-0"
            >
              <Download className="mr-2 h-5 w-5" />
              Baixar QR Code
            </Button>
          </div>

          <Button
            onClick={copyDriveFolderLink}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bebas text-lg py-6 min-h-[44px] sm:min-h-0"
          >
            <FolderOpen className="mr-2 h-5 w-5" />
            Copiar Link dos Materiais de Divulgação
          </Button>

          <Button
            onClick={onNewAffiliate}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bebas text-lg py-6 min-h-[44px] sm:min-h-0"
          >
            <Plus className="mr-2 h-5 w-5" />
            Cadastrar Novo Afiliado
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
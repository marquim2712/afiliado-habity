import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface AffiliateFormProps {
  onSuccess: (data: AffiliateData) => void;
}

export interface AffiliateData {
  nome: string;
  telefone: string;
  cidade: string;
  descricao: string;
  codigo: string;
  link: string;
}

export const AffiliateForm = ({ onSuccess }: AffiliateFormProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cidade: "",
    descricao: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Função para formatar nome em maiúsculo
  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setFormData({ ...formData, nome: value });
  };

  // Função para formatar telefone com máscara brasileira
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value;
      } else if (value.length <= 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      }
    }
    
    setFormData({ ...formData, telefone: value });
  };

  const generateCode = (nome: string, descricao: string) => {
    // Transformar em minúsculas, remover espaços e caracteres especiais
    const nomeLimpo = nome.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    const descLimpa = descricao.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    return `${nomeLimpo}${descLimpa}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const codigo = generateCode(formData.nome, formData.descricao);
      const link = `https://www.sympla.com.br/evento/habity-fight/3089949?utm_source=afiliado&utm_medium=${codigo}&utm_campaign=habity-fight`;

      // Verificar unicidade pelo ID do documento (usa o codigo como ID)
      const affiliateRef = doc(db, "afiliados", codigo);
      const existing = await getDoc(affiliateRef);
      if (existing.exists()) {
        toast.error("Este código já existe. Tente outra combinação de nome e descrição.");
        return;
      }

      // Salvar no Firestore
      await setDoc(affiliateRef, {
        nome: formData.nome,
        telefone: formData.telefone,
        cidade: formData.cidade,
        descricao: formData.descricao,
        codigo,
        link,
        status: "ativo",
        created_at: serverTimestamp(),
        data_cadastro: serverTimestamp(),
        qr_url: null,
      });

      toast.success("Afiliado cadastrado com sucesso!");
      
      onSuccess({
        ...formData,
        codigo,
        link,
      });

      // Limpar formulário
      setFormData({
        nome: "",
        telefone: "",
        cidade: "",
        descricao: "",
      });
    } catch (error) {
      console.error("Erro ao cadastrar afiliado:", error);
      
      // Tratamento específico para erros do Firebase
      if (error instanceof Error) {
        if (error.message.includes("Missing or insufficient permissions")) {
          toast.error("Erro de permissão. Verifique as regras do Firestore.");
        } else if (error.message.includes("Firebase não configurado")) {
          toast.error("Firebase não configurado. Verifique as variáveis de ambiente.");
        } else {
          toast.error(`Erro: ${error.message}`);
        }
      } else {
        toast.error("Erro ao cadastrar afiliado. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm border-glow mx-4 sm:mx-auto">
      <CardHeader className="px-6">
        <CardTitle className="text-3xl font-bebas glow-primary text-center">
          Cadastrar Novo Afiliado
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-foreground font-inter text-base">
              Nome Completo
            </Label>
            <Input
              id="nome"
              type="text"
              required
              value={formData.nome}
              onChange={handleNomeChange}
              className="bg-input border-border text-foreground h-12 sm:h-10 text-base min-h-[44px] sm:min-h-0"
              placeholder="Ex: MARCOS SILVA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-foreground font-inter text-base">
              Telefone / WhatsApp
            </Label>
            <Input
              id="telefone"
              type="tel"
              required
              value={formData.telefone}
              onChange={handleTelefoneChange}
              className="bg-input border-border text-foreground h-12 sm:h-10 text-base min-h-[44px] sm:min-h-0"
              placeholder="(34) 99999-9999"
              maxLength={15}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade" className="text-foreground font-inter text-base">
              Cidade / Estado
            </Label>
            <Input
              id="cidade"
              type="text"
              required
              value={formData.cidade}
              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              className="bg-input border-border text-foreground h-12 sm:h-10 text-base min-h-[44px] sm:min-h-0"
              placeholder="Ituiutaba - MG"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-foreground font-inter text-base">
              Descrição Personalizada
            </Label>
            <Input
              id="descricao"
              type="text"
              required
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="bg-input border-border text-foreground h-12 sm:h-10 text-base min-h-[44px] sm:min-h-0"
              placeholder="Ex: 50%, vip, lote2"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bebas text-xl py-6 min-h-[44px] sm:min-h-0 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
          >
            {isLoading ? "CADASTRANDO..." : "CADASTRAR AFILIADO"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogIn, UserPlus, Users, User, Leaf, ShoppingCart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-leaf-50 to-berry-50">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-bounce-subtle"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-berry-200 rounded-full opacity-20 animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-leaf-200 rounded-full opacity-20 animate-bounce-subtle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-orange-300 rounded-full opacity-15 animate-bounce-subtle" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-fruit-gradient rounded-full mb-6">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Conéc<span className="text-green-600">tar</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema de gestão de produtos e usuários.
          </p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie seu estoque, acompanhe as vendas e expanda seus negócios com nossa plataforma.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center fruit-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-leaf-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Controle de inventário</h3>
            <p className="text-gray-600">Acompanhe seu estoque de produtos com atualizações em tempo real e alertas automatizados.</p>
          </Card>

          <Card className="p-8 text-center fruit-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 bg-leaf-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sistema de equipe</h3>
            <p className="text-gray-600">Gerencie os membros da sua equipe e as permissões dos usuários com eficiência.</p>
          </Card>

          <Card className="p-8 text-center fruit-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="w-16 h-16 bg-leaf-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Perfil do Cliente</h3>
            <p className="text-gray-600">Tenha um histórico completo de cada cliente e melhore a experiência com base em suas compras anteriores.</p>
          </Card>
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Card className="max-w-md mx-auto p-8 fruit-card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Junte-se a nós!</h2>
            <p className="text-gray-600 mb-6">
              Faça parte da Conéctar e transforme seu negócio com nossas poderosas ferramentas de gestão.
            </p>

            <div className="space-y-3">
              <Link to="/login" className="block">
                <Button className="w-full fruit-button">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>

              <Link to="/register" className="block">
                <Button variant="outline" className="w-full border-leaf-300 text-leaf-600 hover:bg-leaf-50">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar conta
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, LogOut, Edit, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  description: string;
}

interface UserStats {
  daysActive: number;
  profileUpdates: number;
  securityScore: number;
  lastLogin: Date | null;
}

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<UserStats>({
    daysActive: 0,
    profileUpdates: 0,
    securityScore: 0,
    lastLogin: null
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = (updatedUser: any) => {
    console.log('Perfil atualizado:', updatedUser);
    updateUser(updatedUser);
    setIsEditModalOpen(false);
    loadUserData(); // Recarrega os dados após atualização
  };

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const [userActivities, userStats] = await Promise.all([
        userService.getUserActivities(),
        userService.getUserStats()
      ]);
      
      setActivities(userActivities);
      setStats(userStats);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadUserData();
    }
  }, [user, navigate]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Há poucos minutos';
    if (diffInHours < 24) return `${diffInHours} hora${diffInHours > 1 ? 's' : ''} atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-leaf-50 to-berry-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-green-200 rounded-full opacity-10 animate-bounce-subtle"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-leaf-200 rounded-full opacity-10 animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Perfil</h1>
            <p className="text-gray-600 mt-2">Gerencie sua conta Conéc<span className="text-green-600">tar</span></p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-green-300 text-green-600 hover:bg-green-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-8 fruit-card animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-fruit-gradient rounded-full mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
              <Badge
                variant="secondary"
                className={`${user.role === 'admin' ? 'bg-berry-100 text-berry-800' : 'bg-leaf-100 text-leaf-800'}`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {user.role === 'admin' ? 'Administrador' : 'Usuário'}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <Mail className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Endereço de Email</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-leaf-50 rounded-lg">
                <User className="w-5 h-5 text-leaf-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">ID do Usuário</p>
                  <p className="font-medium text-gray-800">#{user.id}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                className="flex-1 fruit-button"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
              <Button variant="outline" className="flex-1 border-gray-300">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </div>
          </Card>

          <Card className="p-8 fruit-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Atividade Recente</h3>

            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500">Carregando atividades...</p>
              ) : activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-gray-800 font-medium">{activity.action}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {formatTimeAgo(activity.timestamp)}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma atividade recente</p>
              )}
            </div>
          </Card>

          <Card className="p-8 fruit-card animate-fade-in md:col-span-2" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Estatísticas da Conta</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? '...' : stats.daysActive}
                </p>
                <p className="text-gray-600">Dias Ativo</p>
              </div>

              <div className="text-center p-6 bg-leaf-50 rounded-xl">
                <div className="w-12 h-12 bg-leaf-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-leaf-600" />
                </div>
                <p className="text-2xl font-bold text-leaf-600">
                  {isLoading ? '...' : stats.profileUpdates}
                </p>
                <p className="text-gray-600">Atualizações de Perfil</p>
              </div>

              <div className="text-center p-6 bg-berry-50 rounded-xl">
                <div className="w-12 h-12 bg-berry-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-berry-600" />
                </div>
                <p className="text-2xl font-bold text-berry-600">
                  {isLoading ? '...' : `${stats.securityScore}%`}
                </p>
                <p className="text-gray-600">Pontuação de Segurança</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
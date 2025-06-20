
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Mail, Shield, LogOut, Users as UsersIcon, Edit, Trash2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import UserFilters from '../components/UserFilters';
import EditUserModal from '../components/EditUserModal';
import { userService } from '../services/userService';
import type { User } from '../contexts/AuthContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

const Users = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'admin') {
    navigate('/profile');
    return null;
  }

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const backendSortBy = sortBy === 'name' || sortBy === 'createdAt' ? sortBy : 'name';
        const users = await userService.getAllUsers(roleFilter, backendSortBy, sortOrder);
        
        const usersData: UserData[] = users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: 'active', 
          lastLogin: 'Recente', 
          createdAt: new Date().toISOString()
        }));
        setAllUsers(usersData);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de usuários",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [roleFilter, sortBy, sortOrder, toast]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(userData => {
      return userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             userData.email.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [allUsers, searchTerm]);

  const handleEditUser = (userData: UserData) => {
    setEditingUser(userData);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      await userService.updateUser(updatedUser.id, {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      });
      
      setAllUsers(prev => prev.map(u => 
        u.id === updatedUser.id 
          ? { ...u, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }
          : u
      ));
      
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido do sistema.",
      });
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o usuário",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-berry-50 via-green-50 to-leaf-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-berry-200 rounded-full opacity-10 animate-bounce-subtle"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-200 rounded-full opacity-10 animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center">
              <UsersIcon className="w-10 h-10 mr-3 text-berry-600" />
              Gerenciamento de Usuários
            </h1>
            <p className="text-gray-600 mt-2">Gerencie contas de usuário da Conéc<span className="text-green-600">tar</span></p>
          </div>
          <div className="flex gap-3">
            <Button className="fruit-button">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Usuário
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-berry-300 text-berry-600 hover:bg-berry-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 fruit-card animate-fade-in">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-berry-gradient rounded-full flex items-center justify-center mr-4">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{allUsers.length}</p>
                <p className="text-gray-600">Total de Usuários</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 fruit-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-leaf-gradient rounded-full flex items-center justify-center mr-4">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{allUsers.filter(u => u.status === 'active').length}</p>
                <p className="text-gray-600">Usuários Ativos</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 fruit-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-fruit-gradient rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{allUsers.filter(u => u.role === 'admin').length}</p>
                <p className="text-gray-600">Administradores</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 fruit-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-gradient rounded-full flex items-center justify-center mr-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{filteredUsers.length}</p>
                <p className="text-gray-600">Resultados Filtrados</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="fruit-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Todos os Usuários</h2>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">Carregando usuários...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papel</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Login</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((userData, index) => (
                    <tr key={userData.id} className="hover:bg-gray-50 transition-colors" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-fruit-gradient flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                            <div className="text-sm text-gray-500">{userData.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant="secondary" 
                          className={userData.role === 'admin' ? 'bg-berry-100 text-berry-800' : 'bg-leaf-100 text-leaf-800'}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {userData.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant="secondary" 
                          className={userData.status === 'active' ? 'bg-leaf-100 text-leaf-800' : 'bg-green-100 text-green-800'}
                        >
                          {userData.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-300 text-green-600 hover:bg-green-50"
                            onClick={() => handleEditUser(userData)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteUser(userData.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      <EditUserModal
        user={editingUser ? {
          id: editingUser.id,
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role
        } : null}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default Users;
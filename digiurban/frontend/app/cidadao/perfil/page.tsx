'use client';

import { useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { useCitizenAuth } from '@/contexts/CitizenAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Key,
  CheckCircle2,
  Shield,
  Calendar,
  Building2,
  Edit
} from 'lucide-react';

export default function PerfilPage() {
  const { citizen } = useCitizenAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: citizen?.name || '',
    email: citizen?.email || '',
    phone: citizen?.phone || '',
    street: citizen?.address?.street || '',
    number: citizen?.address?.number || '',
    complement: citizen?.address?.complement || '',
    neighborhood: citizen?.address?.neighborhood || '',
    city: citizen?.address?.city || '',
    state: citizen?.address?.state || '',
    zipCode: citizen?.address?.zipCode || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    // Aqui você integraria com o backend
    console.log('Salvando dados:', formData);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // Aqui você integraria com o backend
    console.log('Alterando senha');
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <CitizenLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e configurações</p>
        </div>

        {/* Status da Conta */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900">Conta Verificada</h3>
                <p className="text-sm text-blue-700">
                  Seu cadastro foi verificado pela administração municipal
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Status: Prata</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Pessoais */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                {!isEditing ? (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      Salvar
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <User className="h-4 w-4 text-gray-400" />
                          {citizen?.name || '-'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <div className="mt-1 flex items-center gap-2 text-gray-900">
                      <Shield className="h-4 w-4 text-gray-400" />
                      {citizen?.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || '-'}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {citizen?.email || '-'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {citizen?.phone || '-'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Logradouro</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="street"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {citizen?.address?.street || '-'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="number">Número</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="number"
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900">{citizen?.address?.number || '-'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="complement"
                          value={formData.complement}
                          onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900">{citizen?.address?.complement || '-'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="neighborhood"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900">{citizen?.address?.neighborhood || '-'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {citizen?.address?.city || '-'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900">{citizen?.address?.state || '-'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900">{citizen?.address?.zipCode || '-'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Segurança */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isChangingPassword ? (
                  <div>
                    <Label>Senha</Label>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Key className="h-4 w-4 text-gray-400" />
                        <span>••••••••</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsChangingPassword(true)}
                      >
                        Alterar Senha
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleChangePassword}>
                        Alterar Senha
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com informações */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {citizen?.createdAt ? new Date(citizen.createdAt).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Shield className="h-4 w-4" />
                    <span>Status de Verificação</span>
                  </div>
                  <p className="text-sm font-medium text-green-600">Verificado (Prata)</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Origem do Cadastro</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Administração Municipal</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                  Dicas de Segurança
                </h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Nunca compartilhe sua senha</li>
                  <li>• Use uma senha forte e única</li>
                  <li>• Mantenha seus dados atualizados</li>
                  <li>• Verifique sempre o endereço do site</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}

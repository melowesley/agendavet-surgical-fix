'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  PawPrint, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Search,
  FileText
} from 'lucide-react'

export function DashboardMobile() {
  // Mock data - replace with actual data fetching
  const stats = [
    { title: 'Pacientes', value: '24', icon: PawPrint, color: 'text-emerald-500' },
    { title: 'Tutores', value: '18', icon: Users, color: 'text-blue-500' },
    { title: 'Hoje', value: '5', icon: Calendar, color: 'text-orange-500' },
    { title: 'Pendentes', value: '3', icon: Clock, color: 'text-purple-500' },
  ]

  const todayAppointments = [
    { id: '1', petName: 'Rex', time: '09:00', type: 'Consulta', status: 'scheduled' },
    { id: '2', petName: 'Luna', time: '10:30', type: 'Vacina', status: 'confirmed' },
    { id: '3', petName: 'Max', time: '14:00', type: 'Banho/Tosa', status: 'scheduled' },
  ]

  const recentPets = [
    { id: '1', name: 'Rex', breed: 'Labrador', owner: 'João S.', species: 'dog' },
    { id: '2', name: 'Luna', breed: 'Siames', owner: 'Maria S.', species: 'cat' },
    { id: '3', name: 'Max', breed: 'Poodle', owner: 'Pedro O.', species: 'dog' },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      scheduled: { variant: 'secondary', label: 'Agendado' },
      confirmed: { variant: 'default', label: 'Confirmado' },
      'in-progress': { variant: 'outline', label: 'Em Andamento' },
      completed: { variant: 'secondary', label: 'Concluído' },
      cancelled: { variant: 'destructive', label: 'Cancelado' },
    }
    const config = variants[status] || { variant: 'secondary' as const, label: status }
    return <Badge variant={config.variant} className={status === 'in-progress' ? "border-emerald-500 text-emerald-500" : ""}>{config.label}</Badge>
  }

  const getPetIcon = (species: string) => {
    return species === 'dog' ? '🐕' : species === 'cat' ? '🐈' : '🐾'
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button className="flex-1 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
          <Plus className="size-5 mr-2" />
          Novo Agendamento
        </Button>
        <Button variant="outline" className="flex-1 h-14 border-emerald-500/30 text-emerald-500">
          <Search className="size-5 mr-2" />
          Buscar
        </Button>
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="size-5 text-emerald-500" />
            Agenda de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="size-12 text-emerald-500/50 mb-3" />
              <p className="text-sm font-medium">Nenhum agendamento hoje</p>
            </div>
          ) : (
            todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                    <span className="text-lg">{getPetIcon('dog')}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{appointment.petName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(appointment.status)}
                  <Badge variant="outline" className="text-xs">
                    {appointment.type}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Pets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <PawPrint className="size-5 text-emerald-500" />
            Pacientes Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentPets.map((pet) => (
            <div
              key={pet.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                  <span className="text-lg">{getPetIcon(pet.species)}</span>
                </div>
                <div>
                  <p className="font-semibold">{pet.name}</p>
                  <p className="text-sm text-muted-foreground">{pet.breed} • {pet.owner}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs uppercase">
                {pet.species === 'dog' ? 'Cão' : 'Gato'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

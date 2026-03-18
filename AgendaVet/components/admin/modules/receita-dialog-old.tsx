'use client'

import { useState } from 'react'
import { usePet, useOwner } from '@/lib/data-store'
import { BaseAttendanceDialog } from '../shared/base-attendance-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'

interface ReceitaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    petId: string
    petName: string
}

export function ReceitaDialog({ open, onOpenChange, petId, petName }: ReceitaDialogProps) {
    const { pet } = usePet(petId)
    const { owner } = useOwner(pet?.profileId || '')

    const [medicamento, setMedicamento] = useState('')
    const [dosagem, setDosagem] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [instrucoes, setInstrucoes] = useState('')
    const [veterinarian, setVeterinarian] = useState('Dr. Cleyton Chaves')
    const [crmv, setCrmv] = useState('12345-SP')
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        // TODO: Implementar salvamento na tabela medical_records
        setTimeout(() => {
            setLoading(false)
            onOpenChange(false)
        }, 1000)
    }

    const previewContent = (
        <div className="space-y-8">
            {/* Identificação do Emitente */}
            <div className="border-2 border-black p-6">
                <h2 className="text-center font-bold text-2xl mb-6">NOTIFICAÇÃO DE RECEITA ESPECIAL</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="font-bold text-lg">Nome do Veterinário:</p>
                        <p className="text-base">{veterinarian}</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">CRMV:</p>
                        <p className="text-base">{crmv}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <p className="font-bold text-lg">Endereço da Clínica:</p>
                    <p className="text-base">AgendaVet Medical Unit v2.0</p>
                </div>
            </div>

            {/* Dados do Paciente */}
            <div className="border-2 border-black p-6">
                <h3 className="font-bold text-xl mb-6">DADOS DO PACIENTE</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="font-bold text-lg">Nome do Animal:</p>
                        <p className="text-base">{petName}</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">Espécie:</p>
                        <p className="text-base">{pet?.species === 'dog' ? 'Canina' : pet?.species === 'cat' ? 'Felina' : 'Animal'}</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">Raça:</p>
                        <p className="text-base">{pet?.breed}</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">Idade:</p>
                        <p className="text-base">{pet ? Math.floor((new Date().getTime() - new Date(pet.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365)) + ' anos' : ''}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <p className="font-bold text-lg">Proprietário:</p>
                    <p className="text-base">{owner?.fullName || 'Proprietário S/R'}</p>
                </div>
            </div>

            {/* Prescrição */}
            <div className="border-2 border-black p-6">
                <h3 className="font-bold text-xl mb-6">PRESCRIÇÃO</h3>
                <div className="space-y-4">
                    <p className="text-base"><span className="font-bold text-lg">Medicamento:</span> {medicamento || "Medicamento a ser prescrito..."}</p>
                    <p className="text-base"><span className="font-bold text-lg">Dosagem:</span> {dosagem || "Dosagem recomendada..."}</p>
                    <p className="text-base"><span className="font-bold text-lg">Quantidade:</span> {quantidade || "Quantidade total..."}</p>
                    <p className="text-base"><span className="font-bold text-lg">Instruções:</span></p>
                    <div className="mt-2 text-base leading-relaxed">
                        {instrucoes || "Instruções detalhadas de uso, frequência e duração do tratamento..."}
                    </div>
                </div>
            </div>

            {/* Assinatura */}
            <div className="mt-auto pt-8 text-center">
                <div className="border-t-2 border-black w-80 mx-auto mb-6"></div>
                <p className="font-bold text-lg">{veterinarian}</p>
                <p className="text-base">CRMV {crmv}</p>
                <p className="text-sm mt-4">Data: {format(new Date(), 'dd/MM/yyyy')}</p>
            </div>
        </div>
    )

    return (
        <BaseAttendanceDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Receita Controlada"
            previewContent={previewContent}
            onSave={handleSave}
            saveLabel="Salvar Receita"
            isSaving={loading}
            printTitle={`Receita_${petName}_${format(new Date(), 'dd_MM_yyyy')}`}
        >
            <div className="space-y-4">
                <div>
                    <Label className="text-sm font-bold">Medicamento *</Label>
                    <Input
                        value={medicamento}
                        onChange={(e) => setMedicamento(e.target.value)}
                        placeholder="Nome do medicamento controlado"
                        className="h-9"
                    />
                </div>
                <div>
                    <Label className="text-sm font-bold">Dosagem</Label>
                    <Input
                        value={dosagem}
                        onChange={(e) => setDosagem(e.target.value)}
                        placeholder="Ex: 1 comprimido a cada 12 horas"
                        className="h-9"
                    />
                </div>
                <div>
                    <Label className="text-sm font-bold">Quantidade</Label>
                    <Input
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        placeholder="Ex: 20 comprimidos"
                        className="h-9"
                    />
                </div>
                <div>
                    <Label className="text-sm font-bold">Instruções de Uso</Label>
                    <Textarea
                        value={instrucoes}
                        onChange={(e) => setInstrucoes(e.target.value)}
                        placeholder="Instruções detalhadas para o proprietário"
                        className="min-h-[80px]"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-bold">Veterinário</Label>
                        <Input
                            value={veterinarian}
                            onChange={(e) => setVeterinarian(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-bold">CRMV</Label>
                        <Input
                            value={crmv}
                            onChange={(e) => setCrmv(e.target.value)}
                            className="h-9"
                        />
                    </div>
                </div>
            </div>
        </BaseAttendanceDialog>
    )
}

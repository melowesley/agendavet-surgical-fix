'use client'

import { useState, useEffect } from 'react'
import { usePet, useOwner } from '@/lib/data-store'
import { BaseAttendanceDialog } from '../shared/base-attendance-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

interface CirurgiaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onBack?: () => void
    petId: string
    petName: string
}

const TIPOS_ANESTESIA = [
    'Anestesia geral inalatória',
    'Anestesia geral intravenosa (TIVA)',
    'Anestesia dissociativa',
    'Bloqueio regional / epidural',
    'Sedação + anestesia local',
]

const MATERIAIS_SUTURA = [
    'Nylon', 'Poliglactina 910 (Vicryl)', 'Polidioxanona (PDS)',
    'Ácido poliglicólico', 'Catgut cromado', 'Fio de aço'
]

export function CirurgiaDialog({ open, onOpenChange, onBack, petId, petName }: CirurgiaDialogProps) {
    const { pet } = usePet(petId)
    const { owner } = useOwner(pet?.profileId || '')

    // Estado do formulário
    const [procedimento, setProcedimento] = useState('')
    const [dataCirurgia, setDataCirurgia] = useState(format(new Date(), 'dd/MM/yyyy'))
    const [horario, setHorario] = useState('08:00')
    const [tipoAnestesia, setTipoAnestesia] = useState('')
    const [anestesista, setAnestesista] = useState('Dr. Cleyton Chaves')
    const [cirurgiao, setCirurgiao] = useState('Dr. Cleyton Chaves')
    const [auxiliares, setAuxiliares] = useState('')
    const [tecnicaCirurgica, setTecnicaCirurgica] = useState('')
    const [descricao, setDescricao] = useState('')
    const [posOperatorio, setPosOperatorio] = useState('')
    const [termoConsentimento, setTermoConsentimento] = useState(false)

    // Estado de materiais e fármacos (ERP)
    const [materiais, setMateriais] = useState([
        { nome: '', quantidade: '', valor: '' }
    ])
    const [farmacos, setFarmacos] = useState([
        { nome: '', dosagem: '', quantidade: '', valor: '' }
    ])

    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        // TODO: Implementar salvamento na tabela medical_records
        setTimeout(() => {
            setLoading(false)
            onOpenChange(false)
        }, 1000)
    }

    const addMaterial = () => {
        setMateriais([...materiais, { nome: '', quantidade: '', valor: '' }])
    }

    const removeMaterial = (index: number) => {
        setMateriais(materiais.filter((_, i) => i !== index))
    }

    const updateMaterial = (index: number, field: string, value: string) => {
        const updated = [...materiais]
        updated[index] = { ...updated[index], [field]: value }
        setMateriais(updated)
    }

    const addFarmaco = () => {
        setFarmacos([...farmacos, { nome: '', dosagem: '', quantidade: '', valor: '' }])
    }

    const removeFarmaco = (index: number) => {
        setFarmacos(farmacos.filter((_, i) => i !== index))
    }

    const updateFarmaco = (index: number, field: string, value: string) => {
        const updated = [...farmacos]
        updated[index] = { ...updated[index], [field]: value }
        setFarmacos(updated)
    }

    const previewContent = (
        <div className="space-y-8">
            {/* Cabeçalho do Relatório Cirúrgico */}
            <div className="text-center border-b-2 border-black pb-6">
                <h1 className="text-3xl font-bold mb-2">RELATÓRIO CIRÚRGICO</h1>
                <p className="text-lg">AgendaVet Medical Unit v2.0</p>
                <p className="text-sm text-gray-600">Clínica Veterinária Especializada</p>
            </div>

            {/* Dados do Paciente */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h3 className="font-bold text-xl mb-4">DADOS DO PACIENTE</h3>
                    <div className="space-y-2">
                        <p><span className="font-bold">Nome:</span> {petName}</p>
                        <p><span className="font-bold">Espécie:</span> {pet?.species === 'dog' ? 'Canina' : pet?.species === 'cat' ? 'Felina' : 'Animal'}</p>
                        <p><span className="font-bold">Raça:</span> {pet?.breed}</p>
                        <p><span className="font-bold">Idade:</span> {pet ? Math.floor((new Date().getTime() - new Date(pet.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365)) + ' anos' : ''}</p>
                        <p><span className="font-bold">Proprietário:</span> {owner?.fullName || 'Proprietário S/R'}</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-xl mb-4">DADOS DA CIRURGIA</h3>
                    <div className="space-y-2">
                        <p><span className="font-bold">Procedimento:</span> {procedimento || 'A ser definido'}</p>
                        <p><span className="font-bold">Data:</span> {dataCirurgia}</p>
                        <p><span className="font-bold">Horário:</span> {horario}</p>
                        <p><span className="font-bold">Tipo de Anestesia:</span> {tipoAnestesia || 'A ser definido'}</p>
                    </div>
                </div>
            </div>

            {/* Equipe Cirúrgica */}
            <div>
                <h3 className="font-bold text-xl mb-4">EQUIPE CIRÚRGICA</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="font-bold">Cirurgião:</p>
                        <p>{cirurgiao}</p>
                    </div>
                    <div>
                        <p className="font-bold">Anestesista:</p>
                        <p>{anestesista}</p>
                    </div>
                    <div>
                        <p className="font-bold">Auxiliares:</p>
                        <p>{auxiliares || 'A ser definido'}</p>
                    </div>
                </div>
            </div>

            {/* Técnica Operatória */}
            <div>
                <h3 className="font-bold text-xl mb-4">TÉCNICA OPERATÓRIA</h3>
                <div className="border-2 border-black p-4 min-h-[150px]">
                    <p className="text-base leading-relaxed">
                        {tecnicaCirurgica || 'Descrição detalhada da técnica cirúrgica utilizada...'}
                    </p>
                </div>
            </div>

            {/* Descrição do Procedimento */}
            <div>
                <h3 className="font-bold text-xl mb-4">DESCRIÇÃO DO PROCEDIMENTO</h3>
                <div className="border-2 border-black p-4 min-h-[150px]">
                    <p className="text-base leading-relaxed">
                        {descricao || 'Descrição detalhada do procedimento cirúrgico realizado...'}
                    </p>
                </div>
            </div>

            {/* Pós-Operatório */}
            <div>
                <h3 className="font-bold text-xl mb-4">CUIDADOS PÓS-OPERATÓRIOS</h3>
                <div className="border-2 border-black p-4 min-h-[100px]">
                    <p className="text-base leading-relaxed">
                        {posOperatorio || 'Instruções detalhadas para o período pós-operatório...'}
                    </p>
                </div>
            </div>

            {/* Materiais Utilizados */}
            {materiais.some(m => m.nome) && (
                <div>
                    <h3 className="font-bold text-xl mb-4">MATERIAIS UTILIZADOS</h3>
                    <div className="border-2 border-black p-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Material</th>
                                    <th className="text-center py-2">Quantidade</th>
                                    <th className="text-right py-2">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materiais.filter(m => m.nome).map((material, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-2">{material.nome}</td>
                                        <td className="text-center py-2">{material.quantidade}</td>
                                        <td className="text-right py-2">{material.valor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Fármacos Utilizados */}
            {farmacos.some(f => f.nome) && (
                <div>
                    <h3 className="font-bold text-xl mb-4">FÁRMACOS UTILIZADOS</h3>
                    <div className="border-2 border-black p-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Fármaco</th>
                                    <th className="text-center py-2">Dosagem</th>
                                    <th className="text-center py-2">Quantidade</th>
                                    <th className="text-right py-2">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {farmacos.filter(f => f.nome).map((farmaco, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-2">{farmaco.nome}</td>
                                        <td className="text-center py-2">{farmaco.dosagem}</td>
                                        <td className="text-center py-2">{farmaco.quantidade}</td>
                                        <td className="text-right py-2">{farmaco.valor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Assinaturas */}
            <div className="mt-12 pt-8 border-t-2 border-black">
                <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                        <div className="border-t-2 border-black w-64 mx-auto mb-2"></div>
                        <p className="font-bold">{cirurgiao}</p>
                        <p className="text-sm">Cirurgião Responsável</p>
                        <p className="text-xs mt-2">CRMV: 12345-SP</p>
                    </div>
                    <div className="text-center">
                        <div className="border-t-2 border-black w-64 mx-auto mb-2"></div>
                        <p className="font-bold">{owner?.fullName || 'Proprietário'}</p>
                        <p className="text-sm">Proprietário Responsável</p>
                        <p className="text-xs mt-2">Data: {format(new Date(), 'dd/MM/yyyy')}</p>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <BaseAttendanceDialog
            open={open}
            onOpenChange={onOpenChange}
            onBack={onBack}
            title="Relatório Cirúrgico"
            previewContent={previewContent}
            onSave={handleSave}
            saveLabel="Salvar Cirurgia"
            isSaving={loading}
            printTitle={`Relatorio_Cirurgico_${petName}_${format(new Date(), 'dd_MM_yyyy')}`}
        >
            <div className="space-y-6">
                {/* Dados Básicos */}
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-bold">Procedimento Cirúrgico *</Label>
                        <Input
                            value={procedimento}
                            onChange={(e) => setProcedimento(e.target.value)}
                            placeholder="Ex: Ovariohisterectomia"
                            className="h-9"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-bold">Data *</Label>
                            <Input
                                value={dataCirurgia}
                                onChange={(e) => setDataCirurgia(e.target.value)}
                                placeholder="dd/mm/yyyy"
                                className="h-9"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-bold">Horário *</Label>
                            <Input
                                value={horario}
                                onChange={(e) => setHorario(e.target.value)}
                                placeholder="HH:mm"
                                className="h-9"
                            />
                        </div>
                    </div>
                </div>

                {/* Anestesia */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Anestesia</h3>
                    <div>
                        <Label className="text-sm font-bold">Tipo de Anestesia</Label>
                        <Select value={tipoAnestesia} onValueChange={setTipoAnestesia}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {TIPOS_ANESTESIA.map((tipo) => (
                                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-bold">Anestesista</Label>
                            <Input
                                value={anestesista}
                                onChange={(e) => setAnestesista(e.target.value)}
                                className="h-9"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-bold">Cirurgião</Label>
                            <Input
                                value={cirurgiao}
                                onChange={(e) => setCirurgiao(e.target.value)}
                                className="h-9"
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-bold">Auxiliares</Label>
                        <Input
                            value={auxiliares}
                            onChange={(e) => setAuxiliares(e.target.value)}
                            placeholder="Nome dos auxiliares cirúrgicos"
                            className="h-9"
                        />
                    </div>
                </div>

                {/* Técnica e Descrição */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Detalhes do Procedimento</h3>
                    <div>
                        <Label className="text-sm font-bold">Técnica Cirúrgica</Label>
                        <Textarea
                            value={tecnicaCirurgica}
                            onChange={(e) => setTecnicaCirurgica(e.target.value)}
                            placeholder="Descreva a técnica cirúrgica utilizada"
                            className="min-h-[100px]"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-bold">Descrição do Procedimento</Label>
                        <Textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descrição detalhada do procedimento realizado"
                            className="min-h-[120px]"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-bold">Cuidados Pós-Operatórios</Label>
                        <Textarea
                            value={posOperatorio}
                            onChange={(e) => setPosOperatorio(e.target.value)}
                            placeholder="Instruções para o período pós-operatório"
                            className="min-h-[80px]"
                        />
                    </div>
                </div>

                {/* Materiais (ERP) */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Lançamento de Materiais
                    </h3>
                    {materiais.map((material, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2">
                            <Input
                                value={material.nome}
                                onChange={(e) => updateMaterial(index, 'nome', e.target.value)}
                                placeholder="Material"
                                className="h-9"
                            />
                            <Input
                                value={material.quantidade}
                                onChange={(e) => updateMaterial(index, 'quantidade', e.target.value)}
                                placeholder="Qtd"
                                className="h-9"
                            />
                            <Input
                                value={material.valor}
                                onChange={(e) => updateMaterial(index, 'valor', e.target.value)}
                                placeholder="Valor"
                                className="h-9"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeMaterial(index)}
                                className="h-9"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addMaterial}
                        className="w-full h-9"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Material
                    </Button>
                </div>

                {/* Fármacos (ERP) */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Lançamento de Fármacos
                    </h3>
                    {farmacos.map((farmaco, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2">
                            <Input
                                value={farmaco.nome}
                                onChange={(e) => updateFarmaco(index, 'nome', e.target.value)}
                                placeholder="Fármaco"
                                className="h-9"
                            />
                            <Input
                                value={farmaco.dosagem}
                                onChange={(e) => updateFarmaco(index, 'dosagem', e.target.value)}
                                placeholder="Dosagem"
                                className="h-9"
                            />
                            <Input
                                value={farmaco.quantidade}
                                onChange={(e) => updateFarmaco(index, 'quantidade', e.target.value)}
                                placeholder="Qtd"
                                className="h-9"
                            />
                            <Input
                                value={farmaco.valor}
                                onChange={(e) => updateFarmaco(index, 'valor', e.target.value)}
                                placeholder="Valor"
                                className="h-9"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeFarmaco(index)}
                                className="h-9"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addFarmaco}
                        className="w-full h-9"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Fármaco
                    </Button>
                </div>

                {/* Termo de Consentimento */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="consentimento"
                            checked={termoConsentimento}
                            onCheckedChange={(checked) => setTermoConsentimento(checked as boolean)}
                        />
                        <Label htmlFor="consentimento" className="text-sm">
                            Termo de consentimento assinado pelo proprietário
                        </Label>
                    </div>
                </div>
            </div>
        </BaseAttendanceDialog>
    )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import DOMPurify from 'dompurify'
import 'react-quill-new/dist/quill.snow.css'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div className="h-[150px] w-full animate-pulse bg-muted rounded-md" /> })
import { useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Stethoscope, Save, ArrowLeft, Plus, History, Printer, PawPrint, DollarSign, Trash2, Clock, Eye, EyeOff, Folder, Image as ImageIcon, Video, Camera } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useReactToPrint } from 'react-to-print'
import { usePet, useOwner, useMedicalRecords, useAppointments } from '@/lib/data-store'
import { format } from 'date-fns'

interface PetDetailContentProps {
    petId: string
}

export function PetDetailContent({ petId }: PetDetailContentProps) {
    const { pet, isLoading: petLoading } = usePet(petId)
    const { owner, isLoading: ownerLoading } = useOwner(pet?.ownerId || '')
    const { records } = useMedicalRecords(petId)
    const { appointments } = useAppointments()

    const isFemale = pet?.gender === 'Fêmea'
    const themeColor = {
        bg: isFemale ? 'bg-pink-600' : 'bg-blue-600',
        bgHover: isFemale ? 'hover:bg-pink-700' : 'hover:bg-blue-700',
        bgGhost: isFemale ? 'bg-pink-500/10' : 'bg-blue-500/10',
        bgLight: isFemale ? 'bg-pink-50' : 'bg-blue-50',
        text: isFemale ? 'text-pink-600' : 'text-blue-600',
        border: isFemale ? 'border-pink-200' : 'border-blue-200',
        borderLight: isFemale ? 'border-pink-100' : 'border-blue-100',
    }

    const [anamnese, setAnamnese] = useState('')
    const [queixa, setQueixa] = useState('')
    const [exameFisico, setExameFisico] = useState('')
    const [tratamento, setTratamento] = useState('')
    const [baseValue, setBaseValue] = useState('0.00')
    const [services, setServices] = useState<{ id: string, name: string, value: number }[]>([])
    const [loading, setLoading] = useState(false)
    const [showHistory, setShowHistory] = useState(false)

    const printRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({ 
        contentRef: printRef, 
        documentTitle: `Consulta_${pet.name}_${format(new Date(), 'dd_MM_yyyy')}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 15mm;
            }
            @media print {
                body { 
                    font-size: 11px;
                    line-height: 1.2;
                }
                .print-content {
                    width: 100%;
                    max-width: 210mm;
                    min-height: 297mm;
                    padding: 15mm;
                    box-sizing: border-box;
                }
            }
        `
    })

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video'],
        ],
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const { data: record, error } = await supabase
                .from('medical_records')
                .insert([{
                    pet_id: petId,
                    type: 'consulta',
                    anamnese: DOMPurify.sanitize(anamnese),
                    queixa_principal: DOMPurify.sanitize(queixa),
                    exame_fisico: DOMPurify.sanitize(exameFisico),
                    tratamento: DOMPurify.sanitize(tratamento),
                    base_consulta: parseFloat(baseValue),
                    services: services,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single()

            if (error) throw error

            toast.success('Consulta registrada com sucesso!')
            // mutate('medical_records')
            handleClear()
            // onOpenChange(false)
        } catch (error) {
            console.error('Error saving consultation:', error)
            toast.error('Erro ao salvar consulta')
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        setAnamnese('')
        setQueixa('')
        setExameFisico('')
        setTratamento('')
        setBaseValue('0.00')
        setServices([])
    }

    const addService = () => {
        setServices([...services, { id: Date.now().toString(), name: '', value: 0 }])
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-screen sm:max-w-none !max-w-none h-screen max-h-none rounded-none p-0 flex flex-col overflow-hidden border-none">
                <DialogHeader className="p-4 md:p-6 border-b border-border/50 bg-white flex flex-row items-center justify-between shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-slate-900">Consulta Clínica</DialogTitle>
                            <DialogDescription className="text-sm text-slate-600">
                                Registro de atendimento veterinário para {pet.name}
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
                            {showHistory ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handlePrint}>
                            <Printer className="size-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
                            {/* Formulário */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="queixa" className="text-sm font-medium text-slate-700">Queixa Principal</Label>
                                        <Textarea
                                            id="queixa"
                                            value={queixa}
                                            onChange={(e) => setQueixa(e.target.value)}
                                            placeholder="Descreva a queixa principal do paciente..."
                                            className="resize-none h-16 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="anamnese" className="text-sm font-medium text-slate-700">Anamnese</Label>
                                        <div className="border rounded-md">
                                            <ReactQuill
                                                theme="snow"
                                                value={anamnese}
                                                onChange={setAnamnese}
                                                modules={modules}
                                                placeholder="Histórico clínico completo do paciente..."
                                                className="bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="exame" className="text-sm font-medium text-slate-700">Exame Físico</Label>
                                        <div className="border rounded-md">
                                            <ReactQuill
                                                theme="snow"
                                                value={exameFisico}
                                                onChange={setExameFisico}
                                                modules={modules}
                                                placeholder="Resultados do exame físico..."
                                                className="bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="tratamento" className="text-sm font-medium text-slate-700">Tratamento</Label>
                                        <div className="border rounded-md">
                                            <ReactQuill
                                                theme="snow"
                                                value={tratamento}
                                                onChange={setTratamento}
                                                modules={modules}
                                                placeholder="Conduta e tratamento prescritos..."
                                                className="bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="base" className="text-sm font-medium text-slate-700">Valor da Consulta</Label>
                                            <Input
                                                id="base"
                                                type="number"
                                                value={baseValue}
                                                onChange={(e) => setBaseValue(e.target.value)}
                                                placeholder="0.00"
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-slate-700">Serviços Adicionais</Label>
                                        {services.map((service, idx) => (
                                            <div key={service.id} className="flex gap-2 items-center">
                                                <Input
                                                    value={service.name}
                                                    onChange={(e) => {
                                                        const newServices = [...services]
                                                        newServices[idx].name = e.target.value
                                                        setServices(newServices)
                                                    }}
                                                    placeholder="Nome do serviço"
                                                    className="h-8 text-xs flex-1"
                                                />
                                                <Input
                                                    type="number"
                                                    value={service.value}
                                                    onChange={(e) => {
                                                        const newServices = [...services]
                                                        newServices[idx].value = parseFloat(e.target.value) || 0
                                                        setServices(newServices)
                                                    }}
                                                    className="h-8 text-xs w-16"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-7 p-0 text-destructive"
                                                    onClick={() => setServices(services.filter((_, i) => i !== idx))}
                                                >
                                                    <Trash2 className="size-3" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={addService}
                                            className="w-full h-8 text-xs"
                                        >
                                            <Plus className="size-3 mr-1" />
                                            Adicionar Serviço
                                        </Button>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button onClick={handleSave} disabled={loading} className={`flex-1 h-12 text-lg font-medium ${themeColor.bg} ${themeColor.bgHover} text-white shadow-lg rounded-xl`}>
                                            <Save className="size-5 mr-2" />
                                            {loading ? 'Salvando...' : 'Salvar Consulta'}
                                        </Button>

                                        <Button variant="outline" className="h-12 px-4 text-sm font-medium" onClick={handlePrint}>
                                            <Printer className="size-4 mr-2" />
                                            Visualizar
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Preview/Print Area */}
                            <div className="hidden lg:flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-lg font-semibold ${themeColor.text}`}>Visualização do Documento</h3>
                                    <div className="text-sm text-slate-500">
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="size-3" />
                                            Formato A4 • Margens ajustadas
                                        </span>
                                    </div>
                                </div>

                                <div
                                    ref={printRef}
                                    className={`w-full max-w-[650px] min-h-[920px] bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm border p-12 flex flex-col text-slate-900 ${themeColor.borderLight} border-t-8 ${themeColor.border}`}
                                >
                                    {/* Header */}
                                    <div className={`border-b-2 pb-6 mb-8 flex justify-between items-end ${themeColor.border}`}>
                                        <div>
                                            <h2 className={`text-2xl font-bold uppercase tracking-widest ${themeColor.text}`}>Ficha de Consulta Clínica</h2>
                                            <p className="text-[10px] opacity-70 mt-1 uppercase">Relatório de Atendimento Veterinário</p>
                                        </div>
                                        <div className={`text-right ${themeColor.text}`}>
                                            <Stethoscope className="size-10 ml-auto mb-1 opacity-20" />
                                            <p className="text-[8px] font-bold text-slate-400">AgendaVet Medical Unit v2.0</p>
                                        </div>
                                    </div>

                                    {/* Patient Info */}
                                    <div className="border border-slate-200 p-5 mb-8 rounded-sm bg-slate-50/30">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">DADOS DO PACIENTE</p>
                                                <div className="space-y-0.5 border-t border-slate-200 pt-1 text-[10px]">
                                                    <p><span className="font-bold w-12 inline-block text-slate-700">Paciente:</span> {pet.name}</p>
                                                    <p><span className="font-bold w-12 inline-block text-slate-700">Espécie:</span> {pet.species === 'dog' ? 'Canina' : pet.species === 'cat' ? 'Felina' : 'Animal'} | {pet.breed}</p>
                                                    <p><span className="font-bold w-12 inline-block text-slate-700">Peso:</span> {pet.weight || '-'} kg | Sexo: {pet.gender}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 border-l border-slate-200 pl-6 text-[10px]">
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">DADOS DO TUTOR</p>
                                                <div className="space-y-0.5 border-t border-slate-200 pt-1 text-[10px]">
                                                    <p><span className="font-bold text-slate-700">Tutor:</span> {owner?.fullName || 'Proprietário S/R'}</p>
                                                    <p>{owner?.phone || 'Sem contato registrado'}</p>
                                                    <p className="text-[11px] font-bold text-slate-800 mt-2">Data: {format(new Date(), 'dd/MM/yyyy')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clinical Content */}
                                    <div className="flex-1 space-y-8 text-slate-800">
                                        <section className="border-l-4 border-slate-300 pl-4 py-1">
                                            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${themeColor.text} flex items-center gap-2`}>
                                                <span className="size-1.5 rounded-full bg-slate-400"></span> Anamnese e Queixa Principal
                                            </h3>
                                            <p className="text-[13px] font-bold mb-2 text-slate-900 leading-tight">"{queixa || "O paciente apresenta..."}"</p>
                                            <div className="text-[11px] leading-relaxed prose prose-sm max-w-none text-slate-700 break-words break-all whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(anamnese || "Histórico clínico inicial...") }} />
                                        </section>

                                        <section className="border-l-4 border-slate-300 pl-4 py-1">
                                            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${themeColor.text} flex items-center gap-2`}>
                                                <span className="size-1.5 rounded-full bg-slate-400"></span> Exames Físicos e Clínicos
                                            </h3>
                                            <div className="text-[11px] leading-relaxed prose prose-sm max-w-none text-slate-700 break-words break-all whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(exameFisico || "Mucosas, TPC, FC, FR...") }} />
                                        </section>

                                        <section className="border-l-4 border-slate-300 pl-4 py-1">
                                            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${themeColor.text} flex items-center gap-2`}>
                                                <span className="size-1.5 rounded-full bg-slate-400"></span> Conduta e Recomendações
                                            </h3>
                                            <div className="text-[11px] leading-relaxed prose prose-sm max-w-none text-slate-700 break-words break-all whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tratamento || "Conduta médica prescrita...") }} />
                                        </section>

                                        {/* Services */}
                                        {(parseFloat(baseValue) > 0 || services.length > 0) && (
                                            <section className={`p-5 rounded-sm bg-white border border-slate-400 relative overflow-hidden`}>
                                                <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${themeColor.text} flex items-center gap-2`}>
                                                    <span className="size-1.5 rounded-full bg-slate-400"></span> Serviços e Valores
                                                </h3>
                                                <div className="space-y-2">
                                                    {baseValue && (
                                                        <div className="flex justify-between items-center py-1 border-b border-slate-200">
                                                            <span className="text-xs font-medium">Consulta Base</span>
                                                            <span className="text-xs font-bold">R$ {parseFloat(baseValue).toFixed(2)}</span>
                                                        </div>
                                                    )}
                                                    {services.map((service, idx) => (
                                                        <div key={service.id} className="flex justify-between items-center py-1 border-b border-slate-200 last:border-0">
                                                            <span className="text-xs">{service.name}</span>
                                                            <span className="text-xs font-bold">R$ {service.value.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={`pt-2 border-t ${themeColor.border} flex justify-between items-center text-xs font-bold ${themeColor.text}`}>
                                                    <span>Total:</span>
                                                    <span>R$ {(parseFloat(baseValue) + services.reduce((acc, s) => acc + s.value, 0)).toFixed(2)}</span>
                                                </div>
                                            </section>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-auto pt-12 flex justify-between items-end border-t border-slate-100 italic">
                                        <div className="text-[8px] opacity-40 leading-tight max-w-[200px]">
                                            Relatório gerado via AgendaVet. As informações contidas neste documento são de responsabilidade do médico veterinário.
                                        </div>
                                        <div className="text-center w-48">
                                            <div className={`text-xs font-bold ${themeColor.text}`}>
                                                <div className="mb-1">Assinatura do Veterinário</div>
                                                <div className="border-b-2 border-current pb-1 mt-4"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

'use client'

import { useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useReactToPrint } from 'react-to-print'
import { Save, Printer, X, ArrowLeft } from 'lucide-react'

interface BaseAttendanceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    previewContent: React.ReactNode
    children: React.ReactNode
    onSave: () => void
    saveLabel: string
    isSaving: boolean
    printTitle: string
    onBack?: () => void
}

export function BaseAttendanceDialog({
    open,
    onOpenChange,
    title,
    previewContent,
    children,
    onSave,
    saveLabel,
    isSaving,
    printTitle,
    onBack
}: BaseAttendanceDialogProps) {
    const printRef = useRef<HTMLDivElement>(null)

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: printTitle,
        pageStyle: `
            @page { size: A4; margin: 0; }
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
                html { margin: 0; padding: 0; }
                .no-print { display: none !important; }
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
        `
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="clinical-modal-content w-screen h-screen rounded-none p-0 flex flex-col overflow-hidden backdrop-blur-sm">
                <DialogHeader className="p-4 md:p-6 border-b border-border/50 bg-white flex flex-row items-center justify-between shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100" onClick={onBack}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {printTitle}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Coluna Esquerda - Formulário */}
                    <div className="w-[40%] bg-white border-r border-border/50 overflow-y-auto p-6">
                        {children}
                    </div>

                    {/* Coluna Direita - Área de Trabalho do Papel */}
                    <div className="w-[60%] paper-workspace">
                        {/* Papel Digital A4 */}
                        <div className="a4-paper-preview" ref={printRef}>
                            {previewContent}
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-6 border-t border-border/50 bg-white flex items-center justify-between shrink-0 z-20 shadow-sm">
                    <div className="flex gap-3">
                        <Button onClick={onSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Salvando...' : saveLabel}
                        </Button>
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimir
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

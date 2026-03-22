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
            @page { size: A4; margin: 15mm 12mm; }
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; font-size: 10pt; }
                html { margin: 0; padding: 0; }
                .no-print { display: none !important; }
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                h1 { font-size: 16pt !important; }
                h2 { font-size: 14pt !important; }
                h3 { font-size: 12pt !important; }
                p, td, th, li, span { font-size: 10pt !important; }
                table { font-size: 9pt !important; page-break-inside: auto; }
                tr { page-break-inside: avoid; }
            }
        `
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="clinical-modal-content w-screen h-screen rounded-none p-0 flex flex-col overflow-hidden backdrop-blur-sm">
                <DialogHeader className="px-4 py-2 border-b border-border/50 bg-white flex flex-row items-center justify-between shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100" onClick={onBack}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <DialogTitle className="text-base font-bold">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground">
                        {printTitle}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Coluna Esquerda - Formulário */}
                    <div className="w-[35%] bg-white border-r border-border/50 overflow-y-auto p-4">
                        {children}
                    </div>

                    {/* Coluna Direita - Área de Trabalho do Papel */}
                    <div className="w-[65%] paper-workspace">
                        {/* Papel Digital A4 */}
                        <div className="a4-paper-preview" ref={printRef}>
                            {previewContent}
                        </div>
                    </div>
                </div>

                <div className="px-4 py-2 border-t border-border/50 bg-white flex items-center justify-between shrink-0 z-20 shadow-sm">
                    <div className="flex gap-2">
                        <Button onClick={onSave} disabled={isSaving} className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700">
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                            {isSaving ? 'Salvando...' : saveLabel}
                        </Button>
                        <Button variant="outline" onClick={handlePrint} className="h-8 text-xs">
                            <Printer className="w-3.5 h-3.5 mr-1.5" />
                            Imprimir
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-7 w-7">
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'

export function ProductsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Produtos</h2>
        <p className="text-sm text-muted-foreground">Controle de estoque e produtos da clínica</p>
      </div>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="size-12 text-muted-foreground mb-4" />
          <p className="font-medium text-muted-foreground">Módulo de Produtos em breve</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Controle de estoque, entradas e saídas de produtos veterinários será disponibilizado em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

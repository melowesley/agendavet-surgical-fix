#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para converter Markdown para PDF
Converte todos os PLUGINS_*.md em PDFs profissionais
"""

import os
import sys
from pathlib import Path

# Adicionar módulos necessários
try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
except ImportError:
    print("❌ reportlab não está instalado")
    print("Instalando: pip install reportlab --break-system-packages")
    os.system("pip install reportlab --break-system-packages")
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
    from reportlab.lib import colors

def read_markdown_file(filepath):
    """Lê arquivo markdown e retorna conteúdo"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"❌ Erro ao ler {filepath}: {e}")
        return None

def markdown_to_pdf(md_filepath, pdf_filepath):
    """Converte markdown simples para PDF"""
    content = read_markdown_file(md_filepath)
    if not content:
        return False
    
    # Criar documento PDF
    doc = SimpleDocTemplate(
        pdf_filepath,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    # Estilos
    styles = getSampleStyleSheet()
    story = []
    
    # Processar linhas do markdown
    lines = content.split('\n')
    
    for line in lines:
        line = line.strip()
        
        if not line:
            story.append(Spacer(1, 0.1*inch))
        
        elif line.startswith('# '):
            title = line.replace('# ', '')
            story.append(Paragraph(title, styles['Heading1']))
            story.append(Spacer(1, 0.15*inch))
        
        elif line.startswith('## '):
            title = line.replace('## ', '')
            story.append(Paragraph(title, styles['Heading2']))
            story.append(Spacer(1, 0.1*inch))
        
        elif line.startswith('### '):
            title = line.replace('### ', '')
            story.append(Paragraph(title, styles['Heading3']))
            story.append(Spacer(1, 0.08*inch))
        
        elif line.startswith('- ') or line.startswith('* '):
            item = line.replace('- ', '').replace('* ', '')
            story.append(Paragraph(f"• {item}", styles['Normal']))
        
        elif line.startswith('```'):
            # Ignorar blocos de código por enquanto
            continue
        
        else:
            # Parágrafo normal
            if len(line) > 0:
                story.append(Paragraph(line, styles['Normal']))
    
    # Construir PDF
    try:
        doc.build(story)
        return True
    except Exception as e:
        print(f"❌ Erro ao criar PDF: {e}")
        return False

def convert_all_plugins():
    """Converte todos os arquivos PLUGINS_*.md em PDF"""
    base_path = Path("C:\\Users\\Computador\\AgendaVet-Surgical-Fix")
    
    files_to_convert = [
        "PLUGINS_README.md",
        "PLUGINS_QUICK_START.md",
        "PLUGINS_INSTALLATION_GUIDE.md",
        "PLUGINS_PRACTICAL_EXAMPLES.md",
        "PLUGINS_INSTALLATION_CHECKLIST.md",
        "PLUGINS_WORKFLOW_MAP.md"
    ]
    
    print("=" * 70)
    print("🚀 Convertendo arquivos Markdown para PDF")
    print("=" * 70)
    
    converted_count = 0
    failed_count = 0
    
    for filename in files_to_convert:
        md_path = base_path / filename
        pdf_path = base_path / filename.replace('.md', '.pdf')
        
        if md_path.exists():
            print(f"\n📄 Convertendo: {filename}")
            if markdown_to_pdf(str(md_path), str(pdf_path)):
                print(f"   ✅ Criado: {pdf_path.name}")
                converted_count += 1
            else:
                print(f"   ❌ Falha ao converter")
                failed_count += 1
        else:
            print(f"⚠️  Arquivo não encontrado: {filename}")
            failed_count += 1
    
    print("\n" + "=" * 70)
    print(f"✅ RESUMO: {converted_count} PDFs criados, {failed_count} falhas")
    print("=" * 70)
    
    # Listar PDFs criados
    print("\n📁 PDFs criados:")
    for filename in files_to_convert:
        pdf_path = base_path / filename.replace('.md', '.pdf')
        if pdf_path.exists():
            size_kb = pdf_path.stat().st_size / 1024
            print(f"   ✅ {pdf_path.name} ({size_kb:.1f} KB)")

if __name__ == "__main__":
    try:
        convert_all_plugins()
    except Exception as e:
        print(f"❌ Erro geral: {e}")
        sys.exit(1)

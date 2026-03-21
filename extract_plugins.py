#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para extrair os 3 plugins ZIPs na pasta plugins do AgendaVet
"""

import zipfile
import os
from pathlib import Path

# Caminhos
uploads_path = Path(r"C:\Users\Computador\AppData\Roaming\Claude\local-agent-mode-sessions\b711c903-ffc6-420f-9221-ddbf38c4374d\6378a069-d576-4bbb-bb9f-519b200545e9\local_b204ac7e-724a-412c-adc6-872d7c907658\uploads")
plugins_path = Path(r"C:\Users\Computador\AgendaVet-Surgical-Fix\AgendaVet\plugins")

# ZIPs a extrair
zips = [
    "n8n-skills-main-9cf9153e.zip",
    "get-shit-done-main-d68c5477.zip",
    "ui-ux-pro-max-skill-main-f97e66cd.zip"
]

print("=" * 70)
print("🚀 Extraindo plugins...")
print("=" * 70)

for zip_name in zips:
    zip_path = uploads_path / zip_name
    
    if zip_path.exists():
        print(f"\n📦 Extraindo: {zip_name}")
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(plugins_path)
            print(f"   ✅ Extraído com sucesso!")
        except Exception as e:
            print(f"   ❌ Erro ao extrair: {e}")
    else:
        print(f"\n⚠️  Arquivo não encontrado: {zip_name}")

print("\n" + "=" * 70)
print("📁 Conteúdo da pasta plugins:")
print("=" * 70)

if plugins_path.exists():
    for item in plugins_path.iterdir():
        print(f"  {item.name}/")

print("\n✅ Extração concluída!")

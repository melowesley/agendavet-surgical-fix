// Script para extrair os 3 plugins ZIPs
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// Se adm-zip não estiver instalado, instalar primeiro
try {
  require.resolve('adm-zip');
} catch (e) {
  console.log('Instalando adm-zip...');
  require('child_process').execSync('npm install adm-zip', { stdio: 'inherit' });
}

const uploadsPath = path.join(
  process.env.APPDATA,
  'Claude',
  'local-agent-mode-sessions',
  'b711c903-ffc6-420f-9221-ddbf38c4374d',
  '6378a069-d576-4bbb-bb9f-519b200545e9',
  'local_b204ac7e-724a-412c-adc6-872d7c907658',
  'uploads'
);

const pluginsPath = 'C:\\Users\\Computador\\AgendaVet-Surgical-Fix\\AgendaVet\\plugins';

const zips = [
  'n8n-skills-main-9cf9153e.zip',
  'get-shit-done-main-d68c5477.zip',
  'ui-ux-pro-max-skill-main-f97e66cd.zip'
];

console.log('=' .repeat(70));
console.log('🚀 Extraindo plugins...');
console.log('=' .repeat(70));

zips.forEach(zipName => {
  const zipPath = path.join(uploadsPath, zipName);
  
  if (fs.existsSync(zipPath)) {
    console.log(`\n📦 Extraindo: ${zipName}`);
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(pluginsPath, true);
      console.log('   ✅ Extraído com sucesso!');
    } catch (error) {
      console.error(`   ❌ Erro ao extrair: ${error.message}`);
    }
  } else {
    console.log(`\n⚠️  Arquivo não encontrado: ${zipName}`);
  }
});

console.log('\n' + '=' .repeat(70));
console.log('📁 Conteúdo da pasta plugins:');
console.log('=' .repeat(70));

if (fs.existsSync(pluginsPath)) {
  const items = fs.readdirSync(pluginsPath);
  items.forEach(item => {
    console.log(`  ${item}/`);
  });
}

console.log('\n✅ Extração concluída!');

const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log('  + ' + destPath);
    }
  }
}

const src = path.join('C:', 'Users', 'Computador', 'AgendaVet-Surgical-Fix', 'AgendaVet', 'plugins', 'n8n-skills-main', 'skills');
const dest = path.join('C:', 'Users', 'Computador', 'AgendaVet-Surgical-Fix', 'AgendaVet', '.claude', 'skills');

console.log('Copiando n8n-skills para .claude/skills...\n');

const dirs = fs.readdirSync(src);
dirs.forEach(dir => {
  const srcDir = path.join(src, dir);
  const destDir = path.join(dest, dir);
  if (fs.statSync(srcDir).isDirectory()) {
    console.log('Copiando: ' + dir);
    copyDirSync(srcDir, destDir);
  }
});

console.log('\nConcluido!');

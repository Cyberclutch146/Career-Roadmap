const fs = require('fs');
const path = require('path');

const mappings = {
  'text-white/90': 'text-on-surface',
  'text-white/80': 'text-on-surface/80',
  'text-white/70': 'text-on-surface-variant',
  'text-white/50': 'text-on-surface-variant/70',
  'text-white/40': 'text-tertiary',
  'text-white': 'text-on-surface',
  'bg-black': 'bg-background',
  'bg-white/5': 'bg-surface-variant/50',
  'bg-white/10': 'bg-surface-variant',
  'bg-white/20': 'bg-surface-container-high',
  'group-hover:text-white': 'group-hover:text-on-surface',
  'border-white/20': 'border-outline-variant',
};

const sortedMappings = Object.entries(mappings).sort((a, b) => b[0].length - a[0].length);

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  for (const [oldClass, newClass] of sortedMappings) {
    const escapedClass = oldClass.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`(?<=[ "'\`\n\r])${escapedClass}(?=[ "'\`\n\r])`, 'g');
    newContent = newContent.replace(regex, newClass);
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      replaceInFile(filePath);
    }
  }
}

walkDir(path.join(__dirname, 'frontend/app'));
walkDir(path.join(__dirname, 'frontend/components'));

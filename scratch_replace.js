const fs = require('fs');
const path = require('path');

const mappings = {
  'bg-zinc-950/40': 'bg-surface-container/40',
  'bg-zinc-900/40': 'bg-surface-container/40',
  'bg-zinc-900/60': 'bg-surface-container/60',
  'bg-zinc-900/80': 'bg-surface-container/80',
  'bg-zinc-900': 'bg-surface-container',
  'bg-zinc-800': 'bg-surface-container-high',
  'bg-zinc-700': 'bg-surface-variant',
  'bg-[#0e0e0f]': 'bg-surface-container-low',
  
  'border-zinc-800/40': 'border-outline-variant/40',
  'border-zinc-800/50': 'border-outline-variant/50',
  'border-zinc-800/60': 'border-outline-variant/60',
  'border-zinc-800': 'border-outline-variant',
  'border-zinc-700': 'border-outline',
  'border-zinc-600': 'border-outline',
  'border-white/10': 'border-outline/10',
  'border-white/5': 'border-outline-variant/50',
  
  'text-zinc-100': 'text-on-surface',
  'text-zinc-200': 'text-on-surface',
  'text-zinc-300': 'text-on-surface',
  'text-zinc-400': 'text-on-surface-variant',
  'text-zinc-500': 'text-on-surface-variant',
  'text-zinc-600': 'text-tertiary',
  'text-zinc-700': 'text-outline',
  'text-zinc-800': 'text-outline-variant',
  
  'hover:bg-zinc-800': 'hover:bg-surface-container-high',
  'hover:bg-zinc-700': 'hover:bg-surface-variant',
  'hover:border-zinc-700/50': 'hover:border-outline/50',
  'hover:border-zinc-700': 'hover:border-outline',
  'hover:text-zinc-100': 'hover:text-on-surface',
  'hover:text-zinc-500': 'hover:text-on-surface-variant',
  'hover:text-white': 'hover:text-on-surface',
};

// Sort by length descending to replace most specific first
const sortedMappings = Object.entries(mappings).sort((a, b) => b[0].length - a[0].length);

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  for (const [oldClass, newClass] of sortedMappings) {
    // Escape special characters in oldClass for regex
    const escapedClass = oldClass.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    // Regex matches the exact class, preceded by a space, quote, or backtick, and followed by a space, quote, backtick, or slash
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

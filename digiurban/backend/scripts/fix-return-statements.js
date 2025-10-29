const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'routes', 'protocols-simplified.routes.ts');

let content = fs.readFileSync(filePath, 'utf8');

// Padrão: res.json({ (sem return antes)
// Substituir por: return res.json({
const patterns = [
  // Padrão 1: res.json no bloco try (não no if/return)
  {
    from: /(\n\s+)(res\.json\({)/g,
    to: '$1return res.json({'
  },
  // Padrão 2: res.status().json no bloco catch (não no if/return)
  {
    from: /(\n\s+)(res\.status\(\d+\)\.json\({)/g,
    to: '$1return res.status'
  }
];

// Contar substituições
let replacements = 0;

patterns.forEach(pattern => {
  const matches = content.match(pattern.from);
  if (matches) {
    // Verificar se já tem return
    content = content.replace(pattern.from, (match, indent, code) => {
      // Se já tem return, não adicionar
      const lineAbove = content.substring(0, content.indexOf(match)).split('\n').slice(-2)[0];
      if (lineAbove && lineAbove.includes('return')) {
        return match;
      }

      replacements++;
      return pattern.to.replace('$1', indent).replace(/\$2.*/, code);
    });
  }
});

// Approach mais simples: adicionar return em todas as linhas que NÃO começam com return
content = content.replace(/(\n\s+)(res\.json\({)/g, (match, indent, code) => {
  // Verificar se a linha anterior tem return
  const beforeMatch = content.substring(0, content.indexOf(match));
  const lastLine = beforeMatch.split('\n').slice(-1)[0];

  // Se já tem return na linha atual, skip
  if (match.includes('return ')) {
    return match;
  }

  return `${indent}return res.json({`;
});

content = content.replace(/(\n\s+)(res\.status\(\d+\)\.json\({)/g, (match, indent, code) => {
  // Se já tem return na linha, skip
  if (match.includes('return ')) {
    return match;
  }

  return `${indent}return ${code}`;
});

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Warnings TypeScript corrigidos!');
console.log(`📝 Arquivo: ${filePath}`);
console.log(`🔧 Substituições realizadas`);

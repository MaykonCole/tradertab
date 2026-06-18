import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.resolve('src/worldCup2026Data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const buckets = new Set((data.bucketDefinitions || data.bucketRows || []).map((bucket) => bucket.id));
const bucketTotals = Object.fromEntries([...buckets].map((id) => [id, 0]));

const errors = [];
let totalGoals = 0;

for (const match of data.matches || []) {
  const goals = Array.isArray(match.goals) ? match.goals : [];
  const scoreTotal = Number(match.score?.home || 0) + Number(match.score?.away || 0);

  if (goals.length !== scoreTotal) {
    errors.push(`${match.home?.pt || 'Mandante'} x ${match.away?.pt || 'Visitante'}: goals.length (${goals.length}) diferente do placar (${scoreTotal}).`);
  }

  for (const goal of goals) {
    if (!buckets.has(goal.bucketId)) {
      errors.push(`${match.home?.pt || 'Mandante'} x ${match.away?.pt || 'Visitante'}: gol ${goal.id || ''} usa bucketId inválido: ${goal.bucketId}`);
    } else {
      bucketTotals[goal.bucketId] += 1;
    }
  }

  totalGoals += goals.length;
}

if (errors.length) {
  console.error('❌ Dados inválidos em src/worldCup2026Data.json');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('✅ Dados válidos');
console.log(`Jogos: ${data.matches.length}`);
console.log(`Gols: ${totalGoals}`);
console.log('Gols por bloco:');
for (const [bucketId, goals] of Object.entries(bucketTotals)) {
  console.log(`- ${bucketId}: ${goals}`);
}

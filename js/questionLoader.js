const LEGACY_BANK_URL = 'https://raw.githubusercontent.com/ProppedUp/FCC_Prep/5232bf76cf73f36421eca6d9573653269cce5896/index.html';

const FALLBACK_QUESTIONS = [
  {
    id: '1-1A1',
    element: '1',
    question: 'What is a requirement of all marine transmitting apparatus used aboard United States vessels?',
    options: {
      A: 'Only equipment that has been certified by the FCC for Part 80 operations is authorized.',
      B: 'Equipment must be type-accepted by the U.S. Coast Guard for maritime mobile use.',
      C: 'Certification is required by the International Maritime Organization (IMO).',
      D: 'Programming of all maritime channels must be performed by a licensed Marine Radio Operator.'
    },
    answer: 'A'
  }
];

async function loadLegacyBank() {
  const response = await fetch(LEGACY_BANK_URL, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Unable to load legacy bank: ${response.status}`);
  }

  const html = await response.text();
  const match = html.match(/const\s+BANK\s*=\s*(\[[\s\S]*?\]);\s*let\s+quiz/);

  if (!match) {
    throw new Error('Unable to locate legacy embedded question bank.');
  }

  const parsed = JSON.parse(match[1]);

  if (!Array.isArray(parsed)) {
    throw new Error('Legacy question bank was not an array.');
  }

  return parsed;
}

async function loadLocalJsonPools() {
  const manifestResponse = await fetch('./data/manifest.json', { cache: 'no-store' });

  if (!manifestResponse.ok) {
    throw new Error(`Unable to load question manifest: ${manifestResponse.status}`);
  }

  const manifest = await manifestResponse.json();
  const loadedPools = [];

  for (const pool of manifest.pools) {
    try {
      const response = await fetch(`./data/${pool.file}`, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`Unable to load ${pool.file}: ${response.status}`);
      }

      const questions = await response.json();

      if (!Array.isArray(questions)) {
        throw new Error(`${pool.file} must contain an array of questions.`);
      }

      loadedPools.push(...questions);
    } catch (error) {
      console.error(error);
    }
  }

  return loadedPools;
}

async function loadQuestionPool() {
  try {
    const legacyQuestions = await loadLegacyBank();

    if (legacyQuestions.length > 100) {
      return legacyQuestions;
    }
  } catch (legacyError) {
    console.error(legacyError);
  }

  try {
    const localQuestions = await loadLocalJsonPools();

    if (localQuestions.length) {
      return localQuestions;
    }
  } catch (localError) {
    console.error(localError);
  }

  return FALLBACK_QUESTIONS;
}

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

      loadedPools.push(...questions.map(question => ({
        ...question,
        element: String(question.element || pool.element)
      })));
    } catch (error) {
      console.error(error);
    }
  }

  return loadedPools;
}

async function loadQuestionPool() {
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

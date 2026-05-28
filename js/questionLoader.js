async function loadQuestionPool() {
  const manifestResponse = await fetch('./data/manifest.json');

  if (!manifestResponse.ok) {
    throw new Error(`Unable to load question manifest: ${manifestResponse.status}`);
  }

  const manifest = await manifestResponse.json();

  const pools = await Promise.all(
    manifest.pools.map(async (pool) => {
      const response = await fetch(`./data/${pool.file}`);

      if (!response.ok) {
        throw new Error(`Unable to load ${pool.file}: ${response.status}`);
      }

      const questions = await response.json();

      if (!Array.isArray(questions)) {
        throw new Error(`${pool.file} must contain an array of questions.`);
      }

      return questions;
    })
  );

  return pools.flat();
}

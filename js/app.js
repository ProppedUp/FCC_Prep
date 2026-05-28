let BANK = [];
let quiz = [];
let index = 0;
let correct = 0;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

async function initApp() {
  const status = document.getElementById('questionStatus');

  try {
    BANK = await loadQuestionPool();
    status.innerText = `Questions loaded: ${BANK.length}`;
    document.getElementById('startBtn').disabled = false;
  } catch (error) {
    console.error(error);
    status.innerText = 'Question data failed to load.';
  }
}

function buildQuizPool(pool, count) {
  if (!pool.length) {
    return [];
  }

  let output = [];

  while (output.length < count) {
    output = output.concat(shuffle(pool));
  }

  return output.slice(0, count);
}

function startQuiz() {
  if (!BANK.length) {
    alert('Question data is still loading. Please try again.');
    return;
  }

  const element = document.getElementById('element').value;
  const count = parseInt(document.getElementById('count').value, 10);

  const filtered = BANK.filter(q => element === 'all' || q.element === element);

  quiz = buildQuizPool(filtered, count);

  index = 0;
  correct = 0;

  document.getElementById('results').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';

  renderQuestion();
}

function renderQuestion() {
  const q = quiz[index];

  document.getElementById('progress').innerText =
    `Question ${index + 1} / ${quiz.length}`;

  document.getElementById('qid').innerText = q.id;
  document.getElementById('question').innerText = q.question;

  const options = document.getElementById('options');
  options.innerHTML = '';

  ['A', 'B', 'C', 'D'].forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.innerText = letter + '. ' + q.options[letter];

    btn.onclick = () => {
      document.querySelectorAll('.option').forEach(x => x.disabled = true);

      if (letter === q.answer) {
        btn.classList.add('correct');
        correct++;
      } else {
        btn.classList.add('wrong');

        document.querySelectorAll('.option').forEach(x => {
          if (x.innerText.startsWith(q.answer + '.')) {
            x.classList.add('correct');
          }
        });
      }

      document.getElementById('nextBtn').disabled = false;
    };

    options.appendChild(btn);
  });

  document.getElementById('nextBtn').disabled = true;
}

function nextQuestion() {
  index++;

  if (index >= quiz.length) {
    finishQuiz();
    return;
  }

  renderQuestion();
}

function finishQuiz() {
  const pct = Math.round(correct / quiz.length * 100);

  document.getElementById('quiz').style.display = 'none';
  document.getElementById('results').style.display = 'block';

  document.getElementById('results').innerHTML = `
    <h2>Results</h2>
    <p><b>Score:</b> ${pct}%</p>
    <p><b>Correct:</b> ${correct} / ${quiz.length}</p>
    <p><b>Status:</b> ${pct >= 74 ? 'PASSING' : 'NOT PASSING'}</p>
  `;
}

initApp();

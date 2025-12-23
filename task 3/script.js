
 //* 1. JavaScript Quiz  *

// Quiz data
const questions = [
  {
    question: "Which HTML tag is used to embed JavaScript?",
    answers: {
      a: "javascript",
      b: "script",
      c: "js"
    },
    correctAnswer: "b"
  },
  {
    question: "Which keyword declares a block-scoped variable in ES6?",
    answers: {
      a: "var",
      b: "let",
      c: "const"
    },
    correctAnswer: "b"
  },
  {
    question: "Which method logs a message to the browser console?",
    answers: {
      a: "console.log()",
      b: "print()",
      c: "log.console()"
    },
    correctAnswer: "a"
  },
  {
    question: "What does DOM stand for?",
    answers: {
      a: "Document Object Model",
      b: "Data Object Map",
      c: "Document Oriented Module"
    },
    correctAnswer: "a"
  }
];

const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("quiz-result");
const submitBtn = document.getElementById("submit-quiz");

function buildQuiz() {
  const output = [];

  questions.forEach((q, index) => {
    const answers = [];

    for (const key in q.answers) {
      answers.push(`
        <label>
          <input type="radio" name="question${index}" value="${key}">
          ${key.toUpperCase()}: ${q.answers[key]}
        </label>
      `);
    }

    output.push(`
      <div class="question">
        <p>${index + 1}. ${q.question}</p>
        <div class="answers">
          ${answers.join("")}
        </div>
      </div>
    `);
  });

  quizContainer.innerHTML = output.join("");
}

function showResults() {
  const answerContainers = quizContainer.querySelectorAll(".answers");
  let numCorrect = 0;

  questions.forEach((q, index) => {
    const container = answerContainers[index];
    const selector = `input[name=question${index}]:checked`;
    const selected = container.querySelector(selector);
    const userAnswer = selected ? selected.value : null;

    // reset color
    container.style.color = "#000";

    if (userAnswer === q.correctAnswer) {
      numCorrect++;
      container.style.color = "#16a34a"; // green
    } else if (userAnswer !== null) {
      container.style.color = "#dc2626"; // red
    }
  });

  resultContainer.textContent = `You scored ${numCorrect} out of ${questions.length}.`;
}

// Initialize quiz and bind event
buildQuiz();
submitBtn.addEventListener("click", showResults);


//* 2. Fetch Joke from API   *
 
const jokeBtn = document.getElementById("load-joke");
const jokeText = document.getElementById("joke-text");

async function loadJoke() {
  jokeText.textContent = "Loading joke...";
  try {
    // Official Joke API random programming joke endpoint
    // Response structure: [{ id, type, setup, punchline }] [web:11][web:20]
    const response = await fetch(
      "https://official-joke-api.appspot.com/jokes/programming/random"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const joke = Array.isArray(data) ? data[0] : data;

    jokeText.textContent = `${joke.setup} — ${joke.punchline}`;
  } catch (error) {
    console.error(error);
    jokeText.textContent =
      "Could not load a joke right now. Please try again.";
  }
}

jokeBtn.addEventListener("click", loadJoke);

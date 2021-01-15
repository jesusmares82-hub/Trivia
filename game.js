const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-input"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const a = document.getElementById("answerT");
//CONSTANTS
const multipleAnswers = 4;
const booleanAnswers = 2;
const amount = localStorage.getItem("numberQuestions");
const category = localStorage.getItem("selectCategory");
const difficulty = localStorage.getItem("selectDifficulty");
const type = localStorage.getItem("selectType");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(
  `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    if (loadedQuestions.results.length == 0) {
      console.log(loadedQuestions.length);
      alert(
        "¡Sorry! We doesn't have enough questions for your petition. 🥺💔‼️"
      );
      return window.location.assign("/end.html");
    } else {
      questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
          question: loadedQuestion.question,
        };
        if (type == "multiple") {
          const answerChoices = [...loadedQuestion.incorrect_answers];
          formattedQuestion.answer =
            Math.floor(Math.random() * multipleAnswers) + 1;
          answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer
          );

          answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
          });
        } else if (type == "boolean") {
          const answerChoices = [...loadedQuestion.incorrect_answers];
          formattedQuestion.answer =
            Math.floor(Math.random() * booleanAnswers) + 1;
          answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer
          );

          answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
          });
        }

        return formattedQuestion;
      });

      startGame();
    }
  })
  .catch((err) => {
    console.error(err);
  });

//CONSTANTS
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = amount;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("/end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    if (type == "boolean") {
      document.getElementById("answerT").style.display = "none";
      document.getElementById("answerTF").style.display = "none";
      const number = choice.dataset["number"];
      choice.innerHTML = `${currentQuestion["choice" + number]}`;
    } else {
      document.getElementById("answerT").style.display = "block";
      document.getElementById("answerTF").style.display = "block";
      const number = choice.dataset["number"];
      choice.innerHTML = `${currentQuestion["choice" + number]}`;
    }
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      choices.forEach((choice) => {
        choice.checked = false;
      });
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerHTML = score;
};

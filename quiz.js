let score = 0;
let currentQuestionIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    fetchQuestionsFromApi();
    document.getElementById("next-button").addEventListener("click", loadNextQuestion);
});

function showQuestion() {
    resetState();

    let currentQuestion = questions[currentQuestionIndex];
    document.getElementById("question").innerHTML = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(button, currentQuestion.correct_answer));
        document.getElementById("answers-button").appendChild(button);
    });
}

function selectAnswer(selectedButton, correctAnswer) {
    const isCorrect = selectedButton.innerText === correctAnswer;

    // Update the button styles for correct or wrong answer
    if (isCorrect) {
        selectedButton.classList.add("correct");
        score++;  // Increase score if correct
    } else {
        selectedButton.classList.add("wrong");
    }

    // Disable all buttons once an answer is selected
    Array.from(document.getElementById("answers-button").children).forEach(button => {
        button.disabled = true;
        if (button.innerText === correctAnswer) {
            button.classList.add("correct");
        }
    });

    // Update the score on the screen
    document.getElementById("score").innerText = `Score: ${score}`;

    // Show next button after selecting an answer
    document.getElementById("next-button").classList.remove("hide");
}

function resetState() {
    document.getElementById("answers-button").innerHTML = ""; // Clear previous answers
    document.getElementById("next-button").classList.add("hide"); // Hide next button initially
}

let questions = [];
async function fetchQuestionsFromApi() {
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
        const data = await response.json();

        if (data.results && Array.isArray(data.results)) {
            // Process the questions only if data.results exists and is an array
            questions = data.results.map((q) => {
                return {
                    question: q.question,
                    answers: shuffle([...q.incorrect_answers, q.correct_answer]),
                    correct_answer: q.correct_answer
                };
            });
            console.log("Formatted Questions:", questions);
            showQuestion(); // Show the first question
        } else {
            console.log("Error: No results found in API response.");
            alert("Failed to fetch quiz data. Please try again later.");
        }
    } catch (error) {
        console.log("Error:", error);
        alert("Failed to fetch quiz data. Please try again later.");
    }
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showFinalScore() {
    resetState();
    document.getElementById("question").innerHTML = `Quiz Over! Your Final Score: ${score} / ${questions.length}`;
    document.getElementById("next-button").innerText = "Restart Quiz";
    document.getElementById("next-button").classList.remove("hide");
    document.getElementById("next-button").addEventListener("click", restartQuiz);
}

function restartQuiz() {
    score = 0; // Reset score
    currentQuestionIndex = 0; // Reset question index
    document.getElementById("score").innerText = `Score: ${score}`; // Reset score display
    document.getElementById("next-button").innerText = "Next Question"; // Reset button text

    fetchQuestionsFromApi(); // Fetch new questions and start over
}

function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(); // Show next question
    } else {
        showFinalScore(); // Show final score when all questions are answered
    }
}

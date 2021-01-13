function getCategories() {
  const url = "https://opentdb.com/api_category.php";
  fetch(url)
    .then((response) => response.json())
    .then((data) => printCategories(data.trivia_categories));
}
function printCategories(categories) {
  const categoriesContainer = document.getElementById("select-category");
  categories.forEach((category) => {
    categoriesContainer.innerHTML += `<option value="${category.id}">${category.name}</option>`;
  });
}

function saveFilter() {
  const totalQuestions = document.getElementById("total-questions").value;
  const category = document.getElementById("select-category").value;
  const difficulty = document.getElementById("select-difficulty").value;
  const type = document.getElementById("select-type").value;
  localStorage.setItem("numberQuestions", totalQuestions);
  localStorage.setItem("selectCategory", category);
  localStorage.setItem("selectDifficulty", difficulty);
  localStorage.setItem("selectType", type);
}

getCategories();

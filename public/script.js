const modal = document.getElementById("modal");
const newMealBtn = document.getElementById("newMealBtn");
const closeBtn = document.querySelector(".close");
const submitMealBtn = document.getElementById("submitMeal");
const responseBox = document.getElementById("response");
const mealImageInput = document.getElementById("mealImage");
const mealList = document.getElementById("mealList");
const mealCounter = document.getElementById("mealCounter");
const calorieCounter = document.getElementById("calorieCounter");

let totalMeals = 0;
let totalCalories = 0;

// Open modal
newMealBtn.onclick = () => {
  responseBox.innerText = "";
  mealImageInput.value = null;
  modal.style.display = "block";
};

// Close modal
closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Submit image to backend
submitMealBtn.onclick = () => {
  const file = mealImageInput.files[0];
  if (!file) {
    responseBox.innerText = "Please select an image.";
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  responseBox.innerText = "Analyzing image...";

  const reader = new FileReader();
  reader.onloadend = () => {
    const imageUrl = reader.result;

    axios.post("/api/analyze-image", formData)
      .then(res => {
        const reply = res.data.reply;
        const estimatedCalories = extractCalories(reply);  // ✅ Extract before modifying reply
        addMeal(imageUrl, reply, estimatedCalories);       // ✅ Pass original reply
        modal.style.display = "none";
      })
      .catch(err => {
        console.error(err);
        responseBox.innerText = "Error analyzing image.";
      });
  };

  reader.readAsDataURL(file);
};

// Add meal to scrollable list
function addMeal(imageUrl, description, calories) {
  const mealDiv = document.createElement("div");
  mealDiv.className = "meal-entry";

  const img = document.createElement("img");
  img.src = imageUrl;

  const info = document.createElement("div");
  info.className = "meal-info";
  info.innerHTML = `
    <div>
      <span class="label">Description:</span>
      <span class="value">${description.split("Estimated Calories:")[0].trim().replace(/^Description:\s*/i, '')}</span>
    </div>
    <div>
      <span class="label">Estimated Calories:</span>
      <span class="value">${calories} kcal</span>
    </div>
    <div class="meal-time">${new Date().toLocaleString()}</div>
  `;

  mealDiv.appendChild(img);
  mealDiv.appendChild(info);
  mealList.prepend(mealDiv);

  totalMeals++;
  totalCalories += calories;

  mealCounter.innerText = `Total Meals: ${totalMeals}`;
  calorieCounter.innerText = `Total Calories: ${totalCalories} kcal`;
}

// Extract estimated calories from AI message
function extractCalories(text) {
  console.log("Extracting calories from:", text); // Debug line

  const match = text.match(/Estimated Calories:\s*["']?(\d{2,5})["']?/i);
  const calories = match ? parseInt(match[1]) : 0;

  console.log("Estimated calories:", calories); // Debug line
  return calories;
}

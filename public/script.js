// Global variables
let dailyGoal = 2100;
let meals = [
    // { 
    //     id: '1', 
    //     name: 'Breakfast', 
    //     calories: 300, 
    //     notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.' 
    // }
];

// Global DOM elements
const dailyGoalElement = document.getElementById('dailyGoal');
const remainingElement = document.getElementById('remaining');
const totalEatenElement = document.getElementById('totalEaten');
const progressCircleElement = document.getElementById('progressCircle');
const mealsContainerElement = document.getElementById('mealsContainer');
const addMealBtnElement = document.getElementById('addMealBtn');
const modalOverlayElement = document.getElementById('modalOverlay');
const closeBtnElement = document.getElementById('closeBtn');
const mealNameElement = document.getElementById('mealName');
const caloriesElement = document.getElementById('calories');
const notesElement = document.getElementById('notes');
const calculateBtnElement = document.getElementById('calculateBtn');
const uploadAreaElement = document.getElementById('uploadArea');
const aiToggleElement = document.getElementById('aiToggle');
const manualToggleElement = document.getElementById('manualToggle');
const aiSectionElement = document.getElementById('aiSection');
const manualSectionElement = document.getElementById('manualSection');
const mealNameAIElement = document.getElementById('mealNameAI');
const mealNameManualElement = document.getElementById('mealNameManual');
const uploadAreaAIElement = document.getElementById('uploadAreaAI');
const uploadAreaManualElement = document.getElementById('uploadAreaManual');
const imageInputAI = document.getElementById('imageInputAI');
const imageInputManual = document.getElementById('imageInputManual');
const imageFilenameAI = document.getElementById('imageFilenameAI');
const imageFilenameManual = document.getElementById('imageFilenameManual');
const imagePreviewAI = document.getElementById('imagePreviewAI');
const imagePreviewManual = document.getElementById('imagePreviewManual');
const loaderOverlay = document.getElementById('loaderOverlay');

// Event listeners
addMealBtnElement.addEventListener('click', openModal);
closeBtnElement.addEventListener('click', closeModal);
modalOverlayElement.addEventListener('click', (e) => {
    if (e.target === modalOverlayElement) {
        closeModal();
    }
});

// Handle escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Update display
function updateDisplay() {
    const totalEaten = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const remaining = dailyGoal - totalEaten;
    const progressPercentage = (totalEaten / dailyGoal) * 100;
    
    // Update text content
    dailyGoalElement.textContent = dailyGoal;
    remainingElement.textContent = remaining;
    totalEatenElement.textContent = totalEaten;
    
    // Update progress circle
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (progressPercentage / 100) * circumference;
    progressCircleElement.style.strokeDashoffset = offset;
    
    // Update meals list
    renderMeals();
}

// Render meals
function renderMeals() {
    mealsContainerElement.innerHTML = '';
    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        let iconHtml = '';
        if (meal.image) {
            const imgUrl = URL.createObjectURL(meal.image);
            iconHtml = `<img src="${imgUrl}" alt="Meal" style="width:2.5rem;height:2.5rem;object-fit:cover;border-radius:50%;" />`;
        } else {
            iconHtml = '<div class="meal-icon">🍳</div>';
        }
        mealCard.innerHTML = `
            <div class="meal-header">
                <div class="meal-info">
                    ${iconHtml}
                    <div>
                        <h3 class="meal-name">${meal.name}</h3>
                        <p class="meal-calories">${meal.calories} kcal</p>
                    </div>
                </div>
            </div>
            ${meal.notes ? `<p class="meal-notes">${meal.notes}</p>` : ''}
        `;
        mealsContainerElement.appendChild(mealCard);
    });
}

// Open modal
function openModal() {
    modalOverlayElement.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modalOverlayElement.classList.remove('active');
    document.body.style.overflow = '';
    clearForm();
}

// Clear form
function clearForm() {
    if (mealNameAIElement) mealNameAIElement.value = '';
    if (mealNameManualElement) mealNameManualElement.value = '';
    if (caloriesElement) caloriesElement.value = '';
    if (notesElement) notesElement.value = '';
    if (imagePreviewAI) {
        imagePreviewAI.src = '';
        imagePreviewAI.style.display = 'none';
    }
    if (imagePreviewManual) {
        imagePreviewManual.src = '';
        imagePreviewManual.style.display = 'none';
    }
    if (imageInputAI) imageInputAI.value = '';
    if (imageInputManual) imageInputManual.value = '';
    if (imageFilenameAI) imageFilenameAI.textContent = '';
    if (imageFilenameManual) imageFilenameManual.textContent = '';
}

// Add meal
function addMeal() {
    let name = '';
    let calories = 0;
    let notes = '';
    // Determine which section is active
    if (aiToggleElement.classList.contains('active')) {
        name = mealNameAIElement.value.trim();
        notes = notesElement.value.trim();
        // For AI, calories is not entered manually
        calories = 0; // Placeholder, should be set by AI analysis
        alert('AI analysis is not implemented yet. Please use Manual Input for now.');
        return;
    } else {
        name = mealNameManualElement.value.trim();
        calories = parseInt(caloriesElement.value);
        notes = '';
    }
    if (!name || !calories || calories <= 0) {
        alert('Please enter a valid meal name and calories');
        return;
    }
    const newMeal = {
        id: Date.now().toString(),
        name: name,
        calories: calories,
        notes: notes || undefined
    };
    meals.push(newMeal);
    updateDisplay();
    closeModal();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    // Set initial button text based on default toggle
    if (aiToggleElement.classList.contains('active')) {
        calculateBtnElement.textContent = 'Calculate';
    } else {
        calculateBtnElement.textContent = 'Add';
    }
});

uploadAreaAIElement.addEventListener('click', () => {
    imageInputAI.click();
});
uploadAreaManualElement.addEventListener('click', () => {
    imageInputManual.click();
});
imageInputAI.addEventListener('change', () => {
    imageFilenameAI.textContent = imageInputAI.files[0] ? imageInputAI.files[0].name : '';
    if (imageInputAI.files[0]) {
        imagePreviewAI.src = URL.createObjectURL(imageInputAI.files[0]);
        imagePreviewAI.style.display = 'block';
    } else {
        imagePreviewAI.src = '';
        imagePreviewAI.style.display = 'none';
    }
});
imageInputManual.addEventListener('change', () => {
    imageFilenameManual.textContent = imageInputManual.files[0] ? imageInputManual.files[0].name : '';
    if (imageInputManual.files[0]) {
        imagePreviewManual.src = URL.createObjectURL(imageInputManual.files[0]);
        imagePreviewManual.style.display = 'block';
    } else {
        imagePreviewManual.src = '';
        imagePreviewManual.style.display = 'none';
    }
});

function extractDescriptionAndCalories(text) {
    // Extract description
    let description = '';
    let calories = null;
    // Support both plain and markdown-style (with **) formats
    // Try to match '**Description:** ...' and '**Estimated Calories:** ...'
    const descMatch = text.match(/\*\*Description:\*\*\s*([\s\S]*?)\n+\*\*Estimated Calories:\*\*/i) ||
                      text.match(/Description:\s*([\s\S]*?)\n+Estimated Calories:/i);
    if (descMatch) {
        description = descMatch[1].trim();
    } else {
        // fallback: try to get everything before 'Estimated Calories:'
        const parts = text.split(/\*\*Estimated Calories:\*\*|Estimated Calories:/);
        if (parts.length > 1) {
            description = parts[0].replace(/\*\*Description:\*\*|Description:/, '').trim();
        }
    }
    const calMatch = text.match(/\*\*Estimated Calories:\*\*\s*(\d+)/i) ||
                     text.match(/Estimated Calories:\s*(\d+)/i);
    if (calMatch) {
        calories = parseInt(calMatch[1], 10);
    }
    return { description, calories };
}

let isLoading = false;

function setLoading(loading) {
    isLoading = loading;
    if (loading) {
        loaderOverlay.style.display = 'flex';
        loaderOverlay.style.pointerEvents = 'auto';
        document.body.style.userSelect = 'none';
    } else {
        loaderOverlay.style.display = 'none';
        loaderOverlay.style.pointerEvents = 'none';
        document.body.style.userSelect = '';
    }
}

calculateBtnElement.addEventListener('click', (e) => {
    if (isLoading) return;
    if (aiToggleElement.classList.contains('active')) {
        aiModeHandler();
    } else {
        manualModeHandler();
    }
});

function aiModeHandler() {
    const name = mealNameAIElement.value.trim();
    const notes = notesElement.value.trim();
    const image = imageInputAI.files[0];
    if (!name || !notes || !image) {
        alert('Please fill in all fields and attach an image.');
        return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("notes", notes);
    axios.post("/api/analyze-image", formData)
        .then(res => {
            console.log(res.data);
            const text = typeof res.data === 'string' ? res.data : res.data.reply;
            const { description, calories } = extractDescriptionAndCalories(text);
            const newMeal = {
                id: Date.now().toString(),
                name: name,
                calories: calories,
                image: image,
                notes: description
            };
            meals.push(newMeal);
            updateDisplay();
            closeModal();
        })
        .catch(err => {
            console.error(err);
            alert(err);
        })
        .finally(() => {
            setLoading(false);
        });
}

function manualModeHandler() {
    const name = mealNameManualElement.value.trim();
    const calories = parseInt(caloriesElement.value);
    const image = imageInputManual.files[0];
    if (!name || !calories || calories <= 0 || !image) {
        alert('Please enter a valid meal name, calories, and attach an image.');
        return;
    }
    // Add meal to the UI
    const newMeal = {
        id: Date.now().toString(),
        name: name,
        calories: calories,
        // Optionally store image for future use
        image: image
    };
    meals.push(newMeal);
    updateDisplay();
    closeModal();
}

aiToggleElement.addEventListener('click', () => {
    aiToggleElement.classList.add('active');
    manualToggleElement.classList.remove('active');
    aiSectionElement.classList.remove('hide');
    manualSectionElement.classList.add('hide');
    calculateBtnElement.textContent = 'Calculate';
});
manualToggleElement.addEventListener('click', () => {
    aiToggleElement.classList.remove('active');
    manualToggleElement.classList.add('active');
    aiSectionElement.classList.add('hide');
    manualSectionElement.classList.remove('hide');
    calculateBtnElement.textContent = 'Add';
});

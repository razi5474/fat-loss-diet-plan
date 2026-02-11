const keralaMeals = {
    breakfast: [
        { name: "Appam (2 pcs) + Veg Stew", calories: 350, type: "veg", items: ["Appam Batter", "Mixed Vegetables", "Coconut Milk"] },
        { name: "Puttu (1 cup) + Kadala Curry", calories: 400, type: "veg", items: ["Rice Flour", "Black Chickpeas", "Coconut"] },
        { name: "Idli (3 pcs) + Sambar", calories: 300, type: "veg", items: ["Idli Batter", "Dal", "Sambar Powder", "Vegetables"] },
        { name: "Dosa (2 pcs) + Chutney", calories: 350, type: "veg", items: ["Dosa Batter", "Coconut", "Green Chillies"] },
        { name: "Upma (1 bowl) + Banana", calories: 320, type: "veg", items: ["Rava (Semolina)", "Banana", "Mustard Seeds"] },
        { name: "Appam (2 pcs) + Egg Roast", calories: 400, type: "non-veg", items: ["Appam Batter", "Eggs", "Onion", "Tomato"] },
        { name: "Puttu (1 cup) + Fish Curry", calories: 450, type: "non-veg", items: ["Rice Flour", "Fish", "Kudampuli", "Coconut"] },
        { name: "Pathiri (3 pcs) + Chicken Curry", calories: 450, type: "non-veg", items: ["Rice Flour", "Chicken", "Coconut Milk", "Spices"] }
    ],
    lunch: [
        { name: "Rice (1 cup) + Thoran + Sambar", calories: 450, type: "veg", items: ["Rice", "Vegetables (Thoran)", "Coconut", "Dal", "Sambar Powder"] },
        { name: "Rice (1 cup) + Avial + Moru Curry", calories: 420, type: "veg", items: ["Rice", "Mixed Veg (Avial)", "Yogurt", "Coconut"] },
        { name: "Rice (1 cup) + Theiyal + Payar Mezhukkupuratti", calories: 460, type: "veg", items: ["Rice", "Vegetables", "Long Beans (Payar)"] },
        { name: "Rice (1 cup) + Fish Curry + Thoran", calories: 500, type: "non-veg", items: ["Rice", "Fish", "Vegetables", "Coconut"] },
        { name: "Rice (1 cup) + Chicken Curry + Salad", calories: 550, type: "non-veg", items: ["Rice", "Chicken", "Cucumber", "Carrot"] },
        { name: "Rice (1 cup) + Fish Fry + Moru Curry", calories: 520, type: "non-veg", items: ["Rice", "Fish", "Coconut Oil", "Yogurt"] }
    ],
    dinner: [
        { name: "Chapati (2 pcs) + Veg Kurma", calories: 350, type: "veg", items: ["Wheat Flour", "Mixed Vegetables", "Coconut"] },
        { name: "Kanji + Payar", calories: 300, type: "veg", items: ["Rice", "Green Gram"] },
        { name: "Oats Upma with Veggies", calories: 280, type: "veg", items: ["Oats", "Carrot", "Beans"] },
        { name: "Wheat Dosa (2 pcs) + Chutney", calories: 320, type: "veg", items: ["Wheat Flour", "Coconut", "Green Chillies"] },
        { name: "Chapati (2 pcs) + Chicken Roast (Less Oil)", calories: 400, type: "non-veg", items: ["Wheat Flour", "Chicken", "Spices"] },
        { name: "Grilled Fish + Salad", calories: 350, type: "non-veg", items: ["Fish", "Cucumber", "Tomato", "Lemon"] },
        { name: "Egg Curry + Appam (1 pc)", calories: 300, type: "non-veg", items: ["Eggs", "Appam Batter", "Coconut Milk"] }
    ]
};

const SNACK_CALORIES = 150;
const SNACK_ITEMS = ["Tea/Coffee", "Nuts", "Biscuits/Rusk"];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('diet-form');
    const inputView = document.getElementById('input-view');
    const resultView = document.getElementById('result-view');
    const resetBtn = document.getElementById('reset-btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Gather Data
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activity = parseFloat(document.getElementById('activity').value);
        const preference = document.getElementById('preference').value;
        const goal = document.getElementById('goal').value;

        // Calculate TDEE
        const tdee = calculateTDEE(weight, height, age, gender, activity);

        // Calculate Target Calories
        let targetCalories;
        if (goal === 'maintain') {
            targetCalories = tdee;
        } else if (goal === 'gain') {
            targetCalories = tdee + 400; // Moderate surplus for lean gain
        } else if (goal === 'lose-1.0') {
            targetCalories = tdee - 1000;
        } else {
            // Default: lose-0.5
            targetCalories = tdee - 500;
        }

        targetCalories = Math.round(targetCalories);

        // Safety Floor
        const minCals = gender === 'male' ? 1500 : 1200;
        if (goal.includes('lose') && targetCalories < minCals) {
            targetCalories = minCals;
        }

        const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
        const water = (weight * 0.033).toFixed(1);

        // Render Results
        displayResults(targetCalories, water, bmi, preference);

        // Switch View
        inputView.classList.add('hidden');
        resultView.classList.remove('hidden');
        window.scrollTo(0, 0);
    });

    resetBtn.addEventListener('click', () => {
        resultView.classList.add('hidden');
        inputView.classList.remove('hidden');
        form.reset();
        window.scrollTo(0, 0);
    });
});

function calculateTDEE(weight, height, age, gender, activity) {
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return bmr * activity;
}

function getBMIAnalysis(bmi) {
    if (bmi < 18.5) return { cat: "Underweight", color: "orange", msg: "You may need to eat more to reach a healthy weight." };
    if (bmi < 25) return { cat: "Normal Weight", color: "green", msg: "Your weight is healthy. Great job!" };
    if (bmi < 30) return { cat: "Overweight", color: "orange", msg: "A balanced diet can help you manage your weight." };
    return { cat: "Obese", color: "red", msg: "Consulting a doctor alongside this diet is recommended." };
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function displayResults(calories, water, bmi, preference) {
    document.getElementById('target-calories').textContent = calories;
    document.getElementById('target-water').textContent = water;

    // BMI Logic
    const bmiData = getBMIAnalysis(bmi);
    document.getElementById('bmi-value').textContent = `${bmi} (${bmiData.cat})`;
    const bmiMsgEl = document.getElementById('bmi-message');
    bmiMsgEl.textContent = bmiData.msg;
    bmiMsgEl.style.color = bmiData.color === 'green' ? 'var(--primary)' : (bmiData.color === 'red' ? '#ef4444' : '#f59e0b');

    // Generate Plan & Grocery List
    const container = document.getElementById('weekly-plan');
    container.innerHTML = '';

    const grocerySet = new Set();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach((day, index) => {
        let bfOptions = keralaMeals.breakfast;
        let lnOptions = keralaMeals.lunch;
        let dnOptions = keralaMeals.dinner;

        if (preference === 'veg') {
            bfOptions = bfOptions.filter(m => m.type === 'veg');
            lnOptions = lnOptions.filter(m => m.type === 'veg');
            dnOptions = dnOptions.filter(m => m.type === 'veg');
        }

        const bf = getRandomItem(bfOptions);
        const ln = getRandomItem(lnOptions);
        const dn = getRandomItem(dnOptions);

        // Add items to grocery list
        bf.items.forEach(i => grocerySet.add(i));
        ln.items.forEach(i => grocerySet.add(i));
        dn.items.forEach(i => grocerySet.add(i));

        const card = document.createElement('div');
        card.className = 'day-card';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="day-header">${day}</div>
            <div class="meal-body">
                <div class="meal-row">
                    <span class="meal-type">Breakfast</span>
                    <span class="meal-name">${bf.name}</span>
                    <span class="meal-calories">~${bf.calories}</span>
                </div>
                <div class="meal-row">
                    <span class="meal-type">Lunch</span>
                    <span class="meal-name">${ln.name}</span>
                    <span class="meal-calories">~${ln.calories}</span>
                </div>
                <div class="meal-row">
                    <span class="meal-type">Snack</span>
                    <span class="meal-name">Tea/Coffee + Small Snack</span>
                    <span class="meal-calories">~${SNACK_CALORIES}</span>
                </div>
                <div class="meal-row">
                    <span class="meal-type">Dinner</span>
                    <span class="meal-name">${dn.name}</span>
                    <span class="meal-calories">~${dn.calories}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Add common snack items
    SNACK_ITEMS.forEach(i => grocerySet.add(i));

    // Render Grocery List
    const groceryListEl = document.getElementById('grocery-list');
    groceryListEl.innerHTML = '';
    const sortedGroceries = Array.from(grocerySet).sort();

    sortedGroceries.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        groceryListEl.appendChild(li);
    });
}

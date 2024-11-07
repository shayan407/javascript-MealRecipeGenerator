let submit = document.getElementById('submit');
let search = document.getElementById('search');
let generate = document.getElementById('generate');
let resultsHeading = document.getElementById('results-heading');
let meals = document.getElementById('meals');
let selectedMeal = document.getElementById('selected-meal');

function searchMeal(e) {
    e.preventDefault(); // Prevent any default form action if necessary
    let searchText = search.value;
    
    if (searchText.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                resultsHeading.innerHTML = `<h2>Search Results for ${searchText}</h2>`;
                if (data.meals === null) {
                    resultsHeading.innerHTML = `<h2>No Results found for ${searchText}</h2>`;
                } else {
                    meals.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h4>${meal.strMeal}</h4>
                            </div>
                        </div>
                    `).join('');
                }
                search.value = ""
            });
    } else {
        alert('Please enter a search term.');
    }
    selectedMeal.innerHTML = ""
}

function getMeal(mealId){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data => {
        let meal = data.meals[0];
        displayMealDetails(meal);
    })
}

function displayMealDetails(meal){
    resultsHeading.innerHTML = "";
    meals.innerHTML = "";
    console.log(meal);
    let ingredients = [];
    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} : ${meal[`strMeasure${i}`]}`);
        }else{
            break;
        }
    }
    selectedMeal.innerHTML = `
        <div class="selected-meal-details">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="selected-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
            </div>
            <div class="selected-meal-instructions">
                <p>${meal.strInstructions}</p>
                <h3>Ingredients</h3>
                <ul>
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
        </div>
    `
}



meals.addEventListener('click', e => {
    let mealInfo = e.composedPath().find(item => {
        if(item.classList){
            return item.classList.contains('meal-info')
        }else{
            false
        }
    })
    console.log(mealInfo);
    if(mealInfo){
        let mealId = mealInfo.getAttribute('data-mealid')
        // console.log(Number(mealId));
        getMeal(mealId)
    }
})

submit.addEventListener('click', searchMeal);

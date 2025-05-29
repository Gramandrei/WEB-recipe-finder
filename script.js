const apiKey = "c098409867e441fb8136457779c08989"; // Replace with your actual Spoonacular API key
const container = document.getElementById("recipeContainer");

function searchRecipes() {
  const query = document.getElementById("searchInput").value.trim();

  if (!query) {
    container.innerHTML = "<p class='error'>Please enter a search term.</p>";
    return;
  }

  container.innerHTML = `<div class="loader"></div>`;

  fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=12&apiKey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (!data.results || data.results.length === 0) {
        container.innerHTML = "<p class='error'>No recipes found.</p>";
        return;
      }

      container.innerHTML = "";
      data.results.forEach(recipe => renderRecipeCard(recipe));
    })
    .catch(error => {
      console.error("Error:", error);
      container.innerHTML = "<p class='error'>Something went wrong.</p>";
    });
}

function renderRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  const isFavorited = getFavorites().some(r => r.id === recipe.id);

  card.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}" />
    <h3>${recipe.title}</h3>
    <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-").toLowerCase()}-${recipe.id}" target="_blank">View Recipe</a>
    <button onclick="toggleFavorite(${recipe.id}, '${recipe.title}', '${recipe.image}')">
      ${isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  `;
  container.appendChild(card);
}

function toggleFavorite(id, title, image) {
  let favorites = getFavorites();
  const exists = favorites.find(r => r.id === id);

  if (exists) {
    favorites = favorites.filter(r => r.id !== id);
  } else {
    favorites.push({ id, title, image });
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  searchRecipes(); // Refresh UI to reflect favorite state
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function clearFavorites() {
  localStorage.removeItem("favorites");
  showFavorites(); // Refresh favorites view
}


function showFavorites() {
  container.innerHTML = "";
  const favorites = getFavorites();

  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorite recipes saved.</p>";
    return;
  }

  favorites.forEach(recipe => renderRecipeCard(recipe));
}

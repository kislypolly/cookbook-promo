// Демоданные рецептов
const recipes = [
  {
    id: 1,
    title: "Паста с томатным соусом",
    category: "Обед",
    image: "img/pasta.png",
    ingredients: ["Спагетти", "Томаты", "Чеснок", "Оливковое масло", "Базилик"],
    steps: [
      "Отварить пасту до состояния аль денте.",
      "Обжарить чеснок в оливковом масле.",
      "Добавить нарезанные томаты и тушить 10–15 минут.",
      "Смешать соус с пастой и посыпать базиликом."
    ]
  },
  {
    id: 2,
    title: "Овсянка с ягодами",
    category: "Завтрак",
    image: "img/porridge.png",
    ingredients: ["Овсяные хлопья", "Молоко или вода", "Ягоды", "Мёд"],
    steps: [
      "Сварить овсянку на молоке или воде.",
      "Добавить ягоды по вкусу.",
      "Полить мёдом перед подачей."
    ]
  },
  {
    id: 3,
    title: "Цезарь с курицей",
    category: "Обед",
    image: "img/caesar.png",
    ingredients: ["Куриное филе", "Салат Ромэн", "Сухарики", "Сыр Пармезан", "Соус Цезарь"],
    steps: [
      "Обжарить куриное филе и нарезать полосками.",
      "Смешать листья салата, сухарики и курицу.",
      "Посыпать тёртым пармезаном и заправить соусом."
    ]
  },
  {
    id: 4,
    title: "Шоколадный брауни",
    category: "Десерт",
    image: "img/brownie.png",
    ingredients: ["Шоколад", "Масло", "Сахар", "Яйца", "Мука"],
    steps: [
      "Растопить шоколад с маслом.",
      "Смешать с сахаром и яйцами.",
      "Добавить муку и выпекать 20–25 минут."
    ]
  }
];

const FAVORITES_KEY = "cookbook_favorites_v1";

const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const recipesList = document.getElementById("recipesList");
const recipeDetail = document.getElementById("recipeDetail");

// Инициализация избранного из localStorage
let favorites = loadFavorites();

// Заполнить select категориями
function initCategories() {
  const categories = Array.from(new Set(recipes.map(r => r.category)));
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Загрузка избранного
function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

// Сохранение избранного
function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Проверка, в избранном ли рецепт
function isFavorite(id) {
  return favorites.includes(id);
}

// Переключение избранного
function toggleFavorite(id) {
  if (isFavorite(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  saveFavorites();
  renderRecipes();
  const current = recipes.find(r => r.id === id);
  const openedId = recipeDetail.dataset.recipeId
    ? Number(recipeDetail.dataset.recipeId)
    : null;
  if (openedId === id && current) {
    renderRecipeDetail(current);
  }
}

// Фильтрация рецептов по поиску и категории
function getFilteredRecipes() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  return recipes.filter(recipe => {
    const matchesCategory = category === "all" || recipe.category === category;

    const inTitle = recipe.title.toLowerCase().includes(query);
    const inIngredients = recipe.ingredients.some(ing =>
      ing.toLowerCase().includes(query)
    );
    const matchesQuery = !query || inTitle || inIngredients;

    return matchesCategory && matchesQuery;
  });
}

// Рендер списка рецептов
function renderRecipes() {
  const list = getFilteredRecipes();
  recipesList.innerHTML = "";

  if (list.length === 0) {
    recipesList.innerHTML =
      '<p class="muted">Рецепты не найдены. Попробуйте изменить запрос или категорию.</p>';
    return;
  }

  list.forEach(recipe => {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.title;

    const body = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = recipe.title;

    const meta = document.createElement("div");
    meta.className = "recipe-meta";

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = recipe.category;

    const favBtn = document.createElement("button");
    favBtn.className = "favorite-btn" + (isFavorite(recipe.id) ? " active" : "");
    favBtn.innerHTML = isFavorite(recipe.id) ? "★" : "☆";
    favBtn.title = "Добавить в избранное";

    // Клик по избранному
    favBtn.addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(recipe.id);
    });

    meta.appendChild(badge);
    meta.appendChild(favBtn);

    body.appendChild(title);
    body.appendChild(meta);

    card.appendChild(img);
    card.appendChild(body);

    // Клик по карточке — показать детальное описание
    card.addEventListener("click", () => renderRecipeDetail(recipe));

    recipesList.appendChild(card);
  });
}

// Рендер детальной информации о рецепте
function renderRecipeDetail(recipe) {
  recipeDetail.dataset.recipeId = recipe.id;
  recipeDetail.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = recipe.title;

  const img = document.createElement("img");
  img.src = recipe.image;
  img.alt = recipe.title;
  img.style.marginBottom = "8px";

  const ingTitle = document.createElement("h4");
  ingTitle.textContent = "Ингредиенты";

  const ingList = document.createElement("ul");
  recipe.ingredients.forEach(ing => {
    const li = document.createElement("li");
    li.textContent = ing;
    ingList.appendChild(li);
  });

  const stepsTitle = document.createElement("h4");
  stepsTitle.textContent = "Способ приготовления";

  const stepsList = document.createElement("ol");
  recipe.steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });

  recipeDetail.appendChild(title);
  recipeDetail.appendChild(img);
  recipeDetail.appendChild(ingTitle);
  recipeDetail.appendChild(ingList);
  recipeDetail.appendChild(stepsTitle);
  recipeDetail.appendChild(stepsList);
}

// Инициализация
initCategories();
renderRecipes();

// Обработчики ввода
searchInput.addEventListener("input", renderRecipes);
categorySelect.addEventListener("change", renderRecipes);

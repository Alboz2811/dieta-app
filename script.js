// script.js

// Riferimenti ai DOM
const selectDayEl      = document.getElementById("select-day");
const marcoMealsEl     = document.getElementById("marco-meals");
const soniaMealsEl     = document.getElementById("sonia-meals");

let dietData = null; // Contiene i dati caricati da data.json

// Funzione per creare un elemento DOM con testo e classi
function createElem(tag, text = "", classes = "") {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  if (classes) el.className = classes;
  return el;
}

// Costruisce l’interfaccia dei pasti per un utente in base ai dati di un giorno
function renderMeals(person, mealsObj, containerEl) {
  // Pulisco il contenuto precedente
  containerEl.innerHTML = "";

  // Per ciascun pasto (Colazione, Spuntino, Pranzo, Cena)
  for (const mealName of Object.keys(mealsObj)) {
    // Titolo del pasto
    const mealTitle = createElem(
      "h3",
      mealName,
      "text-lg font-semibold mt-4 mb-2"
    );
    containerEl.appendChild(mealTitle);

    const categoriesObj = mealsObj[mealName];
    // Per ogni categoria (Carboidrati, Proteine, …)
    for (const categoryName of Object.keys(categoriesObj)) {
      // Titolo categoria
      const catTitle = createElem(
        "h4",
        categoryName,
        "font-medium italic mt-2 mb-1"
      );
      containerEl.appendChild(catTitle);

      // Elenco delle opzioni
      const ul = createElem("ul", "", "list-disc list-inside");

      for (const item of categoriesObj[categoryName]) {
        const li = createElem(
          "li",
          `${item.name} – ${item.quantity}`,
          "text-sm"
        );
        ul.appendChild(li);
      }
      containerEl.appendChild(ul);
    }
  }
}

// Funzione che popola il dropdown dei giorni
function populateDays() {
  const daysArr = dietData.days.map((d) => d.name);
  for (const dayName of daysArr) {
    const option = createElem("option", dayName);
    option.value = dayName;
    selectDayEl.appendChild(option);
  }
}

// Al cambio di selezione del giorno, ricarica i pasti
function handleDayChange() {
  const selectedDay = selectDayEl.value;
  const dayObj = dietData.days.find((d) => d.name === selectedDay);

  if (!dayObj) return;

  // Render Marco
  renderMeals("Marco", dayObj.Marco, marcoMealsEl);
  // Render Sonia
  renderMeals("Sonia", dayObj.Sonia, soniaMealsEl);
}

// Carico il JSON e lancio l’inizializzazione
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    dietData = data;
    populateDays();
    // Imposta il primo giorno (ad es. Lunedì) come selezionato
    selectDayEl.selectedIndex = 0;
    handleDayChange();
  })
  .catch((err) => {
    console.error("Errore caricamento data.json:", err);
    const errMsg = createElem(
      "p",
      "Errore nel caricamento dei dati. Riprova più tardi.",
      "text-red-600"
    );
    document.querySelector("main").appendChild(errMsg);
  });

// Ascolto il change sul dropdown
selectDayEl.addEventListener("change", handleDayChange);

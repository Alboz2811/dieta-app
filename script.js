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
  // Svuoto il contenuto precedente
  containerEl.innerHTML = "";

  // Scelgo la classe di bordo in base alla persona
  // (deve corrispondere a quelle definite in style.css: .border-marco / .border-sonia)
  const borderClass = person === "Marco" ? "border-marco" : "border-sonia";

  // Per ciascun pasto (Colazione, Spuntino, Pranzo, Cena, ecc.)
  for (const [mealName, categoriesObj] of Object.entries(mealsObj)) {
    // 📦 Card contenitore per il pasto
    const card = createElem(
      "div",
      "",
      `bg-white rounded-2xl p-4 mb-4 shadow hover:shadow-lg ${borderClass}`
    );

    // Titolo del pasto
    const title = createElem(
      "h3",
      mealName,
      `font-bold mb-3 text-${person === "Marco" ? "blue" : "pink"}-600`
    );
    card.appendChild(title);

    // Per ogni categoria (es. Carboidrati, Proteine, Grassi, ecc.)
    for (const [categoryName, items] of Object.entries(categoriesObj)) {
      // 🔖 Chip per la categoria
      const chipSpan = createElem("span", categoryName);
      chipSpan.className =
        "chip " +
        {
          Carboidrati: "chip-carb",
          Proteine: "chip-prot",
          Grassi: "chip-fat",
          Dolci: "chip-sweet",
          Bevande: "chip-drink",
          Frutta: "chip-carb",
          "Frutta secca": "chip-fat",
          Verdure: "chip-carb",
          Condimenti: "chip-fat",
          Opzioni: "chip-prot",        // fallback “neutro” per i pasti misti
        }[categoryName] || "bg-gray-200 text-gray-800 chip";

      card.appendChild(chipSpan);

      // 📋 Lista alimenti per quella categoria
      const ul = createElem("ul", "", "list-disc list-inside ml-2 mb-2");
      items.forEach((item) => {
        const li = createElem(
          "li",
          `${item.name} – ${item.quantity}`,
          "text-sm"
        );
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    // Aggiungo la card alla colonna corretta
    containerEl.appendChild(card);
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

// Al cambio di selezione del giorno, ricarico i pasti
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
    // Imposto il primo giorno disponibile (es. Lunedì) come selezionato
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

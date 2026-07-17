const translations = {
  ru: {
    eyebrow: "В разработке",
    title: "Делаем создание картин по номерам проще.",
    lede: "Здесь коротко рассказываем, что уже работает и что появится дальше.",
    read: "Смотреть обновления",
    updatesEyebrow: "История разработки",
    updatesTitle: "Что нового",
    changes: "Что изменилось",
    next: "Дальше:",
    raster: "Растр",
    vector: "Вектор",
    comparison: "Сравнение растра и вектора",
    color: "Цвет",
    outline: "Ч/б",
    palette: "Палитра изображения",
    paletteNote: "Цвета на экране. Подбор реальных красок — следующий этап.",
    footer: "Показываем прогресс без лишних технических подробностей.",
    error: "Не удалось загрузить обновления. Попробуйте открыть страницу позже."
  },
  en: {
    eyebrow: "In development",
    title: "Making paint by numbers easier.",
    lede: "Short updates on what already works and what comes next.",
    read: "See updates",
    updatesEyebrow: "Development history",
    updatesTitle: "What’s new",
    changes: "What changed",
    next: "Next:",
    raster: "Raster",
    vector: "Vector",
    comparison: "Raster and vector comparison",
    color: "Color",
    outline: "B&W",
    palette: "Image palette",
    paletteNote: "On-screen colors. Matching real paints is the next step.",
    footer: "Progress updates without unnecessary technical detail.",
    error: "Updates could not be loaded. Please try again later."
  }
};

const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
let language = requestedLanguage === "en" || requestedLanguage === "ru"
  ? requestedLanguage
  : navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";

let releases = [];

function addList(items, target) {
  for (const text of items) {
    const item = document.createElement("li");
    item.textContent = text;
    target.append(item);
  }
}

function addScreenshots(items, target) {
  for (const screenshot of items) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = screenshot.src;
    image.alt = screenshot.alt[language];
    image.loading = "lazy";
    image.decoding = "async";
    figure.append(image);
    target.append(figure);
  }
}

function addPalette(items, target) {
  for (const color of items) {
    const item = document.createElement("li");
    const swatch = document.createElement("span");
    swatch.className = "palette-swatch";
    swatch.style.backgroundColor = color.hex;
    swatch.setAttribute("aria-hidden", "true");
    item.append(swatch, String(color.number));
    item.title = `${color.number}: ${color.hex}`;
    target.append(item);
  }
}

function addComparisons(items, target) {
  for (const comparison of items) {
    const figure = document.createElement("figure");
    figure.className = "comparison";

    const heading = document.createElement("h5");
    heading.textContent = comparison.title[language];

    const stage = document.createElement("div");
    stage.className = "comparison-stage";
    stage.style.setProperty("--comparison-ratio", comparison.aspectRatio);
    stage.style.setProperty("--split", "50%");

    const raster = document.createElement("img");
    raster.className = "comparison-image comparison-raster";
    raster.src = comparison.raster.src;
    raster.alt = comparison.raster.alt[language];
    raster.loading = "lazy";
    raster.decoding = "async";

    const vectorLayer = document.createElement("div");
    vectorLayer.className = "comparison-vector-layer";
    const vector = document.createElement("img");
    vector.className = "comparison-image";
    vector.src = comparison.vector.color;
    vector.alt = comparison.vector.alt[language];
    vector.loading = "lazy";
    vector.decoding = "async";
    vectorLayer.append(vector);

    const rasterLabel = document.createElement("span");
    rasterLabel.className = "comparison-label comparison-label-raster";
    rasterLabel.textContent = translations[language].raster;
    const vectorLabel = document.createElement("span");
    vectorLabel.className = "comparison-label comparison-label-vector";
    vectorLabel.textContent = translations[language].vector;

    const divider = document.createElement("span");
    divider.className = "comparison-divider";
    divider.setAttribute("aria-hidden", "true");

    const range = document.createElement("input");
    range.className = "comparison-range";
    range.type = "range";
    range.min = "0";
    range.max = "100";
    range.value = "50";
    range.setAttribute("aria-label", `${translations[language].comparison}: ${comparison.title[language]}`);
    range.addEventListener("input", () => stage.style.setProperty("--split", `${range.value}%`));

    stage.append(raster, vectorLayer, rasterLabel, vectorLabel, divider, range);

    const controls = document.createElement("div");
    controls.className = "comparison-controls";
    const modeGroup = document.createElement("div");
    modeGroup.className = "vector-mode";
    modeGroup.setAttribute("role", "group");
    modeGroup.setAttribute("aria-label", translations[language].vector);

    const colorButton = document.createElement("button");
    colorButton.type = "button";
    colorButton.textContent = translations[language].color;
    colorButton.setAttribute("aria-pressed", "true");
    const outlineButton = document.createElement("button");
    outlineButton.type = "button";
    outlineButton.textContent = translations[language].outline;
    outlineButton.setAttribute("aria-pressed", "false");
    modeGroup.append(colorButton, outlineButton);

    const palette = document.createElement("div");
    palette.className = "comparison-palette";
    const paletteHeading = document.createElement("p");
    paletteHeading.textContent = translations[language].palette;
    const paletteList = document.createElement("ol");
    addPalette(comparison.palette, paletteList);
    const paletteNote = document.createElement("p");
    paletteNote.className = "palette-note";
    paletteNote.textContent = translations[language].paletteNote;
    palette.append(paletteHeading, paletteList, paletteNote);

    function setMode(mode) {
      const isColor = mode === "color";
      colorButton.setAttribute("aria-pressed", String(isColor));
      outlineButton.setAttribute("aria-pressed", String(!isColor));
      vector.src = isColor ? comparison.vector.color : comparison.vector.outline;
      palette.hidden = !isColor;
    }
    colorButton.addEventListener("click", () => setMode("color"));
    outlineButton.addEventListener("click", () => setMode("outline"));

    controls.append(modeGroup, palette);
    figure.append(heading, stage, controls);
    target.append(figure);
  }
}

function renderReleases() {
  const container = document.querySelector("#release-list");
  const template = document.querySelector("#release-template");
  container.replaceChildren();
  const replacedScreenshotVersions = new Set(releases.flatMap(release => release.replacesScreenshotsFor ?? []));

  for (const release of releases) {
    const content = release[language];
    const card = template.content.cloneNode(true);
    card.querySelector(".version").textContent = release.version;
    const time = card.querySelector("time");
    time.textContent = new Intl.DateTimeFormat(language, { dateStyle: "long" }).format(new Date(`${release.date}T00:00:00Z`));
    time.dateTime = release.date;
    card.querySelector("h3").textContent = content.title;
    card.querySelector(".summary").textContent = content.summary;
    card.querySelector(".changes-title").textContent = translations[language].changes;
    addList(content.changes, card.querySelector(".changes"));
    card.querySelector(".next strong").textContent = translations[language].next;
    card.querySelector(".next span").textContent = content.next;

    if (release.screenshots.length && !replacedScreenshotVersions.has(release.version)) {
      const gallery = card.querySelector(".gallery");
      gallery.hidden = false;
      addScreenshots(release.screenshots, gallery);
    }

    if (release.comparisons?.length) {
      const comparisons = document.createElement("div");
      comparisons.className = "comparison-list";
      addComparisons(release.comparisons, comparisons);
      card.querySelector(".next").before(comparisons);
    }

    container.append(card);
  }
}

function render() {
  document.documentElement.lang = language;
  document.title = language === "ru" ? "uImage — обновления" : "uImage — updates";
  for (const element of document.querySelectorAll("[data-text]")) {
    element.textContent = translations[language][element.dataset.text];
  }
  for (const button of document.querySelectorAll("[data-language]")) {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  }
  renderReleases();
}

for (const button of document.querySelectorAll("[data-language]")) {
  button.addEventListener("click", () => {
    language = button.dataset.language;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.replaceState({}, "", url);
    render();
  });
}

try {
  const response = await fetch("./releases.json");
  if (!response.ok) throw new Error(String(response.status));
  ({ releases } = await response.json());
  render();
} catch {
  document.querySelector("#release-list").textContent = translations[language].error;
}

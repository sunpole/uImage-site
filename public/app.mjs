const translations = {
  ru: {
    eyebrow: "В разработке",
    title: "Картины по номерам — проще и удобнее.",
    lede: "Здесь коротко рассказываем, что уже работает и что появится дальше.",
    read: "Смотреть обновления",
    updatesEyebrow: "История разработки",
    updatesTitle: "Что нового",
    changes: "Что изменилось",
    next: "Дальше:",
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

function renderReleases() {
  const container = document.querySelector("#release-list");
  const template = document.querySelector("#release-template");
  container.replaceChildren();

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

    if (release.screenshots.length) {
      const gallery = card.querySelector(".gallery");
      gallery.hidden = false;
      addScreenshots(release.screenshots, gallery);
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

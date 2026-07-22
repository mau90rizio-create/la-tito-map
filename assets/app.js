const state = {
  lang: "it",
  site: null,
  locations: [],
  map: null,
  markers: [],
  touchStartY: 0,
};

const translations = {
  it: {
    inFocus: "In primo piano",
    mapEyebrow: "Mappa",
    info: "Informazioni",
    contact: "Contatti",
    hours: "Orari",
    openMaps: "Apri in Google Maps",
    openMenu: "Apri menu PDF",
  },
  en: {
    inFocus: "Featured",
    mapEyebrow: "Map",
    info: "Information",
    contact: "Contacts",
    hours: "Opening hours",
    openMaps: "Open in Google Maps",
    openMenu: "Open menu PDF",
  },
  es: {
    inFocus: "En primer plano",
    mapEyebrow: "Mapa",
    info: "Información",
    contact: "Contacto",
    hours: "Horarios",
    openMaps: "Abrir en Google Maps",
    openMenu: "Abrir menú PDF",
  },
};

const el = {
  heroTitle: document.getElementById("hero-title"),
  beerHeading: document.getElementById("beer-heading"),
  beerTitle: document.getElementById("beer-title"),
  beerDescription: document.getElementById("beer-description"),
  mapEyebrow: document.getElementById("map-eyebrow"),
  mapTitle: document.getElementById("map-title"),
  mapSubtitle: document.getElementById("map-subtitle"),
  sheet: document.getElementById("location-sheet"),
  sheetCloseButtons: [...document.querySelectorAll(".sheet-close")],
  sheetPhoto: document.getElementById("sheet-photo"),
  sheetCategory: document.getElementById("sheet-category"),
  sheetName: document.getElementById("sheet-name"),
  sheetAddress: document.getElementById("sheet-address"),
  sheetInfo: document.getElementById("sheet-info"),
  sheetContact: document.getElementById("sheet-contact"),
  sheetHours: document.getElementById("sheet-hours"),
  labelInfo: document.getElementById("label-info"),
  labelContact: document.getElementById("label-contact"),
  labelHours: document.getElementById("label-hours"),
  mapsLink: document.getElementById("maps-link"),
  menuLink: document.getElementById("menu-link"),
  languageButtons: [...document.querySelectorAll("[data-lang]")],
};

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.json();
}

function getText(obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[state.lang] || obj.it || obj.en || obj.es || "";
}

function renderSiteText() {
  const copy = translations[state.lang];
  const site = state.site;
  document.documentElement.lang = state.lang;
  el.heroTitle.textContent = getText(site.hero.title);
  el.beerHeading.textContent = copy.inFocus;
  el.beerTitle.textContent = getText(site.beer.title);
  el.beerDescription.textContent = getText(site.beer.description);
  el.mapEyebrow.textContent = copy.mapEyebrow;
  el.mapTitle.textContent = getText(site.map.title);
  el.mapSubtitle.textContent = getText(site.map.subtitle);
  el.labelInfo.textContent = copy.info;
  el.labelContact.textContent = copy.contact;
  el.labelHours.textContent = copy.hours;
}

function createMarkerIcon() {
  return L.divIcon({
    className: "",
    html: '<div class="custom-pin" aria-hidden="true">🍺</div>',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -20],
  });
}

function createBeerMarkerIcon() {
  return L.divIcon({
    className: "beer-marker",
    html:
      '<div class="custom-pin" aria-hidden="true"><span class="custom-pin-inner">&#127866;</span></div>',
    iconSize: [44, 56],
    iconAnchor: [22, 48],
    popupAnchor: [0, -34],
  });
}

function renderMap() {
  if (!state.map) {
    state.map = L.map("map", {
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(state.map);
  }

  state.markers.forEach((marker) => marker.remove());
  state.markers = [];

  const { center, zoom } = state.site.map;
  state.map.setView([center.lat, center.lng], zoom);

  state.locations
    .filter((location) => location.active)
    .forEach((location) => {
      const marker = L.marker([location.coordinates.lat, location.coordinates.lng], {
        icon: createBeerMarkerIcon(),
      }).addTo(state.map);

      marker.on("click", () => openSheet(location));
      state.markers.push(marker);
    });
}

function renderContact(location) {
  const items = [];
  if (location.contact.phone) {
    items.push(
      `<a href="tel:${location.contact.phone}">${location.contact.phone}</a>`
    );
  }
  if (location.contact.email) {
    items.push(
      `<a href="mailto:${location.contact.email}">${location.contact.email}</a>`
    );
  }
  if (location.contact.website) {
    items.push(
      `<a href="${location.contact.website}" target="_blank" rel="noreferrer">${location.contact.website}</a>`
    );
  }

  el.sheetContact.innerHTML = items.length ? items.join("") : "<span>-</span>";
}

function openSheet(location) {
  el.sheetCategory.textContent = getText(location.category);
  el.sheetName.textContent = getText(location.name);
  el.sheetAddress.textContent = getText(location.address);
  el.sheetInfo.textContent = getText(location.info);
  el.sheetHours.textContent = getText(location.hours);
  renderContact(location);

  if (location.photo) {
    el.sheetPhoto.src = location.photo;
    el.sheetPhoto.alt = getText(location.name);
    el.sheetPhoto.hidden = false;
  } else {
    el.sheetPhoto.hidden = true;
    el.sheetPhoto.removeAttribute("src");
  }

  el.mapsLink.textContent = translations[state.lang].openMaps;
  el.mapsLink.href = location.maps_url;

  if (location.menu_pdf) {
    el.menuLink.hidden = false;
    el.menuLink.textContent = translations[state.lang].openMenu;
    el.menuLink.href = location.menu_pdf;
  } else {
    el.menuLink.hidden = true;
    el.menuLink.removeAttribute("href");
  }

  el.sheet.classList.add("is-open");
  el.sheet.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeSheet() {
  el.sheet.classList.remove("is-open");
  el.sheet.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function bindEvents() {
  el.sheetCloseButtons.forEach((button) => {
    button.addEventListener("click", closeSheet);
  });
  el.sheet.addEventListener("click", (event) => {
    if (event.target === el.sheet) {
      closeSheet();
    }
  });
  el.sheet.addEventListener(
    "touchstart",
    (event) => {
      state.touchStartY = event.touches[0]?.clientY || 0;
    },
    { passive: true }
  );
  el.sheet.addEventListener(
    "touchend",
    (event) => {
      const endY = event.changedTouches[0]?.clientY || 0;
      if (endY - state.touchStartY > 72) {
        closeSheet();
      }
    },
    { passive: true }
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && el.sheet.classList.contains("is-open")) {
      closeSheet();
    }
  });

  el.languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.lang;
      el.languageButtons.forEach((item) =>
        item.classList.toggle("is-active", item === button)
      );
      renderSiteText();
      if (state.locations.length && el.sheet.classList.contains("is-open")) {
        const currentName = el.sheetName.textContent;
        const currentLocation = state.locations.find(
          (location) =>
            getText(location.name) === currentName ||
            location.name.it === currentName ||
            location.name.en === currentName ||
            location.name.es === currentName
        );
        if (currentLocation) {
          openSheet(currentLocation);
        }
      }
    });
  });
}

async function init() {
  try {
    const [site, locationsData] = await Promise.all([
      loadJson("/content/site.json"),
      loadJson("/content/locations.json"),
    ]);
    state.site = site;
    state.locations = locationsData.locations || [];
    renderSiteText();
    renderMap();
    bindEvents();
  } catch (error) {
    console.error(error);
    document.body.innerHTML =
      "<main style='padding:24px;font-family:sans-serif'>Impossibile caricare il sito. Verifica che i file di contenuto siano presenti.</main>";
  }
}

init();

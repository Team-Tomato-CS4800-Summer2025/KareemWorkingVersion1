// js/fragrances.js
document.addEventListener("DOMContentLoaded", () => {
  // ─── FAVORITES STORAGE ──────────────────────────────
  const FAVORITES_KEY = "favFrags";
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

  function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  function updateWishlistBadge() {
    const badge = document.getElementById("wishlist-count");
    if (badge) badge.textContent = favorites.length;
  }
  updateWishlistBadge();

  // ─── SELECTORS & CONFIG ─────────────────────────────
  const homeGrid = document.getElementById("allFragrancesGrid");
  const wishlistGrid = document.getElementById("wishlistGrid");
  const isWishlistPage = !!wishlistGrid;
  const tpl = document.getElementById("frag-card-template");

  const scentClasses = {
    Fresh: "scent-fresh",
    Floral: "scent-floral",
    Woody: "scent-woody",
    Oriental: "scent-oriental",
  };
  const seasonClasses = {
    Spring: "season-spring",
    Summer: "season-summer",
    Fall: "season-fall",
    Winter: "season-winter",
  };

  // ─── RENDER ONE CARD ────────────────────────────────
  function renderFragranceCard(row, container) {
    // slugify name
    const slug = row.Name.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // if wishlist page, skip non-favorites
    if (isWishlistPage && !favorites.includes(slug)) return;

    // clone template and fill in data
    const frag = tpl.content.cloneNode(true);
    frag.querySelector(".frag-image").src = `BottleImages/${slug}.avif`;
    frag.querySelector(".frag-image").alt = row.Name;
    frag.querySelector(".frag-name").textContent = row.Name;
    frag.querySelector(".frag-brand").textContent = row.Brand;
    frag.querySelector(".frag-rating").textContent = row.Ratings;
    frag.querySelector(".frag-votes").textContent = `(${row.Votes})`;
    frag.querySelector(
      ".btn-frag-view"
    ).href = `perfume.html?name=${encodeURIComponent(slug)}`;

    // scent pills
    row.Scent.split(",")
      .map((s) => s.trim())
      .forEach((s) => {
        const span = document.createElement("span");
        span.textContent = s;
        span.classList.add(
          "px-2",
          "py-1",
          "text-white",
          scentClasses[s] || "bg-secondary"
        );
        frag.querySelector(".frag-scent-multi").appendChild(span);
      });

    // season pills
    row.Season.split(",")
      .map((s) => s.trim())
      .forEach((s) => {
        const span = document.createElement("span");
        span.textContent = s;
        span.classList.add(
          "px-2",
          "py-1",
          "text-white",
          seasonClasses[s] || "bg-secondary"
        );
        frag.querySelector(".frag-season-multi").appendChild(span);
      });

    // wrap in a <div class="col"> so we can toggle a class if needed
    const cardCol = document.createElement("div");
    cardCol.className = "col";
    cardCol.appendChild(frag);

    // ─── HEART BUTTON TOGGLE ───────────────────────────
    const favBtnImg = cardCol.querySelector(".fav-btn img");

    function refreshHeartIcon() {
      const isFav = favorites.includes(slug);
      favBtnImg.src = isFav ? "Icons/heart-fill.svg" : "Icons/heart.svg";
    }

    cardCol.querySelector(".fav-btn").addEventListener("click", () => {
      if (favorites.includes(slug)) {
        favorites = favorites.filter((s) => s !== slug);
      } else {
        favorites.push(slug);
      }
      saveFavorites();
      updateWishlistBadge();
      refreshHeartIcon();
    });

    // initial icon state
    refreshHeartIcon();

    // append into home vs. wishlist
    const targetGrid = isWishlistPage ? wishlistGrid : homeGrid;
    targetGrid.appendChild(cardCol);
  }

  // ─── LOAD CSV & RENDER ALL ──────────────────────────
  Papa.parse("data/FragranceSheet.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: ({ data }) => {
      data.forEach((row) => {
        if (row.Name) {
          const container = isWishlistPage ? wishlistGrid : homeGrid;
          renderFragranceCard(row, container);
        }
      });
      // (re-hook your filters/search here if needed)
    },
    error: (err) => console.error(err),
  });
});

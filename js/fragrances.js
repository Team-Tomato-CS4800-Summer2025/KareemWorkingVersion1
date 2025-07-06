document.addEventListener("DOMContentLoaded", () => {
  // Wishlist
  const FAVORITES_KEY = "favFrags";
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  function updateWishlistBadge() {
    const b = document.getElementById("wishlist-count");
    if (b) b.textContent = favorites.length;
  }
  updateWishlistBadge();

  // Cart & Swaps
  const CART_KEY = "cartItems";
  const SWAP_KEY = "swapItems";
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  let swaps = JSON.parse(localStorage.getItem(SWAP_KEY)) || [];
  function updateCartSwapBadges() {
    const cb = document.getElementById("cart-count");
    if (cb) cb.textContent = cart.length;
    const sb = document.getElementById("swap-count");
    if (sb) sb.textContent = swaps.length;
  }
  updateCartSwapBadges();

  //  Determine Grid (home vs wishlist)

  const homeGrid = document.getElementById("allFragrancesGrid");
  const wishlistGrid = document.getElementById("wishlistGrid");
  const isWishlist = !!wishlistGrid;
  const grid = isWishlist ? wishlistGrid : homeGrid;

  // Filter UI(skip on wishlist)

  const searchInput = document.getElementById("filter-search");
  const brandSelect = document.getElementById("filter-brand");
  const scentContainer = document.getElementById("filter-scent");
  const seasonContainer = document.getElementById("filter-season");

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

  let allData = [];

  // Load & Parse CSV

  Papa.parse("data/FragranceSheet.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: ({ data }) => {
      allData = data.filter((r) => r.Name);

      if (isWishlist) {
        // Only render saved favorites
        favorites.forEach((slug) => {
          const row = allData.find((r) => slugify(r.Name) === slug);
          if (row) renderCard(row);
        });
      } else {
        // Build filters and render full grid
        buildFilters();
        applyFilters();
      }
    },
    error: console.error,
  });

  // Build Filter Controls

  function buildFilters() {
    // Brand dropdown
    [...new Set(allData.map((r) => r.Brand))].sort().forEach((b) => {
      const o = document.createElement("option");
      o.value = b;
      o.textContent = b;
      brandSelect.appendChild(o);
    });
    brandSelect.addEventListener("change", applyFilters);

    // Scent checkboxes
    [
      ...new Set(
        allData.flatMap((r) => r.Scent.split(",").map((s) => s.trim()))
      ),
    ]
      .sort()
      .forEach((s) => {
        const d = document.createElement("div");
        d.className = "form-check";
        d.innerHTML = `
          <input type="checkbox" class="form-check-input" id="scent-${s}" value="${s}">
          <label class="form-check-label" for="scent-${s}">${s}</label>
        `;
        scentContainer.appendChild(d);
      });
    scentContainer.addEventListener("change", applyFilters);

    // Season checkboxes
    [
      ...new Set(
        allData.flatMap((r) => r.Season.split(",").map((s) => s.trim()))
      ),
    ]
      .sort()
      .forEach((s) => {
        const d = document.createElement("div");
        d.className = "form-check";
        d.innerHTML = `
          <input type="checkbox" class="form-check-input" id="season-${s}" value="${s}">
          <label class="form-check-label" for="season-${s}">${s}</label>
        `;
        seasonContainer.appendChild(d);
      });
    seasonContainer.addEventListener("change", applyFilters);

    // Live Search
    searchInput.addEventListener("input", applyFilters);
  }

  //
  // ─── 5) Filter + Render On Home
  //

  function applyFilters() {
    const term = searchInput.value.toLowerCase();
    const brand = brandSelect.value;
    const scents = [...scentContainer.querySelectorAll("input:checked")].map(
      (i) => i.value
    );
    const seasons = [...seasonContainer.querySelectorAll("input:checked")].map(
      (i) => i.value
    );

    grid.innerHTML = "";
    allData
      .filter((r) => {
        if (term && !r.Name.toLowerCase().includes(term)) return false;
        if (brand && r.Brand !== brand) return false;
        if (
          scents.length &&
          !scents.every((s) =>
            r.Scent.split(",")
              .map((x) => x.trim())
              .includes(s)
          )
        )
          return false;
        if (
          seasons.length &&
          !seasons.every((s) =>
            r.Season.split(",")
              .map((x) => x.trim())
              .includes(s)
          )
        )
          return false;
        return true;
      })
      .forEach(renderCard);
  }

  // ─── 6) Render Card (Home and Wishlist)

  function renderCard(row) {
    // Slugify
    const slug = slugify(row.Name);

    // Clone Template
    const tpl = document.getElementById("frag-card-template");
    const clone = tpl.content.cloneNode(true);

    // Image & Text
    clone.querySelector(".frag-image").src = `BottleImages/${slug}.avif`;
    clone.querySelector(".frag-image").alt = row.Name;
    clone.querySelector(".frag-name").textContent = row.Name;
    clone.querySelector(".frag-brand").textContent = row.Brand;

    // Rating & Votes
    const rEl = clone.querySelector(".frag-rating");
    const vEl = clone.querySelector(".frag-votes");
    if (rEl) rEl.textContent = row.Ratings;
    if (vEl) vEl.textContent = `(${row.Votes})`;

    // View Button
    const view = clone.querySelector(".btn-frag-view");
    if (view) view.href = `perfume.html?name=${encodeURIComponent(slug)}`;

    // Scent Pills
    const sc = clone.querySelector(".frag-scent-multi");
    row.Scent.split(",")
      .map((s) => s.trim())
      .forEach((s) => {
        const span = document.createElement("span");
        span.className = `px-2 py-1 text-white ${scentClasses[s] || ""}`;
        span.textContent = s;
        sc.appendChild(span);
      });

    // Season Pills
    const se = clone.querySelector(".frag-season-multi");
    row.Season.split(",")
      .map((s) => s.trim())
      .forEach((s) => {
        const span = document.createElement("span");
        span.className = `px-2 py-1 text-dark ${seasonClasses[s] || ""}`;
        span.textContent = s;
        se.appendChild(span);
      });

    // Heart Toggle
    const favBtn = clone.querySelector(".fav-btn");
    const favImg = favBtn.querySelector("img");
    function refreshHeart() {
      favImg.src = favorites.includes(slug)
        ? "Icons/heart-fill.svg"
        : "Icons/heart.svg";
    }
    favBtn.addEventListener("click", () => {
      if (favorites.includes(slug)) {
        favorites = favorites.filter((x) => x !== slug);
      } else {
        favorites.push(slug);
      }
      saveFavorites();
      updateWishlistBadge();
      refreshHeart();
    });
    refreshHeart();

    // Wrap & Attach
    const col = document.createElement("div");
    col.className = "col";
    col.appendChild(clone);
    grid.appendChild(col);
  }

  function slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

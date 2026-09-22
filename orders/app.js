/* Two-person kitchen: classic JavaScript, works without a server or build step. */
(() => {
  "use strict";
  const { seedDishes, photoCredits, icons } = window.KITCHEN_DATA;
  const $ = (id) => document.getElementById(id);
  const icon = (name) => icons[name] || "";
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
  const cookLabel = (cooks) => cooks === 3 ? "都会做" : cooks === 1 ? "我会做" : "他会做";
  const cookTag = (cooks) => `<span class="cook-tag ${cooks === 1 ? "hers" : cooks === 2 ? "his" : "both"}">${icon("chef")}${cookLabel(cooks)}</span>`;
  // Isolate multiple GitHub Pages projects on the same origin by their folder path.
  const storageKey = `two-person-kitchen:v1:${new URL("./", location.href).pathname}`;
  let store;
  let state = { version: 1, dishes: [], orders: [] };
  let selected = [];
  let currentTab = "menu";
  let ready = false;
  let editingId = null;
  let draftId = null;
  let pendingDelete = null;
  let orderId = null;
  let toastTimer;
  let lastOpener = null;

  function makeId() {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    return Array.from(bytes, (b, i) => `${[4, 6, 8, 10].includes(i) ? "-" : ""}${b.toString(16).padStart(2, "0")}`).join("");
  }

  function showToast(message, error = false) {
    clearTimeout(toastTimer);
    const toast = $("toast");
    toast.classList.toggle("is-error", error);
    toast.innerHTML = `${icon(error ? "close" : "check")}<span>${escape(message)}</span>`;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4200);
  }

  function setFormError(message) {
    $("form-error").textContent = message;
    $("form-error").hidden = !message;
  }

  function showStorageError(error) {
    ready = false;
    $("storage-error-text").textContent = error?.name === "SecurityError"
      ? "浏览器限制了本地保存。请允许网站存储，或参照说明用本地静态预览打开。"
      : error instanceof Error ? error.message : "浏览器暂时无法保存，请重试。";
    $("storage-error").hidden = false;
    render();
  }

  function applyState(next) {
    state = next;
    ready = true;
    const nextSelection = selected.filter(id => state.dishes.some(dish => dish.id === id));
    if (nextSelection.length !== selected.length) orderId = null;
    selected = nextSelection;
    $("storage-error").hidden = true;
    render();
  }

  function load() {
    try {
      store = new window.KitchenStorage(window.localStorage, storageKey, seedDishes);
      applyState(store.read());
    } catch (error) {
      showStorageError(error);
    }
  }

  function switchTab(tab, moveFocus = false) {
    currentTab = tab === "orders" ? "orders" : "menu";
    for (const name of ["menu", "orders"]) {
      const active = currentTab === name;
      $(`${name}-view`).hidden = !active;
      $(`${name}-tab`).setAttribute("aria-selected", String(active));
      $(`${name}-tab`).classList.toggle("nav-active", active);
      $(`${name}-tab`).tabIndex = active ? 0 : -1;
    }
    if (moveFocus) $(`${currentTab}-tab`).focus();
  }

  function photo(dish, controls = "") {
    const content = dish.image
      ? `<img src="./assets/food/${dish.image}.webp" alt="${escape(dish.name)}" loading="lazy" ${dish.image === "wings" ? 'style="object-position:center 75%"' : ""}>`
      : icon("utensils");
    return `<div class="dish-photo ${dish.image ? "" : "fallback-photo"}">${content}${controls}</div>`;
  }

  function renderDishes() {
    $("dish-count").textContent = state.dishes.length;
    $("example-note").hidden = !state.dishes.some(d => d.image);
    if (!ready && !state.dishes.length) {
      $("dish-list").innerHTML = `<div class="blank-menu">${icon("utensils")}<h3>还没能打开小菜单</h3><p>请查看上方提示，保存恢复后再开始点菜。</p></div>`;
      return;
    }
    if (!state.dishes.length) {
      $("dish-list").innerHTML = `<div class="blank-menu">${icon("chef")}<h3>菜单的第一页，留给你的拿手菜</h3><p>添加一道你或他会做的菜，就可以开始点菜了。</p><button class="button primary" data-action="add" data-needs-storage>${icon("plus")}添加第一道菜</button></div>`;
      return;
    }
    $("dish-list").innerHTML = state.dishes.map(dish => {
      const chosen = selected.includes(dish.id);
      return `<article class="dish-card ${chosen ? "is-selected" : ""}">
        ${photo(dish, `<button class="edit-dish" data-action="edit" data-id="${escape(dish.id)}" aria-label="编辑${escape(dish.name)}" data-needs-storage>${icon("edit")}</button>${chosen ? `<span class="selected-ribbon">${icon("check")}这顿想吃</span>` : ""}`)}
        <div class="dish-body"><h3>${escape(dish.name)}</h3><p title="${escape(dish.description)}">${escape(dish.description || "新加入的拿手菜，等着一起尝尝。")}</p><div class="dish-bottom">${cookTag(dish.cooks)}<button class="add-dish ${chosen ? "chosen" : ""}" data-action="toggle" data-id="${escape(dish.id)}" aria-pressed="${chosen}" aria-label="${chosen ? "取消" : "想吃"}${escape(dish.name)}" data-needs-storage>${icon(chosen ? "check" : "plus")}</button></div></div>
      </article>`;
    }).join("");
  }

  function renderSelection() {
    const chosen = selected.map(id => state.dishes.find(d => d.id === id)).filter(Boolean);
    $("selected-count").textContent = chosen.length;
    $("mobile-count").textContent = chosen.length;
    $("mobile-order").hidden = !chosen.length;
    $("order-summary").textContent = chosen.length ? `已选 ${chosen.length} 道菜` : "用心做的每一餐";
    $("submit-order").disabled = !ready || !chosen.length;
    $("selected-list").innerHTML = chosen.length ? chosen.map((dish, i) => `<div class="receipt-item"><span class="item-number">${String(i + 1).padStart(2, "0")}</span><div class="receipt-dish"><strong>${escape(dish.name)}</strong><span>${cookLabel(dish.cooks)}</span></div><button class="remove-dish" data-action="toggle" data-id="${escape(dish.id)}" aria-label="移除${escape(dish.name)}" data-needs-storage>${icon("close")}</button></div>`).join("")
      : `<div class="empty-cart">${icon("basket")}<h3>还没想好吃什么？</h3><p>点点菜品旁的 ＋<br>把喜欢的菜加进来吧</p></div>`;
  }

  function renderOrders() {
    $("nav-count").textContent = state.orders.length || "";
    $("history-count").textContent = state.orders.length;
    if (!state.orders.length) {
      $("history-list").innerHTML = `<div class="blank-menu">${icon("orders")}<h3>第一餐，从想吃的菜开始</h3><p>在菜单里选几道菜，点击「就吃这些」即可下单。</p><button class="button primary" data-action="tab" data-tab="menu">去看看菜单 ${icon("arrow")}</button></div>`;
      return;
    }
    const format = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
    $("history-list").innerHTML = state.orders.map((order, i) => `<article class="history-card"><header><h3>${icon("orders")}${i === 0 ? "最新一餐" : "我们的点菜单"}</h3><span class="order-saved">${icon("check")}已下单</span></header><time datetime="${new Date(order.createdAt).toISOString()}">${format.format(new Date(order.createdAt))}</time><div class="history-items">${order.items.map((dish, j) => `<div><span class="item-number">${String(j + 1).padStart(2, "0")}</span><strong>${escape(dish.name)}</strong>${cookTag(dish.cooks)}</div>`).join("")}</div><p>共 ${order.items.length} 道菜 ${icon("heart")}</p></article>`).join("");
  }

  function render() {
    // Keep keyboard focus on the same control after a menu update.
    const active = document.activeElement;
    const focusAction = active?.dataset?.action;
    const focusId = active?.dataset?.id;
    renderDishes();
    renderSelection();
    renderOrders();
    document.querySelectorAll("[data-needs-storage]").forEach(button => { button.disabled = !ready; });
    if (focusId && focusAction && !document.contains(active)) {
      const replacement = [...document.querySelectorAll("[data-action][data-id]")].find(el => el.dataset.action === focusAction && el.dataset.id === focusId);
      replacement?.focus({ preventScroll: true });
    }
  }

  function openEditor(id, opener) {
    if (!ready) return;
    const dish = id ? state.dishes.find(d => d.id === id) : null;
    if (id && !dish) return;
    editingId = dish?.id || null;
    draftId = editingId || makeId();
    lastOpener = opener || null;
    $("dish-name").value = dish?.name || "";
    $("dish-description").value = dish?.description || "";
    $("cook-me").checked = !!((dish?.cooks ?? 1) & 1);
    $("cook-him").checked = !!((dish?.cooks ?? 1) & 2);
    $("editor-title-text").textContent = dish ? "编辑拿手菜" : "添一道拿手菜";
    $("editor-description").textContent = dish ? "更新菜品，也记得选好谁会做。" : "从会做的一道菜开始，慢慢丰富我们的小食堂。";
    $("delete-dish").hidden = !dish;
    setFormError("");
    $("dish-dialog").showModal();
    $("dish-name").focus();
  }

  $("dish-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const cooks = (Number($("cook-me").checked) * 1) | (Number($("cook-him").checked) * 2);
    const draft = { id: draftId, name: $("dish-name").value.trim(), description: $("dish-description").value.trim(), cooks };
    if (!draft.name) { setFormError("给这道菜起个名字吧。"); $("dish-name").focus(); return; }
    if (!cooks) { setFormError("至少选择一位会做这道菜的人。"); return; }
    try {
      applyState(editingId ? store.updateDish(draft) : store.createDish(draft));
      $("dish-dialog").close();
      showToast(editingId ? "拿手菜已更新" : "新菜加入我们的菜单啦");
    } catch (error) {
      setFormError(error.message);
    }
  });

  function toggleDish(id) {
    if (!ready) return;
    orderId = null;
    selected = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    render();
  }

  function submitOrder() {
    if (!ready || !selected.length) return;
    try {
      orderId ||= makeId();
      const next = store.createOrder({ id: orderId, dishIds: selected });
      selected = [];
      orderId = null;
      applyState(next);
      switchTab("orders", true);
      showToast("下单成功，这顿就吃这些！");
      $("orders-tab").scrollIntoView({ block: "nearest" });
    } catch (error) {
      showToast(error.message, true);
    }
  }

  function startDelete() {
    pendingDelete = state.dishes.find(d => d.id === editingId);
    if (!pendingDelete) return;
    $("delete-title").textContent = `从菜单里移除「${pendingDelete.name}」？`;
    $("delete-error").hidden = true;
    $("delete-dialog").showModal();
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    try {
      applyState(store.deleteDish(pendingDelete.id));
      pendingDelete = null;
      $("delete-dialog").close();
      $("dish-dialog").close();
      document.querySelector('[data-action="add"]').focus();
      showToast("已从菜单中移除");
    } catch (error) {
      $("delete-error").textContent = error.message;
      $("delete-error").hidden = false;
    }
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;
    const { action, id, tab } = button.dataset;
    switch (action) {
      case "add": openEditor(null, button); break;
      case "edit": openEditor(id, button); break;
      case "toggle": toggleDish(id); break;
      case "tab": switchTab(tab); break;
      case "submit": submitOrder(); break;
      case "start-delete": startDelete(); break;
      case "confirm-delete": confirmDelete(); break;
      case "cancel-delete": $("delete-dialog").close(); break;
      case "close-editor": $("dish-dialog").close(); break;
      case "credits": $("credits-dialog").showModal(); break;
      case "close-credits": $("credits-dialog").close(); break;
      case "retry": load(); break;
    }
  });

  document.querySelector('[role="tablist"]').addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      switchTab(event.key === "Home" ? "menu" : event.key === "End" ? "orders" : currentTab === "menu" ? "orders" : "menu", true);
    }
  });

  $("dish-dialog").addEventListener("close", () => {
    if (lastOpener && document.contains(lastOpener)) lastOpener.focus();
    else {
      const button = [...document.querySelectorAll('[data-action="edit"]')].find(b => b.dataset.id === editingId);
      (button || document.querySelector('[data-action="add"]'))?.focus({ preventScroll: true });
    }
  });

  // Preserve in-progress form text; only the saved menu is refreshed by other tabs.
  window.addEventListener("storage", event => {
    if (event.key === storageKey || event.key === null) {
      try { applyState(store.read()); } catch (error) { showStorageError(error); }
    }
  });
  window.addEventListener("focus", () => {
    if (!store || !ready) return;
    try { applyState(store.read()); } catch (error) { showStorageError(error); }
  });

  // A missing asset should not prevent using the associated dish.
  document.addEventListener("error", event => {
    if (event.target instanceof HTMLImageElement && event.target.closest(".dish-photo")) {
      const wrapper = event.target.parentElement;
      event.target.remove();
      wrapper.classList.add("fallback-photo");
      wrapper.insertAdjacentHTML("afterbegin", icon("utensils"));
    }
  }, true);

  document.querySelectorAll("[data-icon]").forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  $("credits-list").innerHTML = photoCredits.map(credit => `<p><a href="${escape(credit.source)}" target="_blank" rel="noopener noreferrer">${escape(credit.dish)}</a><span>${escape(credit.author)} · <a href="${escape(credit.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(credit.license)}</a></span></p>`).join("");
  load();
})();

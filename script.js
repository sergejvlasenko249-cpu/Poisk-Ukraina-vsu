const records = [
  {name:"Приклад: Іваненко О.С.", city:"Київ", date:"—", unit:"—", status:"missing", statusText:"Приклад запису"},
  {name:"Приклад: Петренко М.В.", city:"Харків", date:"—", unit:"—", status:"found", statusText:"Приклад запису"}
];

const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const button = document.getElementById("searchButton");
let currentFilter = "all";
let isSearching = false;

function render() {
  const q = input.value.trim().toLowerCase();

  if (!q) {
    results.innerHTML = `<div class="empty">Введіть дані для пошуку. База даних оновлюється.</div>`;
    return;
  }

  // Показываем загрузку
  isSearching = true;
  button.disabled = true;
  button.textContent = "Пошук...";
  results.innerHTML = `
    <div class="empty search-loading">
      <div class="spinner"></div>
      <p>Йде перевірка бази даних (це може зайняти кілька секунд)...</p>
    </div>
  `;

  // Имитируем задержку поиска (1.5 сек)
  setTimeout(() => {
    isSearching = false;
    button.disabled = false;
    button.textContent = "Шукати";

    const filtered = records.filter(r => {
      const matchesFilter = currentFilter === "all" || r.status === currentFilter;
      const haystack = `${r.name} ${r.city} ${r.unit}`.toLowerCase();
      return matchesFilter && haystack.includes(q);
    });

    if (!filtered.length) {
      results.innerHTML = `
        <div class="empty search-notfound">
          <div style="font-size:42px; margin-bottom:10px;">😔</div>
          <strong>Записів не знайдено</strong>
          <p>У відкритій базі немає даних за вашим запитом.<br>Можливо, інформація ще не додана або знаходиться в закритому доступі.</p>
          <a href="#request" class="button primary" style="margin-top:12px;">Залишити запит на пошук →</a>
        </div>
      `;
      return;
    }

    results.innerHTML = filtered.map(r => `
      <article class="result-card">
        <div class="result-top">
          <h3>${escapeHtml(r.name)}</h3>
          <span class="status">${escapeHtml(r.statusText)}</span>
        </div>
        <dl>
          <dt>Населений пункт</dt><dd>${escapeHtml(r.city)}</dd>
          <dt>Підрозділ</dt><dd>${escapeHtml(r.unit)}</dd>
          <dt>Дата останнього зв'язку</dt><dd>${escapeHtml(r.date)}</dd>
        </dl>
      </article>
    `).join("");
  }, 6000);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function sendToTelegram(e) {
  e.preventDefault();
  const name = document.getElementById("reqName").value.trim();
  const city = document.getElementById("reqCity").value.trim();
  const date = document.getElementById("reqDate").value.trim();
  const contact = document.getElementById("reqContact").value.trim();
  const info = document.getElementById("reqInfo").value.trim();

  if (!name || !contact) {
    alert("Будь ласка, заповніть обов'язкові поля: ФІО та контакт");
    return false;
  }

  const text = encodeURIComponent(
    `🔍 Запит на пошук\n\n` +
    `👤 Кого шукаємо: ${name}\n` +
    `📍 Місто/підрозділ: ${city || "—"}\n` +
    `📅 Дата останнього зв'язку: ${date || "—"}\n` +
    `📞 Контакт: ${contact}\n` +
    `📝 Додатково: ${info || "—"}`
  );

  window.open(`https://t.me/Lutuiruslan?text=${text}`, "_blank");
  return false;
}

button.addEventListener("click", render);
input.addEventListener("keydown", e => { if (e.key === "Enter" && !isSearching) render(); });
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    if (input.value.trim()) render();
  });
});
document.getElementById("year").textContent = new Date().getFullYear();
render();
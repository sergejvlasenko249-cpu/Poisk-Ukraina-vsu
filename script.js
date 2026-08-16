const records = [
  {name:"Приклад: Іваненко О.С.", city:"Київ", date:"—", unit:"—", status:"missing", statusText:"Приклад запису"},
  {name:"Приклад: Петренко М.В.", city:"Харків", date:"—", unit:"—", status:"found", statusText:"Приклад запису"}
];

const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const button = document.getElementById("searchButton");
let currentFilter = "all";

function render() {
  const q = input.value.trim().toLowerCase();
  const filtered = records.filter(r => {
    const matchesFilter = currentFilter === "all" || r.status === currentFilter;
    const haystack = `${r.name} ${r.city} ${r.unit}`.toLowerCase();
    return matchesFilter && (!q || haystack.includes(q));
  });

  if (!q) {
    results.innerHTML = `<div class="empty">Введіть дані для пошуку. База даних оновлюється.</div>`;
    return;
  }

  if (!filtered.length) {
    results.innerHTML = `<div class="empty">По вашому запиту записів не знайдено. <a href="#request" style="color:#17202a; font-weight:700;">Залиште запит на пошук →</a></div>`;
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
input.addEventListener("keydown", e => { if (e.key === "Enter") render(); });
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});
document.getElementById("year").textContent = new Date().getFullYear();
render();
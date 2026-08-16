const records = [
  {name:"Пример записи", city:"Демо-запись", date:"—", unit:"—", status:"missing", statusText:"Пример"},
  {name:"Тестовая запись", city:"Демонстрация", date:"—", unit:"—", status:"found", statusText:"Информация обновлена"}
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
    results.innerHTML = `<div class="empty">Введите данные для поиска. Реальная база данных будет подключена на следующем этапе.</div>`;
    return;
  }

  if (!filtered.length) {
    results.innerHTML = `<div class="empty">По вашему запросу записей в демонстрационной базе нет.</div>`;
    return;
  }

  results.innerHTML = filtered.map(r => `
    <article class="result-card">
      <div class="result-top">
        <h3>${escapeHtml(r.name)}</h3>
        <span class="status">${escapeHtml(r.statusText)}</span>
      </div>
      <dl>
        <dt>Населённый пункт</dt><dd>${escapeHtml(r.city)}</dd>
        <dt>Подразделение</dt><dd>${escapeHtml(r.unit)}</dd>
        <dt>Дата последней связи</dt><dd>${escapeHtml(r.date)}</dd>
      </dl>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
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

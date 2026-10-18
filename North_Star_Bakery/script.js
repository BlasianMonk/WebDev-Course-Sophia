"use strict";
// Product objects provide stable IDs and readable labels.
const bakeryProducts = [
  { id: "bread", name: "Signature Loaf" },
  { id: "pastry", name: "Pastries" },
  { id: "cake", name: "Celebration Cakes" }
];
const favoriteStorageKey = "northStarBakeryFavorites";
function loadFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(favoriteStorageKey) || "[]");
    return Array.isArray(value) ? value.filter(id => bakeryProducts.some(p => p.id === id)) : [];
  } catch (error) { return []; }
}
function saveFavorites(favorites) {
  try { localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites)); }
  catch (error) { const note = document.getElementById("storage-note"); if (note) note.textContent = "Favorites cannot be saved in this browser session."; }
}
function renderFavorites(favorites) {
  const summary = document.getElementById("favorite-summary");
  if (!summary) return;
  const names = bakeryProducts.filter(p => favorites.includes(p.id)).map(p => p.name);
  summary.textContent = names.length ? "Saved favorites: " + names.join(", ") : "No favorites selected yet.";
  document.querySelectorAll("[data-favorite-id]").forEach(button => {
    const active = favorites.includes(button.dataset.favoriteId);
    button.setAttribute("aria-pressed", String(active));
    button.textContent = active ? "Remove from favorites" : "Save as favorite";
  });
}
function initializeFavorites() {
  if (!document.getElementById("favorite-summary")) return;
  let favorites = loadFavorites();
  renderFavorites(favorites);
  document.querySelectorAll("[data-favorite-id]").forEach(button => button.addEventListener("click", () => {
    const id = button.dataset.favoriteId;
    favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    saveFavorites(favorites);
    renderFavorites(favorites);
  }));
}
const validationRules = {
  name: { message: "Enter your name (at least 2 characters).", test: value => value.trim().length >= 2 },
  email: { message: "Enter a valid email address.", test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) },
  "request-type": { message: "Choose a request type.", test: value => value !== "" },
  details: { message: "Enter at least 5 characters.", test: value => value.trim().length >= 5 }
};
function validateField(field) {
  const rule = validationRules[field.id];
  if (!rule) return true;
  const valid = rule.test(field.value);
  const error = document.getElementById(field.id + "-error");
  if (error) error.textContent = valid ? "" : rule.message;
  field.classList.toggle("invalid", !valid);
  field.setAttribute("aria-invalid", String(!valid));
  return valid;
}
function initializeForm() {
  const form = document.getElementById("inquiry-form");
  if (!form) return;
  const fields = Object.keys(validationRules).map(id => document.getElementById(id));
  fields.forEach(field => {
    field.addEventListener("input", () => { validateField(field); clearFormStatus(); });
    field.addEventListener("change", () => { validateField(field); clearFormStatus(); });
  });
  form.addEventListener("submit", event => {
    event.preventDefault(); // Demo site: never submit to a nonexistent backend.
    const results = fields.map(validateField);
    const status = document.getElementById("form-status");
    const valid = results.every(Boolean);
    status.className = valid ? "success" : "error";
    status.textContent = valid ? "Your request is ready for review. This demo does not send messages." : "Please correct the highlighted fields.";
    if (!valid) fields[results.indexOf(false)].focus();
  });
}
function clearFormStatus() {
  const status = document.getElementById("form-status");
  if (status) { status.textContent = ""; status.className = ""; }
}
document.addEventListener("DOMContentLoaded", () => { initializeFavorites(); initializeForm(); });

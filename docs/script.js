const quartiers = ['Moulins', 'Vauban', 'Vieux-Lille', 'Centre'];
const categories = ['Maison', 'Mode', 'High-tech', 'Livres', 'Mobilier', 'Cuisine', 'Autre'];
const etats = ['Comme neuf', 'Très bon état', 'Bon état', 'À réparer'];
const tailles = ['Non précisée', 'XS', 'S', 'M', 'L', 'XL', 'Unique'];

const baseAnnonces = [
  {
    id: '1',
    titre: 'Lampe de bureau',
    categorie: 'Maison',
    quartier: 'Vauban',
    marque: 'Ikea',
    taille: 'Unique',
    etat: 'Très bon état',
    description: 'Lampe orientable pour bureau étudiant, faible consommation.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '2',
    titre: 'Micro-ondes étudiant',
    categorie: 'Cuisine',
    quartier: 'Moulins',
    marque: 'Samsung',
    taille: 'Unique',
    etat: 'Bon état',
    description: 'Fonctionne bien, idéal pour studio, petite trace sur le côté.',
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '3',
    titre: 'Chaise de bureau',
    categorie: 'Mobilier',
    quartier: 'Centre',
    marque: '',
    taille: 'Unique',
    etat: 'Comme neuf',
    description: 'Chaise confortable pour réviser, assise rembourrée, légère.',
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80',
  },
];

const storageKey = 'troc-etudiant-annonces';
const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
const annonces = Array.isArray(stored) && stored.length ? stored : baseAnnonces.slice();

let swipeIndex = 0;
let history = [];
let drag = { active: false, startX: 0, offsetX: 0 };
let selectedCategory = categories[0];

const tabs = document.querySelectorAll('[data-tab-target]');
const panels = document.querySelectorAll('[data-tab-panel]');
const activeCard = document.getElementById('activeCard');
const nextCardMedia = document.getElementById('nextCardMedia');

const refs = {
  image: document.getElementById('cardImage'),
  quartier: document.getElementById('cardQuartier'),
  step: document.getElementById('cardStep'),
  categorie: document.getElementById('cardCategorie'),
  etat: document.getElementById('cardEtat'),
  titre: document.getElementById('cardTitre'),
  description: document.getElementById('cardDescription'),
  details: document.getElementById('cardDetails'),
  like: document.getElementById('swipeLike'),
  pass: document.getElementById('swipePass'),
};

function saveAnnonces() {
  localStorage.setItem(storageKey, JSON.stringify(annonces));
}

function setTab(target) {
  tabs.forEach((button) => button.classList.toggle('active', button.dataset.tabTarget === target));
  panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.tabPanel === target));
}

tabs.forEach((button) => {
  button.addEventListener('click', () => setTab(button.dataset.tabTarget));
});

function createDetail(label, value) {
  const pill = document.createElement('span');
  pill.className = 'detail-pill';
  pill.innerHTML = `<strong>${label}</strong> ${value || 'Non précisée'}`;
  return pill;
}

function renderCard() {
  const current = annonces[swipeIndex];
  const next = annonces[(swipeIndex + 1) % annonces.length];

  refs.image.src = current.image;
  refs.image.alt = current.titre;
  refs.quartier.textContent = current.quartier;
  refs.step.textContent = `${swipeIndex + 1} / ${annonces.length}`;
  refs.categorie.textContent = current.categorie;
  refs.etat.textContent = current.etat;
  refs.titre.textContent = current.titre;
  refs.description.textContent = current.description;
  refs.details.innerHTML = '';
  refs.details.append(createDetail('Marque', current.marque));
  refs.details.append(createDetail('Taille', current.taille));

  nextCardMedia.innerHTML = `<div class="ghost-image" style="background-image:url('${next.image}')"></div>`;

  activeCard.style.transform = 'translateX(0) rotate(0deg)';
  refs.like.classList.add('hidden');
  refs.pass.classList.add('hidden');
}

function goNext() {
  history.push(swipeIndex);
  swipeIndex = (swipeIndex + 1) % annonces.length;
  renderCard();
}

function goBack() {
  if (!history.length) return;
  swipeIndex = history.pop();
  renderCard();
}

function interest() {
  window.alert(`Tu es intéressé par "${annonces[swipeIndex].titre}".`);
}

document.getElementById('skipButton').addEventListener('click', goNext);
document.getElementById('backButton').addEventListener('click', goBack);
document.getElementById('interestButton').addEventListener('click', interest);
document.getElementById('photoButton').addEventListener('click', () => {
  window.alert("Ici on branchera plus tard un vrai sélecteur de photo.");
});

activeCard.addEventListener('pointerdown', (event) => {
  drag = { active: true, startX: event.clientX, offsetX: 0 };
  activeCard.setPointerCapture(event.pointerId);
});

activeCard.addEventListener('pointermove', (event) => {
  if (!drag.active) return;
  drag.offsetX = event.clientX - drag.startX;
  activeCard.style.transform = `translateX(${drag.offsetX}px) rotate(${drag.offsetX / 18}deg)`;
  refs.like.classList.toggle('hidden', drag.offsetX <= 60);
  refs.pass.classList.toggle('hidden', drag.offsetX >= -60);
});

function releaseSwipe(event) {
  if (!drag.active) return;
  drag.active = false;
  activeCard.releasePointerCapture(event.pointerId);

  if (Math.abs(drag.offsetX) > 120) {
    goNext();
    return;
  }

  activeCard.style.transform = 'translateX(0) rotate(0deg)';
  refs.like.classList.add('hidden');
  refs.pass.classList.add('hidden');
}

activeCard.addEventListener('pointerup', releaseSwipe);
activeCard.addEventListener('pointercancel', releaseSwipe);

function fillSelect(id, values) {
  const select = document.getElementById(id);
  select.innerHTML = values
    .map((value) => `<option value="${value}">${value}</option>`)
    .join('');
}

function renderCategoryChoices() {
  const container = document.getElementById('categoryChoices');
  container.innerHTML = '';

  categories.forEach((category, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `choice-chip${index === 0 ? ' selected' : ''}`;
    button.textContent = category;
    button.addEventListener('click', () => {
      selectedCategory = category;
      container.querySelectorAll('.choice-chip').forEach((chip) => chip.classList.remove('selected'));
      button.classList.add('selected');
    });
    container.append(button);
  });
}

fillSelect('quartierSelect', quartiers);
fillSelect('etatSelect', etats);
fillSelect('tailleSelect', tailles);
renderCategoryChoices();

document.getElementById('addForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const annonce = {
    id: String(Date.now()),
    titre: formData.get('titre').trim(),
    categorie: selectedCategory,
    quartier: formData.get('quartier'),
    marque: formData.get('marque').trim(),
    taille: formData.get('taille'),
    etat: formData.get('etat'),
    description: formData.get('description').trim(),
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80',
  };

  annonces.unshift(annonce);
  saveAnnonces();
  history = [];
  swipeIndex = 0;
  renderCard();
  event.currentTarget.reset();
  selectedCategory = categories[0];
  renderCategoryChoices();
  setTab('home');
  window.alert(`Annonce ajoutée : ${annonce.titre}`);
});

renderCard();

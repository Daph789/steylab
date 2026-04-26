import { useRef, useState } from 'react';

const quartiers = ['Moulins', 'Vauban', 'Vieux-Lille', 'Centre'];
const categories = ['Maison', 'Mode', 'High-tech', 'Livres', 'Mobilier', 'Cuisine', 'Autre'];
const etats = ['Comme neuf', 'Très bon état', 'Bon état', 'À réparer'];
const tailles = ['XS', 'S', 'M', 'L', 'XL', 'Unique'];

const annoncesInitiales = [
  {
    id: '1',
    titre: 'Lampe de bureau',
    categorie: 'Maison',
    quartier: 'Vauban',
    marque: 'Ikea',
    taille: 'Unique',
    etat: 'Très bon état',
    description: 'Lampe orientable pour bureau étudiant, faible consommation.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
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
    image:
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=1200&q=80',
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
    image:
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80',
  },
];

function DetailPill({ label, value }) {
  if (!value) return null;
  return (
    <span className="detail-pill">
      <strong>{label}</strong> {value}
    </span>
  );
}

function SwipeShowcase({ annonces, swipeIndex, dragState, onDragStart, onDragMove, onDragEnd, onNext, onPrevious }) {
  const current = annonces[swipeIndex];
  const nextCard = annonces[(swipeIndex + 1) % annonces.length];
  const dragStyle = {
    transform: `translateX(${dragState.offsetX}px) rotate(${dragState.offsetX / 18}deg)`,
    transition: dragState.isDragging ? 'none' : 'transform 0.28s ease',
  };
  const swipeLabel =
    dragState.offsetX > 60 ? 'Intéressé' : dragState.offsetX < -60 ? 'Passer' : '';

  return (
    <section className="swipe-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Swipe</p>
          <h2>Découvre les dons comme sur une app de rencontre</h2>
        </div>
        <p className="section-copy">
          Une carte mise en avant, des infos utiles, puis tu passes à la suivante si ce n&apos;est pas
          pour toi.
        </p>
      </div>

      <div className="swipe-layout">
        <div className="swipe-deck">
          <article className="swipe-card swipe-card-back" aria-hidden="true">
            <div className="card-media swipe-media">
              <img src={nextCard.image} alt="" />
            </div>
          </article>

          <article
            className="swipe-card swipe-card-front"
            style={dragStyle}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
          >
            <div className="card-media swipe-media">
              <img src={current.image} alt={current.titre} />
              <span className="card-chip">{current.quartier}</span>
              <span className="swipe-step">
                {swipeIndex + 1} / {annonces.length}
              </span>
              {swipeLabel ? (
                <span className={`swipe-feedback ${dragState.offsetX > 0 ? 'positive' : 'negative'}`}>
                  {swipeLabel}
                </span>
              ) : null}
            </div>

            <div className="card-content">
              <div className="card-topline">
                <span className="category-badge">{current.categorie}</span>
                <span className="state-badge">{current.etat}</span>
              </div>
              <h3>{current.titre}</h3>
              <p>{current.description}</p>

              <div className="details-row">
                <DetailPill label="Marque" value={current.marque || 'Non précisée'} />
                <DetailPill label="Taille" value={current.taille || 'Non précisée'} />
              </div>

              <div className="swipe-actions">
                <button type="button" className="secondary-button" onClick={onPrevious}>
                  Revenir
                </button>
                <button type="button" className="secondary-button" onClick={onNext}>
                  Passer
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => window.alert(`Tu es intéressé par "${current.titre}".`)}
                >
                  Ça m&apos;intéresse
                </button>
              </div>
            </div>
          </article>
        </div>

        <aside className="swipe-sidepanel">
          <h3>Infos utiles</h3>
          <ul>
            <li>Une seule annonce visible à la fois</li>
            <li>Glisse à gauche ou à droite comme sur une app de rencontre</li>
            <li>Le bouton revenir reste gratuit et disponible</li>
            <li>La carte suivante apparaît sous la carte active</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

function HomeView({ annonces, swipeIndex, dragState, onDragStart, onDragMove, onDragEnd, onNext, onPrevious }) {
  return (
    <section className="page-section">
      <div className="hero">
        <div>
          <p className="eyebrow">Steylab x Lille</p>
          <h1>Troc&apos;Etudiant</h1>
          <p className="hero-copy">
            Des objets utiles, gratuits, à récupérer entre étudiants sans friction.
          </p>
        </div>
        <div className="hero-badge">
          <span>+120</span>
          <p>objets sauvés du gaspillage ce mois-ci</p>
        </div>
      </div>

      <SwipeShowcase
        annonces={annonces}
        swipeIndex={swipeIndex}
        dragState={dragState}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </section>
  );
}

function AddView({ onAdd }) {
  const [form, setForm] = useState({
    titre: '',
    categorie: categories[0],
    quartier: quartiers[0],
    marque: '',
    taille: '',
    etat: etats[0],
    description: '',
  });

  const canSubmit = form.titre.trim().length > 0 && form.description.trim().length > 0;

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const annonce = {
      id: String(Date.now()),
      titre: form.titre.trim(),
      categorie: form.categorie,
      quartier: form.quartier,
      marque: form.marque.trim(),
      taille: form.taille.trim(),
      etat: form.etat,
      description: form.description.trim(),
      image:
        'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80',
    };

    onAdd(annonce);
    window.alert(
      `Annonce simulée\nTitre: ${annonce.titre}\nCatégorie: ${annonce.categorie}\nQuartier: ${annonce.quartier}\nPhoto: ajout simulé`
    );

    setForm({
      titre: '',
      categorie: categories[0],
      quartier: quartiers[0],
      marque: '',
      taille: '',
      etat: etats[0],
      description: '',
    });
  };

  return (
    <section className="page-section">
      <div className="form-layout">
        <div className="form-intro">
          <p className="eyebrow">Publier un don</p>
          <h1>Un formulaire plus riche, comme une annonce marketplace</h1>
          <p>
            On prépare déjà la structure pour une base de données propre : catégorie, état,
            marque, taille, quartier et description détaillée.
          </p>
        </div>

        <form className="donation-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Titre</span>
            <input
              type="text"
              value={form.titre}
              onChange={(event) => updateField('titre', event.target.value)}
              placeholder="Ex: Veste en jean, grille-pain, chaise..."
            />
          </label>

          <div className="field">
            <span>Catégorie</span>
            <div className="chip-row">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`choice-chip ${form.categorie === item ? 'selected' : ''}`}
                  onClick={() => updateField('categorie', item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="dual-fields">
            <label className="field">
              <span>Quartier</span>
              <select value={form.quartier} onChange={(event) => updateField('quartier', event.target.value)}>
                {quartiers.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>État</span>
              <select value={form.etat} onChange={(event) => updateField('etat', event.target.value)}>
                {etats.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="dual-fields">
            <label className="field">
              <span>Marque (optionnel)</span>
              <input
                type="text"
                value={form.marque}
                onChange={(event) => updateField('marque', event.target.value)}
                placeholder="Ex: Nike, Ikea, Samsung..."
              />
            </label>

            <label className="field">
              <span>Taille (optionnel)</span>
              <select value={form.taille} onChange={(event) => updateField('taille', event.target.value)}>
                <option value="">Non précisée</option>
                {tailles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows="5"
              placeholder="Ajoute l'état, les dimensions, les défauts éventuels, comment récupérer l'objet..."
            />
          </label>

          <div className="field">
            <span>Photo</span>
            <button
              type="button"
              className="photo-dropzone"
              onClick={() => window.alert('Ici on branchera le vrai sélecteur de photo.')}
            >
              <strong>+</strong>
              <p>Ajouter jusqu&apos;à 3 photos</p>
            </button>
          </div>

          <button type="submit" className="submit-button" disabled={!canSubmit}>
            Publier l&apos;annonce
          </button>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [annonces, setAnnonces] = useState(annoncesInitiales);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [dragState, setDragState] = useState({ isDragging: false, startX: 0, offsetX: 0 });
  const swipeHistory = useRef([]);
  const dragRef = useRef({ isDragging: false, startX: 0, offsetX: 0 });

  const handleAdd = (annonce) => {
    setAnnonces((current) => [annonce, ...current]);
    setSwipeIndex(0);
    swipeHistory.current = [];
    setActiveTab('home');
  };

  const handleNextSwipe = () => {
    swipeHistory.current = [...swipeHistory.current, swipeIndex];
    setSwipeIndex((current) => (current + 1) % annonces.length);
    dragRef.current = { isDragging: false, startX: 0, offsetX: 0 };
    setDragState({ isDragging: false, startX: 0, offsetX: 0 });
  };

  const handlePreviousSwipe = () => {
    const history = swipeHistory.current;
    if (history.length === 0) {
      return;
    }

    const previousIndex = history[history.length - 1];
    swipeHistory.current = history.slice(0, -1);
    setSwipeIndex(previousIndex);
    dragRef.current = { isDragging: false, startX: 0, offsetX: 0 };
    setDragState({ isDragging: false, startX: 0, offsetX: 0 });
  };

  const handleDragStart = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const nextState = { isDragging: true, startX: event.clientX, offsetX: 0 };
    dragRef.current = nextState;
    setDragState(nextState);
  };

  const handleDragMove = (event) => {
    if (!dragRef.current.isDragging) {
      return;
    }

    const nextState = {
      ...dragRef.current,
      offsetX: event.clientX - dragRef.current.startX,
    };
    dragRef.current = nextState;
    setDragState(nextState);
  };

  const handleDragEnd = (event) => {
    if (!dragRef.current.isDragging) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);

    if (Math.abs(dragRef.current.offsetX) > 120) {
      handleNextSwipe();
      return;
    }

    dragRef.current = { isDragging: false, startX: 0, offsetX: 0 };
    setDragState({ isDragging: false, startX: 0, offsetX: 0 });
  };

  return (
    <div className="app-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">T&apos;E</div>
          <div>
            <p>Troc&apos;Etudiant</p>
            <span>MVP web pour Steylab</span>
          </div>
        </div>

        <nav className="topnav" aria-label="Navigation principale">
          <button
            type="button"
            className={activeTab === 'home' ? 'nav-link active' : 'nav-link'}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            type="button"
            className={activeTab === 'ajouter' ? 'nav-link active' : 'nav-link'}
            onClick={() => setActiveTab('ajouter')}
          >
            Ajouter
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'home' ? (
          <HomeView
            annonces={annonces}
            swipeIndex={swipeIndex}
            dragState={dragState}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onNext={handleNextSwipe}
            onPrevious={handlePreviousSwipe}
          />
        ) : (
          <AddView onAdd={handleAdd} />
        )}
      </main>
    </div>
  );
}

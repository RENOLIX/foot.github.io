import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import htm from "htm";

const html = htm.bind(React.createElement);
const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

const SPORTS = [
  {
    id: "football",
    label: "Football",
    newsPath: "soccer/eng.1",
    leagues: [
      league("fifa.world", "Coupe du monde", "Monde", "un", "soccer/fifa.world", true),
      league("uefa.champions", "Ligue des Champions", "Europe", "eu", "soccer/uefa.champions", true),
      league("eng.1", "Premier League", "Angleterre", "gb-eng", "soccer/eng.1", true),
      league("fra.1", "Ligue 1", "France", "fr", "soccer/fra.1", true),
      league("esp.1", "LaLiga", "Espagne", "es", "soccer/esp.1"),
      league("ita.1", "Serie A", "Italie", "it", "soccer/ita.1"),
      league("ger.1", "Bundesliga", "Allemagne", "de", "soccer/ger.1"),
      league("por.1", "Liga Portugal", "Portugal", "pt", "soccer/por.1"),
      league("ned.1", "Eredivisie", "Pays-Bas", "nl", "soccer/ned.1"),
      league("usa.1", "MLS", "USA", "us", "soccer/usa.1"),
      league("mex.1", "Liga MX", "Mexique", "mx", "soccer/mex.1"),
      league("bra.1", "Serie A Betano", "Bresil", "br", "soccer/bra.1"),
    ],
  },
  {
    id: "basketball",
    label: "Basket",
    newsPath: "basketball/nba",
    leagues: [
      league("nba", "NBA", "USA", "us", "basketball/nba", true),
      league("wnba", "WNBA", "USA", "us", "basketball/wnba", true),
      league("mens-college", "NCAA Hommes", "USA", "us", "basketball/mens-college-basketball"),
      league("womens-college", "NCAA Femmes", "USA", "us", "basketball/womens-college-basketball"),
    ],
  },
  {
    id: "american-football",
    label: "Football Am.",
    newsPath: "football/nfl",
    leagues: [
      league("nfl", "NFL", "USA", "us", "football/nfl", true),
      league("college-football", "College Football", "USA", "us", "football/college-football"),
    ],
  },
  {
    id: "baseball",
    label: "Baseball",
    newsPath: "baseball/mlb",
    leagues: [
      league("mlb", "MLB", "USA", "us", "baseball/mlb", true),
      league("college-baseball", "College Baseball", "USA", "us", "baseball/college-baseball"),
    ],
  },
  {
    id: "hockey",
    label: "Hockey",
    newsPath: "hockey/nhl",
    leagues: [league("nhl", "NHL", "Canada/USA", "ca", "hockey/nhl", true)],
  },
];

const WORLD_CUP_FIXTURES = [
  wc("2026-06-25", "Equateur", "ec", "Allemagne", "de", "20:00"),
  wc("2026-06-25", "Curacao", "cw", "Cote d'Ivoire", "ci", "23:00"),
  wc("2026-06-26", "Tunisie", "tn", "Pays-Bas", "nl", "17:00"),
  wc("2026-06-26", "Japon", "jp", "Suede", "se", "17:00"),
  wc("2026-06-26", "Paraguay", "py", "Australie", "au", "20:00"),
  wc("2026-06-26", "Turquie", "tr", "Etats-Unis", "us", "20:00"),
  wc("2026-06-26", "Norvege", "no", "France", "fr", "23:00"),
  wc("2026-06-26", "Senegal", "sn", "Irak", "iq", "23:00"),
  wc("2026-06-27", "Uruguay", "uy", "Espagne", "es", "17:00"),
  wc("2026-06-27", "Cap-Vert", "cv", "Arabie saoudite", "sa", "17:00"),
  wc("2026-06-27", "Nouvelle-Zelande", "nz", "Belgique", "be", "20:00"),
  wc("2026-06-27", "Egypte", "eg", "Iran", "ir", "20:00"),
  wc("2026-06-27", "Panama", "pa", "Angleterre", "gb-eng", "23:00"),
  wc("2026-06-27", "Croatie", "hr", "Ghana", "gh", "23:00"),
  wc("2026-06-28", "Colombie", "co", "Portugal", "pt", "17:00"),
  wc("2026-06-28", "RD Congo", "cd", "Ouzbekistan", "uz", "17:00"),
  wc("2026-06-28", "Jordanie", "jo", "Argentine", "ar", "20:00"),
  wc("2026-06-28", "Algerie", "dz", "Autriche", "at", "20:00"),
  wc("2026-06-28", "Afrique du Sud", "za", "Canada", "ca", "23:00"),
];

function league(id, label, country, flag, path, pinned = false) {
  return { id, label, country, flag, path, pinned };
}

function wc(date, home, homeFlag, away, awayFlag, time) {
  return {
    id: `world-cup-${date}-${home}-${away}`.toLowerCase().replaceAll(" ", "-"),
    date,
    status: time,
    state: "pre",
    source: "Calendrier",
    competition: { id: "worldcup2026", label: "Championnat du Monde", country: "Monde", flag: "un" },
    home: { name: home, code: homeFlag.toUpperCase(), flag: homeFlag, score: "-" },
    away: { name: away, code: awayFlag.toUpperCase(), flag: awayFlag, score: "-" },
  };
}

function readRoute() {
  const clean = window.location.hash.replace(/^#\/?/, "");
  const [view = "scores", ...rest] = clean.split("/");
  return {
    view: ["scores", "news", "article", "favorites"].includes(view) ? view : "scores",
    id: decodeURIComponent(rest.join("/") || ""),
  };
}

function flagUrl(code) {
  return code === "un" ? "https://flagcdn.com/w40/un.png" : `https://flagcdn.com/w40/${code}.png`;
}

function Flag({ code }) {
  return html`<img className="flag" src=${flagUrl(code)} alt="" loading="lazy" />`;
}

function espnDate(date) {
  return date.split("-").join("");
}

function scoreboardUrl(item, date) {
  return `${ESPN_BASE}/${item.path}/scoreboard?dates=${espnDate(date)}`;
}

function newsUrl(sport) {
  return `${ESPN_BASE}/${sport.newsPath}/news`;
}

function normalizeTeam(competitor) {
  const team = competitor?.team || {};
  return {
    name: team.displayName || team.shortDisplayName || "Equipe",
    code: team.abbreviation || team.shortDisplayName || "",
    logo: team.logo || team.logos?.[0]?.href || "",
    score: competitor?.score ?? "-",
    winner: competitor?.winner === true,
  };
}

function normalizeEvent(event, item) {
  const competition = event.competitions?.[0] || {};
  const competitors = competition.competitors || [];
  const home = competitors.find((entry) => entry.homeAway === "home") || competitors[1] || {};
  const away = competitors.find((entry) => entry.homeAway === "away") || competitors[0] || {};
  const statusType = event.status?.type || {};
  return {
    id: `${item.id}-${event.id}`,
    date: (event.date || "").slice(0, 10),
    status: statusType.shortDetail || statusType.detail || "A venir",
    state: statusType.state || "pre",
    source: "ESPN",
    venue: competition.venue?.fullName || "",
    competition: item,
    home: normalizeTeam(home),
    away: normalizeTeam(away),
  };
}

function normalizeNews(payload) {
  return (payload?.articles || []).slice(0, 12).map((article, index) => ({
    id: article.dataSourceIdentifier || `${article.headline}-${index}`,
    title: article.headline || "Actualite",
    description: article.description || article.type || "",
    body: article.story || article.description || "Article ESPN affiche directement dans Foot Live.",
    image: article.images?.[0]?.url || "",
  }));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function App() {
  const [route, setRoute] = useState(() => readRoute());
  const [sportId, setSportId] = useState("football");
  const [date, setDate] = useState("2026-06-25");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingLabel, setLoadingLabel] = useState("Chargement des matches ESPN...");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("footlive:favorites") || "[]"));
  const [selectedMatch, setSelectedMatch] = useState(null);
  const sport = SPORTS.find((item) => item.id === sportId) || SPORTS[0];

  const navigate = (view, id = "") => {
    window.location.hash = id ? `#/${view}/${encodeURIComponent(id)}` : `#/${view}`;
    setRoute({ view, id });
  };

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingLabel("Chargement des matches ESPN...");
      setMatches([]);
      const settled = await Promise.allSettled(
        sport.leagues.map(async (item) => {
          const payload = await fetchJson(scoreboardUrl(item, date));
          return (payload.events || []).map((event) => normalizeEvent(event, item));
        }),
      );
      const espnMatches = settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
      const worldCup = sport.id === "football" ? WORLD_CUP_FIXTURES.filter((match) => match.date === date) : [];
      let nextNews = [];
      try {
        nextNews = normalizeNews(await fetchJson(newsUrl(sport)));
      } catch {
        nextNews = fallbackNews(sport);
      }
      if (!cancelled) {
        const failed = settled.filter((result) => result.status === "rejected").length;
        setMatches([...worldCup, ...espnMatches]);
        setNews(nextNews);
        setLoadingLabel(`${worldCup.length + espnMatches.length} match(s) affiches - ${sport.leagues.length - failed}/${sport.leagues.length} competitions ESPN chargees`);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [sportId, date, refreshKey]);

  useEffect(() => {
    localStorage.setItem("footlive:favorites", JSON.stringify(favorites));
  }, [favorites]);

  const visibleMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return matches.filter((match) => {
      const haystack = `${match.home.name} ${match.away.name} ${match.competition.label} ${match.competition.country}`.toLowerCase();
      const queryOk = !q || haystack.includes(q);
      const filterOk =
        filter === "all" ||
        (filter === "live" && match.state === "in") ||
        (filter === "finished" && match.state === "post") ||
        (filter === "scheduled" && match.state !== "post" && match.state !== "in");
      return queryOk && filterOk;
    });
  }, [matches, query, filter]);

  const favoriteMatches = matches.filter((match) => favorites.includes(match.id));
  const currentArticle = news.find((item) => item.id === route.id) || news[0] || fallbackNews(sport)[0];
  const toggleFavorite = (id) => setFavorites((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  const changeSport = (id) => {
    setSportId(id);
    setFilter("all");
    setQuery("");
    navigate("scores");
  };
  const selectSearch = (term) => {
    setQuery(term);
    navigate("scores");
  };

  return html`
    <div className="app">
      <${TopAnnouncement} />
      <${Topbar} query=${query} setQuery=${setQuery} route=${route} navigate=${navigate} />
      <${HeroBanner} sport=${sport} matches=${matches} navigate=${navigate} />
      <${SportsBar} sportId=${sportId} setSportId=${changeSport} />
      ${route.view === "news" && html`<${NewsPage} sport=${sport} news=${news} navigate=${navigate} />`}
      ${route.view === "article" && html`<${ArticlePage} article=${currentArticle} sport=${sport} navigate=${navigate} />`}
      ${route.view === "favorites" && html`<${FavoritesPage} favorites=${favoriteMatches} navigate=${navigate} openMatch=${setSelectedMatch} />`}
      ${route.view === "scores" && html`
        <main className="page-grid">
          <${LeftPanel} sport=${sport} matches=${matches} favorites=${favoriteMatches} openMatch=${setSelectedMatch} selectSearch=${selectSearch} />
          <section className="center-panel">
            <${ScoreToolbar} sport=${sport} date=${date} setDate=${setDate} />
            <${FilterTabs} filter=${filter} setFilter=${setFilter} />
            <${WorldCupStrip} sportId=${sportId} date=${date} />
            <div className="status-line"><span>${loadingLabel}</span><button className="liquid-button dark" type="button" onClick=${() => setRefreshKey((value) => value + 1)}>Actualiser</button></div>
            <${Scoreboard} matches=${visibleMatches} favorites=${favorites} toggleFavorite=${toggleFavorite} openMatch=${setSelectedMatch} />
          </section>
          <${RightPanel} sport=${sport} news=${news} matches=${matches} openNews=${(item) => navigate("article", item.id)} navigate=${navigate} selectSearch=${selectSearch} />
        </main>
      `}
      <${Footer} navigate=${navigate} sport=${sport} matches=${matches} news=${news} />
      ${selectedMatch && html`<${MatchModal} match=${selectedMatch} onClose=${() => setSelectedMatch(null)} />`}
    </div>
  `;
}

function TopAnnouncement() {
  return html`<div className="announcement"><strong>Foot Live Pro</strong><span>Scores multi-sports, Coupe du monde 2026, actualites internes et interface sans compte client.</span></div>`;
}

function Topbar({ query, setQuery, route, navigate }) {
  return html`
    <header className="topbar">
      <button className="brand brand-button" type="button" onClick=${() => navigate("scores")} aria-label="Foot Live accueil">
        <span className="brand-mark">FL</span>
        <span><strong>Foot Live</strong><small>Scores, calendriers, actus</small></span>
      </button>
      <nav className="main-links" aria-label="Navigation principale">
        <button className=${`main-link liquid-button ${route.view === "scores" ? "active" : ""}`} onClick=${() => navigate("scores")}>Resultats</button>
        <button className=${`main-link liquid-button ${route.view === "news" || route.view === "article" ? "active" : ""}`} onClick=${() => navigate("news")}>Actualites</button>
        <button className=${`main-link liquid-button ${route.view === "favorites" ? "active" : ""}`} onClick=${() => navigate("favorites")}>Favoris</button>
      </nav>
      <label className="search"><span>Search</span><input value=${query} onInput=${(event) => setQuery(event.target.value)} type="search" placeholder="Rechercher equipe, pays, competition" /></label>
    </header>
  `;
}

function HeroBanner({ sport, matches, navigate }) {
  const live = matches.filter((match) => match.state === "in").length;
  const scheduled = matches.filter((match) => match.state !== "in" && match.state !== "post").length;
  return html`
    <section className="hero-banner">
      <div className="hero-copy">
        <p className="eyebrow">Interface livescore premium</p>
        <h1>Scores propres, actus internes, competitions ordonnees.</h1>
        <p>Tableau de bord sportif React inspire de la structure Flashscore, avec une vraie page actualites et des controles utiles.</p>
        <div className="hero-actions">
          <button className="liquid-button active" onClick=${() => navigate("scores")}>Voir les scores</button>
          <button className="liquid-button ghost" onClick=${() => navigate("news")}>Lire les actualites</button>
        </div>
      </div>
      <div className="hero-card"><span>${sport.label}</span><strong>${matches.length}</strong><small>${live} live / ${scheduled} a venir</small></div>
    </section>
  `;
}

function SportsBar({ sportId, setSportId }) {
  return html`<nav className="sports-bar" aria-label="Sports">
    ${SPORTS.map((sport) => html`<button key=${sport.id} className=${`sport-btn liquid-button ${sport.id === sportId ? "active" : ""}`} onClick=${() => setSportId(sport.id)}><span className="sport-icon-wrap"><${SportIcon} id=${sport.id} /></span>${sport.label}</button>`)}
  </nav>`;
}

function SportIcon({ id }) {
  if (id === "basketball") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M3.8 12h16.4M12 3.5v17M5.8 6.2c3 2.4 4.6 5.9 4.7 10.8M18.2 6.2c-3 2.4-4.6 5.9-4.7 10.8" /></svg>`;
  if (id === "american-football") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15.5C7.8 20.2 16.2 20.2 20 8.5C16.2 3.8 7.8 3.8 4 15.5Z" /><path d="M8 15.5 16 8.5M10 12l3 3M12 10l3 3" /></svg>`;
  if (id === "baseball") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M7 5.4c2.3 3.1 2.3 10.1 0 13.2M17 5.4c-2.3 3.1-2.3 10.1 0 13.2M7.7 8.2l1.7.9M7.5 11l1.9.4M7.6 13.8l1.8-.5M16.3 8.2l-1.7.9M16.5 11l-1.9.4M16.4 13.8l-1.8-.5" /></svg>`;
  if (id === "hockey") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v10.5c0 2.5 1.7 3.5 4 3.5h5.5c1.8 0 3-1 3-2.4 0-1.2-1-2.1-2.5-2.1h-4" /><path d="M12 18h-8M3 20h6" /></svg>`;
  return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.4 15.9 10l-1.5 4.5H9.6L8.1 10 12 7.4ZM12 3.5v3.9M4.5 9.2 8.1 10M6.2 18.2l3.4-3.7M17.8 18.2l-3.4-3.7M19.5 9.2 15.9 10" /></svg>`;
}

function LeftPanel({ sport, matches, favorites, openMatch, selectSearch }) {
  const countries = [...new Map(sport.leagues.map((item) => [item.country, item])).values()];
  return html`
    <aside className="left-panel">
      <section className="panel"><h2>Ligues epinglees</h2><div className="stack">${sport.leagues.filter((item) => item.pinned).map((item) => html`<${LeagueButton} key=${item.id} league=${item} count=${countForLeague(matches, item.id)} onClick=${() => selectSearch(item.label)} />`)}</div></section>
      <section className="panel"><h2>Mes equipes</h2>${favorites.length ? html`<div className="stack">${favorites.map((match) => html`<button className="favorite-row" onClick=${() => openMatch(match)}><strong>${match.away.name} - ${match.home.name}</strong><span>${match.status}</span></button>`)}</div>` : html`<p className="muted">Clique sur une etoile pour ajouter un match.</p>`}</section>
      <section className="panel standings-panel"><h2>Classements</h2><div className="country-list">${countries.map((item) => html`<button className="country-link" onClick=${() => selectSearch(item.country)}><span className="country-main"><${Flag} code=${item.flag} /><strong>${item.country}</strong></span><span className="count-pill">${sport.leagues.filter((league) => league.country === item.country).length}</span></button>`)}</div></section>
    </aside>
  `;
}

function LeagueButton({ league, count, onClick }) {
  return html`<button className="league-link" onClick=${onClick}><span className="league-main"><${Flag} code=${league.flag} /><span><strong>${league.label}</strong><br /><small>${league.country}</small></span></span><span className="count-pill">${count}</span></button>`;
}

function ScoreToolbar({ sport, date, setDate }) {
  const shiftDate = (days) => {
    const current = new Date(`${date}T00:00:00`);
    current.setDate(current.getDate() + days);
    setDate(current.toISOString().slice(0, 10));
  };
  return html`<div className="score-toolbar"><div><p className="eyebrow">${sport.label}</p><h1>${sport.id === "football" ? "Resultats foot en direct" : `${sport.label} en direct`}</h1></div><div className="date-controls"><button className="liquid-button" onClick=${() => shiftDate(-1)} type="button">Prev</button><input value=${date} onChange=${(event) => setDate(event.target.value)} type="date" /><button className="liquid-button" onClick=${() => shiftDate(1)} type="button">Next</button></div></div>`;
}

function FilterTabs({ filter, setFilter }) {
  return html`<div className="tabs-row">${["all", "live", "finished", "scheduled"].map((id) => html`<button className=${`tab liquid-button ${filter === id ? "active" : ""}`} onClick=${() => setFilter(id)}>${{ all: "Tous", live: "Live", finished: "Termines", scheduled: "A venir" }[id]}</button>`)}</div>`;
}

function WorldCupStrip({ sportId, date }) {
  const fixtures = sportId === "football" ? WORLD_CUP_FIXTURES.filter((match) => match.date === date) : [];
  if (!fixtures.length) return html`<div className="quick-world-cup"></div>`;
  return html`<div className="quick-world-cup visible"><div className="world-title"><span><${Flag} code="un" /> Coupe du monde 2026</span><span>${fixtures.length} match(s)</span></div>${fixtures.slice(0, 4).map((match) => html`<div key=${match.id}><${Flag} code=${match.home.flag} /> ${match.home.name} - <${Flag} code=${match.away.flag} /> ${match.away.name} <strong>${match.status}</strong></div>`)}</div>`;
}

function Scoreboard({ matches, favorites, toggleFavorite, openMatch }) {
  const groups = groupByCompetition(matches);
  if (!groups.length) return html`<div className="match-list"><section className="competition"><div className="competition-head">Aucun match</div><div className="match-row">Aucun match pour ce filtre.</div></section></div>`;
  return html`<div className="match-list">${groups.map(([key, items]) => html`<section className="competition" key=${key}><div className="competition-head"><span className="competition-title"><${Flag} code=${items[0].competition.flag} /> ${items[0].competition.country}: ${items[0].competition.label}</span><span>${items.length} match(s)</span></div>${items.map((match) => html`<${MatchRow} key=${match.id} match=${match} favorite=${favorites.includes(match.id)} toggleFavorite=${toggleFavorite} openMatch=${openMatch} />`)}</section>`)}</div>`;
}

function MatchRow({ match, favorite, toggleFavorite, openMatch }) {
  return html`<div className="match-row"><button className=${`star-btn ${favorite ? "active" : ""}`} onClick=${() => toggleFavorite(match.id)}>*</button><span className=${`time-cell ${match.state === "in" ? "live" : ""}`}>${match.state === "in" ? "LIVE" : match.status}</span><${TeamCell} team=${match.away} /><span className=${`score ${match.away.winner ? "winner" : ""}`}>${match.away.score}</span><span className=${`score ${match.home.winner ? "winner" : ""}`}>${match.home.score}</span><${TeamCell} team=${match.home} side="right" /><button className="open-btn" onClick=${() => openMatch(match)}>Open</button></div>`;
}

function TeamCell({ team, side = "" }) {
  const img = team.logo || (team.flag ? flagUrl(team.flag) : "");
  return html`<span className=${`team-cell ${side}`}>${img && html`<img className="team-logo" src=${img} alt="" loading="lazy" />`}<span className="team-name">${team.name}</span></span>`;
}

function RightPanel({ sport, news, matches, openNews, navigate, selectSearch }) {
  const live = matches.filter((match) => match.state === "in").length;
  const finished = matches.filter((match) => match.state === "post").length;
  const scheduled = matches.filter((match) => match.state !== "in" && match.state !== "post").length;
  return html`<aside className="right-panel"><section className="panel news-panel"><div className="panel-heading-row"><h2>Actualites</h2><button className="panel-link" onClick=${() => navigate("news")}>Tout voir</button></div><div className="news-list">${news.slice(0, 5).map((item) => html`<button className="news-card" onClick=${() => openNews(item)}>${item.image ? html`<img src=${item.image} alt="" loading="lazy" />` : html`<div className="team-logo"></div>`}<span><strong>${item.title}</strong><small>${item.description || "Lire dans Foot Live"}</small></span></button>`)}</div></section><section className="panel data-panel"><h2>Infos du jour</h2><div className="data-grid"><div><strong>${matches.length}</strong><span>matchs charges</span></div><div><strong>${live}</strong><span>live</span></div><div><strong>${finished}</strong><span>termines</span></div><div><strong>${scheduled}</strong><span>a venir</span></div></div></section><section className="panel"><h2>Top competitions</h2><div className="stack">${sport.leagues.slice(0, 8).map((item) => html`<button className="top-row" onClick=${() => selectSearch(item.label)}><span className="top-main"><${Flag} code=${item.flag} /><strong>${item.label}</strong></span><span className="count-pill">${countForLeague(matches, item.id)}</span></button>`)}</div></section></aside>`;
}

function NewsPage({ sport, news, navigate }) {
  return html`<main className="page-shell"><section className="section-header"><p className="eyebrow">${sport.label}</p><h1>Actualites sportives</h1><p>Articles consultables directement dans Foot Live, sans ouvrir ESPN dans un onglet externe.</p></section><div className="news-grid">${news.map((item) => html`<button className="article-card" key=${item.id} onClick=${() => navigate("article", item.id)}>${item.image ? html`<img src=${item.image} alt="" loading="lazy" />` : html`<div className="article-fallback">FL</div>`}<span><small>${sport.label}</small><strong>${item.title}</strong><p>${item.description || "Lire l'article complet dans le site."}</p></span></button>`)}</div></main>`;
}

function ArticlePage({ article, sport, navigate }) {
  return html`<main className="page-shell article-layout"><button className="liquid-button ghost back-button" onClick=${() => navigate("news")}>Retour aux actualites</button><article className="article-page"><p className="eyebrow">${sport.label} / Actualite</p><h1>${article.title}</h1>${article.image && html`<img className="article-hero" src=${article.image} alt="" />`}<p className="article-lead">${article.description || ""}</p><p>${article.body || article.description || "Article affiche directement dans Foot Live."}</p></article></main>`;
}

function FavoritesPage({ favorites, navigate, openMatch }) {
  return html`<main className="page-shell"><section className="section-header"><p className="eyebrow">Favoris</p><h1>Mes matchs suivis</h1><p>Les favoris restent dans le navigateur, sans connexion client.</p></section>${favorites.length ? html`<div className="favorite-page-grid">${favorites.map((match) => html`<button className="favorite-large-card" onClick=${() => openMatch(match)}><span>${match.competition.label}</span><strong>${match.away.name} - ${match.home.name}</strong><small>${match.status}</small></button>`)}</div>` : html`<div className="empty-panel"><h2>Aucun favori</h2><p>Retourne aux scores et clique sur une etoile pour ajouter un match.</p><button className="liquid-button active" onClick=${() => navigate("scores")}>Voir les scores</button></div>`}</main>`;
}

function MatchModal({ match, onClose }) {
  return html`<div className="modal-backdrop"><div className="dialog dialog-open"><div className="dialog-card"><div className="dialog-top"><div><p className="eyebrow">${match.competition.country}: ${match.competition.label}</p><h2>${match.away.name} - ${match.home.name}</h2></div><button className="close-dialog" onClick=${onClose}>x</button></div><div className="dialog-score"><div className="dialog-team"><${TeamCell} team=${match.away} /><span>${match.away.name}</span></div><div className="dialog-total">${match.away.score} - ${match.home.score}</div><div className="dialog-team"><${TeamCell} team=${match.home} /><span>${match.home.name}</span></div></div><p><strong>Statut:</strong> ${match.status}</p><p><strong>Source:</strong> ${match.source}</p><p><strong>Lieu:</strong> ${match.venue || "Non renseigne"}</p></div></div></div>`;
}

function Footer({ navigate, sport, matches, news }) {
  const live = matches.filter((match) => match.state === "in").length;
  const competitions = new Set(matches.map((match) => match.competition.label)).size;
  return html`
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="brand-mark">FL</span>
        <div><strong>Foot Live</strong><p>Scores en direct, Coupe du monde 2026, actualites integrees et drapeaux reels.</p></div>
      </div>
      <div className="footer-stats">
        <div><strong>${matches.length}</strong><span>matchs</span></div>
        <div><strong>${live}</strong><span>live</span></div>
        <div><strong>${competitions}</strong><span>competitions</span></div>
        <div><strong>${news.length}</strong><span>actus</span></div>
      </div>
      <div className="footer-columns">
        <section><h3>Navigation</h3><button onClick=${() => navigate("scores")}>Resultats</button><button onClick=${() => navigate("news")}>Actualites</button><button onClick=${() => navigate("favorites")}>Favoris</button></section>
        <section><h3>Sports</h3>${SPORTS.map((item) => html`<button onClick=${() => navigate("scores")}><${SportIcon} id=${item.id} />${item.label}</button>`)}</section>
        <section><h3>${sport.label}</h3>${sport.leagues.slice(0, 5).map((item) => html`<button onClick=${() => navigate("scores")}><${Flag} code=${item.flag} />${item.label}</button>`)}</section>
        <section><h3>Donnees</h3><p>Flux scores et actualites ESPN, drapeaux FlagCDN, favoris stockes localement sans compte client.</p></section>
      </div>
    </footer>
  `;
}

function countForLeague(matches, id) {
  return matches.filter((match) => match.competition.id === id || (match.competition.id === "worldcup2026" && id === "fifa.world")).length;
}

function groupByCompetition(matches) {
  const map = new Map();
  matches.forEach((match) => {
    const key = `${match.competition.country}-${match.competition.label}`;
    map.set(key, [...(map.get(key) || []), match]);
  });
  return [...map.entries()];
}

function fallbackNews(sport) {
  return [
    { id: "status-news-1", title: `Flux actualites ${sport.label} temporairement indisponible`, description: "Le site garde les scores actifs et recharge les articles ESPN des que le flux repond.", body: "Aucune actualite inventee: ce message indique seulement que le flux ESPN n'a pas repondu au moment du chargement." },
    { id: "status-news-2", title: "Scores, drapeaux et competitions restent disponibles", description: "Les tableaux de matchs continuent d'utiliser les endpoints sportifs configures par discipline.", body: "Les informations affichees dans les scores proviennent des flux de calendrier et de scoreboard, avec les competitions separees par sport." },
  ];
}

createRoot(document.getElementById("root")).render(html`<${App} />`);

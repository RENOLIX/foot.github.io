import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import htm from "htm";

const html = htm.bind(React.createElement);
const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

const SPORTS = [
  {
    id: "football",
    label: "Football",
    icon: "⚽",
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
    icon: "🏀",
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
    icon: "🏈",
    newsPath: "football/nfl",
    leagues: [
      league("nfl", "NFL", "USA", "us", "football/nfl", true),
      league("college-football", "College Football", "USA", "us", "football/college-football"),
    ],
  },
  {
    id: "baseball",
    label: "Baseball",
    icon: "⚾",
    newsPath: "baseball/mlb",
    leagues: [
      league("mlb", "MLB", "USA", "us", "baseball/mlb", true),
      league("college-baseball", "College Baseball", "USA", "us", "baseball/college-baseball"),
    ],
  },
  {
    id: "hockey",
    label: "Hockey",
    icon: "🏒",
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

function flagUrl(code) {
  return code === "un" ? "https://flagcdn.com/w40/un.png" : `https://flagcdn.com/w40/${code}.png`;
}

function Flag({ code }) {
  return html`<img className="flag" src=${flagUrl(code)} alt="" loading="lazy" />`;
}

function espnDate(date) {
  return date.split("-").join("");
}

function scoreboardUrl(league, date) {
  return `${ESPN_BASE}/${league.path}/scoreboard?dates=${espnDate(date)}`;
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

function normalizeEvent(event, league) {
  const competition = event.competitions?.[0] || {};
  const competitors = competition.competitors || [];
  const home = competitors.find((item) => item.homeAway === "home") || competitors[1] || {};
  const away = competitors.find((item) => item.homeAway === "away") || competitors[0] || {};
  const statusType = event.status?.type || {};
  return {
    id: `${league.id}-${event.id}`,
    date: (event.date || "").slice(0, 10),
    status: statusType.shortDetail || statusType.detail || "A venir",
    state: statusType.state || "pre",
    source: "ESPN",
    venue: competition.venue?.fullName || "",
    competition: league,
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
  const [sportId, setSportId] = useState("football");
  const [date, setDate] = useState("2026-06-25");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingLabel, setLoadingLabel] = useState("Chargement des matches ESPN...");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("footlive:favorites") || "[]"));
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const sport = SPORTS.find((item) => item.id === sportId) || SPORTS[0];

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
  }, [sportId, date]);

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
  const toggleFavorite = (id) => setFavorites((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));

  return html`
    <div className="app">
      <${Topbar} query=${query} setQuery=${setQuery} />
      <${SportsBar} sportId=${sportId} setSportId=${(id) => { setSportId(id); setFilter("all"); setQuery(""); }} />
      <main className="page-grid">
        <${LeftPanel} sport=${sport} matches=${matches} favorites=${favoriteMatches} openMatch=${setSelectedMatch} />
        <section className="center-panel">
          <${ScoreToolbar} sport=${sport} date=${date} setDate=${setDate} />
          <${FilterTabs} filter=${filter} setFilter=${setFilter} />
          <${WorldCupStrip} sportId=${sportId} date=${date} />
          <div className="status-line"><span>${loadingLabel}</span><button type="button" onClick=${() => setDate(`${date}`)}>Actualiser</button></div>
          <${Scoreboard} matches=${visibleMatches} favorites=${favorites} toggleFavorite=${toggleFavorite} openMatch=${setSelectedMatch} />
        </section>
        <${RightPanel} sport=${sport} news=${news} matches=${matches} openNews=${setSelectedNews} />
      </main>
      ${selectedMatch && html`<${MatchModal} match=${selectedMatch} onClose=${() => setSelectedMatch(null)} />`}
      ${selectedNews && html`<${NewsModal} item=${selectedNews} onClose=${() => setSelectedNews(null)} />`}
    </div>
  `;
}

function Topbar({ query, setQuery }) {
  return html`
    <header className="topbar">
      <a className="brand" href="./" aria-label="Foot Live accueil">
        <span className="brand-mark">FL</span>
        <span><strong>Foot Live</strong><small>Scores, calendriers, actus</small></span>
      </a>
      <nav className="main-links" aria-label="Navigation principale">
        <button className="main-link active">Resultats</button>
        <button className="main-link">Actualites</button>
        <button className="main-link">Favoris</button>
      </nav>
      <label className="search"><span>⌕</span><input value=${query} onInput=${(event) => setQuery(event.target.value)} type="search" placeholder="Rechercher equipe, pays, competition" /></label>
    </header>
  `;
}

function SportsBar({ sportId, setSportId }) {
  return html`<nav className="sports-bar" aria-label="Sports">
    ${SPORTS.map((sport) => html`<button key=${sport.id} className=${`sport-btn ${sport.id === sportId ? "active" : ""}`} onClick=${() => setSportId(sport.id)}><span>${sport.icon}</span>${sport.label}</button>`)}
  </nav>`;
}

function LeftPanel({ sport, matches, favorites, openMatch }) {
  const countries = [...new Map(sport.leagues.map((item) => [item.country, item])).values()];
  return html`
    <aside className="left-panel">
      <section className="panel"><h2>Ligues epinglees</h2><div className="stack">${sport.leagues.filter((item) => item.pinned).map((item) => html`<${LeagueButton} key=${item.id} league=${item} count=${countForLeague(matches, item.id)} />`)}</div></section>
      <section className="panel"><h2>Mes equipes</h2>${favorites.length ? html`<div className="stack">${favorites.map((match) => html`<button className="favorite-row" onClick=${() => openMatch(match)}><strong>${match.away.name} - ${match.home.name}</strong><span>${match.status}</span></button>`)}</div>` : html`<p className="muted">Clique sur une etoile pour ajouter un match.</p>`}</section>
      <section className="panel standings-panel"><h2>Classements</h2><div className="country-list">${countries.map((item) => html`<button className="country-link"><span className="country-main"><${Flag} code=${item.flag} /><strong>${item.country}</strong></span><span className="count-pill">${sport.leagues.filter((league) => league.country === item.country).length}</span></button>`)}</div></section>
    </aside>
  `;
}

function LeagueButton({ league, count }) {
  return html`<button className="league-link"><span className="league-main"><${Flag} code=${league.flag} /><span><strong>${league.label}</strong><br /><small>${league.country}</small></span></span><span className="count-pill">${count}</span></button>`;
}

function ScoreToolbar({ sport, date, setDate }) {
  const shiftDate = (days) => {
    const current = new Date(`${date}T00:00:00`);
    current.setDate(current.getDate() + days);
    setDate(current.toISOString().slice(0, 10));
  };
  return html`<div className="score-toolbar"><div><p className="eyebrow">${sport.label}</p><h1>${sport.id === "football" ? "Resultats foot en direct" : `${sport.label} en direct`}</h1></div><div className="date-controls"><button onClick=${() => shiftDate(-1)} type="button">‹</button><input value=${date} onChange=${(event) => setDate(event.target.value)} type="date" /><button onClick=${() => shiftDate(1)} type="button">›</button></div></div>`;
}

function FilterTabs({ filter, setFilter }) {
  return html`<div className="tabs-row">${["all", "live", "finished", "scheduled"].map((id) => html`<button className=${`tab ${filter === id ? "active" : ""}`} onClick=${() => setFilter(id)}>${{ all: "Tous", live: "Live", finished: "Termines", scheduled: "A venir" }[id]}</button>`)}</div>`;
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
  return html`<div className="match-row"><button className=${`star-btn ${favorite ? "active" : ""}`} onClick=${() => toggleFavorite(match.id)}>★</button><span className=${`time-cell ${match.state === "in" ? "live" : ""}`}>${match.state === "in" ? "LIVE" : match.status}</span><${TeamCell} team=${match.away} /><span className=${`score ${match.away.winner ? "winner" : ""}`}>${match.away.score}</span><span className=${`score ${match.home.winner ? "winner" : ""}`}>${match.home.score}</span><${TeamCell} team=${match.home} side="right" /><button className="open-btn" onClick=${() => openMatch(match)}>›</button></div>`;
}

function TeamCell({ team, side = "" }) {
  const img = team.logo || (team.flag ? flagUrl(team.flag) : "");
  return html`<span className=${`team-cell ${side}`}>${img && html`<img className="team-logo" src=${img} alt="" loading="lazy" />`}<span className="team-name">${team.name}</span></span>`;
}

function RightPanel({ sport, news, matches, openNews }) {
  return html`<aside className="right-panel"><section className="panel news-panel"><div className="panel-heading-row"><h2>Actualites</h2><span>Dans le site</span></div><div className="news-list">${news.map((item) => html`<button className="news-card" onClick=${() => openNews(item)}>${item.image ? html`<img src=${item.image} alt="" loading="lazy" />` : html`<div className="team-logo"></div>`}<span><strong>${item.title}</strong><small>${item.description || "Lire dans Foot Live"}</small></span></button>`)}</div></section><section className="panel"><h2>Top competitions</h2><div className="stack">${sport.leagues.slice(0, 8).map((item) => html`<button className="top-row"><span className="top-main"><${Flag} code=${item.flag} /><strong>${item.label}</strong></span><span className="count-pill">${countForLeague(matches, item.id)}</span></button>`)}</div></section></aside>`;
}

function MatchModal({ match, onClose }) {
  return html`<div className="modal-backdrop"><div className="dialog dialog-open"><div className="dialog-card"><div className="dialog-top"><div><p className="eyebrow">${match.competition.country}: ${match.competition.label}</p><h2>${match.away.name} - ${match.home.name}</h2></div><button className="close-dialog" onClick=${onClose}>×</button></div><div className="dialog-score"><div className="dialog-team"><${TeamCell} team=${match.away} /><span>${match.away.name}</span></div><div className="dialog-total">${match.away.score} - ${match.home.score}</div><div className="dialog-team"><${TeamCell} team=${match.home} /><span>${match.home.name}</span></div></div><p><strong>Statut:</strong> ${match.status}</p><p><strong>Source:</strong> ${match.source}</p><p><strong>Lieu:</strong> ${match.venue || "Non renseigne"}</p></div></div></div>`;
}

function NewsModal({ item, onClose }) {
  return html`<div className="modal-backdrop"><div className="dialog news-dialog dialog-open"><div className="dialog-card"><div className="dialog-top"><div><p className="eyebrow">Actualite interne</p><h2>${item.title}</h2></div><button className="close-dialog" onClick=${onClose}>×</button></div>${item.image && html`<img src=${item.image} alt="" />`}<p>${item.description || ""}</p><p>${item.body || item.description || "Article affiche directement dans Foot Live."}</p></div></div></div>`;
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
    { id: "local-news-1", title: `${sport.label}: centre de scores charge dans Foot Live`, description: "Les articles restent dans le site, sans lien externe.", body: "Cette actualite locale remplace ESPN si le flux news ne repond pas." },
    { id: "local-news-2", title: "Coupe du monde, ligues et scores par sport", description: "Chaque sport utilise son propre ensemble de competitions.", body: "Football, basket, football americain, baseball et hockey sont separes." },
  ];
}

createRoot(document.getElementById("root")).render(html`<${App} />`);

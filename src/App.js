import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import htm from "htm";

const html = htm.bind(React.createElement);
const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";
const API_SPORTS_BASE = "https://v3.football.api-sports.io";
const API_SPORTS_KEY_STORAGE = "footlive:apiSportsKey";

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
      league("uefa.europa", "Ligue Europa", "Europe", "eu", "soccer/uefa.europa"),
      league("uefa.europa.conf", "Ligue Conférence", "Europe", "eu", "soccer/uefa.europa.conf"),
      league("eng.2", "Championship", "Angleterre", "gb-eng", "soccer/eng.2"),
      league("fra.2", "Ligue 2", "France", "fr", "soccer/fra.2"),
      league("esp.2", "LaLiga 2", "Espagne", "es", "soccer/esp.2"),
      league("ita.2", "Serie B", "Italie", "it", "soccer/ita.2"),
      league("ger.2", "2. Bundesliga", "Allemagne", "de", "soccer/ger.2"),
      league("usa.1", "MLS", "USA", "us", "soccer/usa.1"),
      league("usa.nwsl", "NWSL", "USA", "us", "soccer/usa.nwsl"),
      league("usa.usl.1", "USL Championship", "USA", "us", "soccer/usa.usl.1"),
      league("mex.1", "Liga MX", "Mexique", "mx", "soccer/mex.1"),
      league("mex.2", "Liga de Expansión MX", "Mexique", "mx", "soccer/mex.2"),
      league("bra.1", "Serie A Betano", "Brésil", "br", "soccer/bra.1"),
      league("bra.2", "Serie B", "Brésil", "br", "soccer/bra.2"),
      league("arg.1", "Primera División", "Argentine", "ar", "soccer/arg.1"),
      league("col.1", "Primera A", "Colombie", "co", "soccer/col.1"),
      league("chi.1", "Primera División", "Chili", "cl", "soccer/chi.1"),
      league("ecu.1", "LigaPro", "Équateur", "ec", "soccer/ecu.1"),
      league("per.1", "Liga 1", "Pérou", "pe", "soccer/per.1"),
      league("uru.1", "Primera División", "Uruguay", "uy", "soccer/uru.1"),
      league("par.1", "Primera División", "Paraguay", "py", "soccer/par.1"),
      league("aus.1", "A-League", "Australie", "au", "soccer/aus.1"),
      league("chn.1", "Super League", "Chine", "cn", "soccer/chn.1"),
      league("jpn.1", "J1 League", "Japon", "jp", "soccer/jpn.1"),
      league("rsa.1", "Premiership", "Afrique du Sud", "za", "soccer/rsa.1"),
      league("tur.1", "Süper Lig", "Turquie", "tr", "soccer/tur.1"),
      league("sco.1", "Premiership", "Écosse", "gb-sct", "soccer/sco.1"),
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
  {
    id: "tennis",
    label: "Tennis",
    newsPath: "tennis/atp",
    leagues: [
      league("atp", "ATP", "Monde", "un", "tennis/atp", true),
      league("wta", "WTA", "Monde", "un", "tennis/wta", true),
    ],
  },
  {
    id: "rugby",
    label: "Rugby",
    newsPath: "rugby/league",
    leagues: [
      league("rugby-league", "Rugby League", "Monde", "un", "rugby/league", true),
      league("rugby-union", "Rugby Union", "Monde", "un", "rugby/union", true),
    ],
  },
  {
    id: "handball",
    label: "Handball",
    newsPath: "handball/mens",
    unavailable: "ESPN ne fournit pas de flux site public stable pour le handball sur cette API.",
    leagues: [],
  },
  {
    id: "volleyball",
    label: "Volley",
    newsPath: "volleyball/womens-college-volleyball",
    leagues: [
      league("womens-college-volleyball", "NCAA Volley Femmes", "USA", "us", "volleyball/womens-college-volleyball", true),
      league("mens-college-volleyball", "NCAA Volley Hommes", "USA", "us", "volleyball/mens-college-volleyball", true),
    ],
  },
  {
    id: "other",
    label: "Autres",
    newsPath: "football/nfl",
    leagues: [
      league("nfl", "NFL", "USA", "us", "football/nfl", true),
      league("mlb", "MLB", "USA", "us", "baseball/mlb", true),
      league("college-football", "College Football", "USA", "us", "football/college-football"),
      league("college-baseball", "College Baseball", "USA", "us", "baseball/college-baseball"),
    ],
  },
];

const SPORT_NAV_ITEMS = [
  { id: "football", label: "Football", target: "football" },
  { id: "world-cup", label: "Coupe du Monde", target: "football", query: "Coupe du monde" },
  { id: "basketball", label: "Basket", target: "basketball" },
  { id: "tennis", label: "Tennis", target: "tennis" },
  { id: "rugby", label: "Rugby", target: "rugby" },
  { id: "handball", label: "Handball", target: "handball" },
  { id: "volleyball", label: "Volley", target: "volleyball" },
  { id: "hockey", label: "Hockey", target: "hockey" },
  { id: "more", label: "Autres", target: "other" },
];

function league(id, label, country, flag, path, pinned = false) {
  return { id, label, country, flag, path, pinned };
}

function readRoute() {
  const clean = window.location.hash.replace(/^#\/?/, "");
  const [view = "scores", ...rest] = clean.split("/");
  return {
    view: ["scores", "news", "article", "favorites", "match"].includes(view) ? view : "scores",
    id: decodeURIComponent(rest.join("/") || ""),
  };
}

function flagUrl(code) {
  if (!code) return "https://flagcdn.com/w40/un.png";
  if (/^https?:\/\//i.test(code)) return code;
  return code === "un" ? "https://flagcdn.com/w40/un.png" : `https://flagcdn.com/w40/${code}.png`;
}

function Flag({ code }) {
  return html`<img className="flag" src=${flagUrl(code)} alt="" loading="lazy" />`;
}

function espnDate(date) {
  return date.split("-").join("");
}

function todayInAlgiers() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Algiers" }).format(new Date());
}

function matchTime(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(date));
}

function scoreboardUrl(item, date) {
  return `${ESPN_BASE}/${item.path}/scoreboard?dates=${espnDate(date)}`;
}

function summaryUrl(match) {
  return `${ESPN_BASE}/${match.leaguePath}/summary?event=${match.eventId}`;
}

function addDaysISO(date, days) {
  const [year, month, day] = date.split("-").map(Number);
  const current = new Date(Date.UTC(year, month - 1, day + days));
  return current.toISOString().slice(0, 10);
}

function uniqueMatches(matches) {
  return [...new Map(matches.map((match) => [match.id, match])).values()];
}

function liveProgress(status) {
  const minute = Number.parseInt(String(status || "").match(/\d+/)?.[0] || "0", 10);
  if (!minute) return 4;
  return Math.max(4, Math.min(100, Math.round((minute / 90) * 100)));
}

function translateStatus(value) {
  const text = String(value || "");
  return text
    .replace(/^FT$/i, "Terminé")
    .replace(/^HT$/i, "Mi-temps")
    .replace(/Halftime/i, "Mi-temps")
    .replace(/Final/i, "Terminé")
    .replace(/Full Time/i, "Terminé")
    .replace(/Scheduled/i, "Prévu")
    .replace(/Postponed/i, "Reporté")
    .replace(/Canceled/i, "Annulé")
    .replace(/Thu, /i, "Jeu. ")
    .replace(/Fri, /i, "Ven. ")
    .replace(/Sat, /i, "Sam. ")
    .replace(/Sun, /i, "Dim. ")
    .replace(/Mon, /i, "Lun. ")
    .replace(/Tue, /i, "Mar. ")
    .replace(/Wed, /i, "Mer. ")
    .replace(/June/i, "juin")
    .replace(/July/i, "juillet")
    .replace(/at/i, "à");
}

function translateText(value) {
  const text = String(value || "");
  return text
    .replace(/First Half begins\./gi, "Début de la première mi-temps.")
    .replace(/Second Half begins\./gi, "Début de la deuxième mi-temps.")
    .replace(/Match ends,/gi, "Fin du match,")
    .replace(/Goal!/gi, "But !")
    .replace(/Foul by/gi, "Faute de")
    .replace(/wins a free kick/gi, "obtient un coup franc")
    .replace(/yellow card/gi, "carton jaune")
    .replace(/red card/gi, "carton rouge")
    .replace(/Substitution,/gi, "Remplacement,")
    .replace(/Delay in match/gi, "Arrêt du jeu")
    .replace(/Delay over\. They are ready to continue\./gi, "Fin de l'arrêt. Le jeu peut reprendre.")
    .replace(/right footed shot/gi, "frappe du pied droit")
    .replace(/left footed shot/gi, "frappe du pied gauche")
    .replace(/header/gi, "tête")
    .replace(/Assisted by/gi, "Passe décisive de")
    .replace(/from the centre of the box/gi, "depuis l'axe de la surface")
    .replace(/from outside the box/gi, "depuis l'extérieur de la surface")
    .replace(/to the bottom left corner/gi, "dans le coin inférieur gauche")
    .replace(/to the bottom right corner/gi, "dans le coin inférieur droit");
}

function translateStatLabel(value) {
  const labels = {
    shotsTotal: "Tirs",
    shotsOnTarget: "Tirs cadrés",
    possessionPct: "Possession",
    foulsCommitted: "Fautes",
    yellowCards: "Cartons jaunes",
    redCards: "Cartons rouges",
    cornerKicks: "Corners",
    saves: "Arrêts",
    offsides: "Hors-jeu",
  };
  return labels[value] || translateText(value);
}

function newsUrl(sport) {
  return `${ESPN_BASE}/${sport.newsPath}/news`;
}

function hashText(text) {
  let hash = 0;
  const source = String(text || "");
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash + source.charCodeAt(index)) | 0;
  }
  return `${source.length}-${Math.abs(hash)}`;
}

function splitTextForTranslation(text, maxLength = 440) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  if (!source) return [];
  const sentences = source.match(/[^.!?]+[.!?]+|\S.+$/g) || [source];
  const chunks = [];
  let current = "";
  sentences.forEach((sentence) => {
    const next = `${current} ${sentence}`.trim();
    if (next.length > maxLength && current) {
      chunks.push(current);
      current = sentence.trim();
    } else if (sentence.length > maxLength) {
      if (current) chunks.push(current);
      for (let index = 0; index < sentence.length; index += maxLength) {
        chunks.push(sentence.slice(index, index + maxLength));
      }
      current = "";
    } else {
      current = next;
    }
  });
  if (current) chunks.push(current);
  return chunks;
}

async function translateChunkToFrench(text) {
  const clean = String(text || "").trim();
  if (!clean) return "";
  const cacheKey = `footlive:fr:${hashText(clean)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;
  let translated = "";
  try {
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(clean)}`;
    const googlePayload = await fetchJson(googleUrl, 14000);
    translated = (googlePayload?.[0] || []).map((part) => part?.[0] || "").join("");
  } catch {
    const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|fr`;
    const fallbackPayload = await fetchJson(fallbackUrl, 14000);
    translated = fallbackPayload?.responseData?.translatedText || "";
  }
  if (!translated) throw new Error("Traduction indisponible");
  localStorage.setItem(cacheKey, translated);
  return translated;
}

async function translateTextToFrench(text) {
  const chunks = splitTextForTranslation(text);
  const translated = [];
  for (const chunk of chunks) {
    translated.push(await translateChunkToFrench(chunk));
  }
  return translated.join(" ");
}

async function translateNewsTeasers(news) {
  const translated = [];
  for (const item of news) {
    try {
      translated.push({
        ...item,
        title: await translateTextToFrench(item.title),
        description: await translateTextToFrench(item.description),
        translated: true,
      });
    } catch {
      translated.push(item);
    }
  }
  return translated;
}

function useTranslatedNews(news) {
  const [translated, setTranslated] = useState(news);
  useEffect(() => {
    let cancelled = false;
    setTranslated(news);
    translateNewsTeasers(news).then((items) => {
      if (!cancelled) setTranslated(items);
    });
    return () => {
      cancelled = true;
    };
  }, [news.map((item) => item.id).join("|")]);
  return translated;
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
    eventId: event.id,
    leaguePath: item.path,
    date: (event.date || "").slice(0, 10),
    kickTime: matchTime(event.date),
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
    espnId: article.id || "",
    title: article.headline || "Actualité",
    description: article.description || article.type || "",
    body: article.story || article.description || "Article ESPN affiché directement dans Foot Live.",
    paragraphs: htmlToParagraphs(article.story || article.description || ""),
    image: article.images?.[0]?.url || "",
    imageCredit: article.images?.[0]?.credit || "",
    imageAlt: article.images?.[0]?.alt || article.images?.[0]?.caption || "",
    byline: article.byline || "ESPN",
    published: article.published || article.lastModified || "",
    apiUrl: article.links?.api?.self?.href || (article.id ? `https://content.core.api.espn.com/v1/sports/news/${article.id}` : ""),
    sourceUrl: article.links?.web?.href || "",
  }));
}

function htmlToParagraphs(value) {
  const source = String(value || "").trim();
  if (!source) return [];
  const doc = new DOMParser().parseFromString(source, "text/html");
  doc.querySelectorAll("script, style, photo1, inline1").forEach((node) => node.remove());
  const paragraphs = [...doc.body.querySelectorAll("p")]
    .map((node) => node.textContent.replace(/\s+/g, " ").trim())
    .filter((text) => text && !/^<?(photo|inline)\d*>?$/i.test(text));
  if (paragraphs.length) return paragraphs;
  return source.split(/\n{2,}/).map((text) => text.replace(/\s+/g, " ").trim()).filter(Boolean);
}

async function fetchJson(url, timeoutMs = 9000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

async function fetchApiSports(path, apiKey, params = {}, timeoutMs = 14000) {
  const url = new URL(`${API_SPORTS_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  });
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { "x-apisports-key": apiKey },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.errors && Object.keys(payload.errors).length) throw new Error("API-SPORTS error");
    return payload;
  } finally {
    window.clearTimeout(timeout);
  }
}

function translateApiLeagueName(name) {
  const labels = {
    "World Cup": "Coupe du monde",
    "UEFA Champions League": "Ligue des Champions",
    "UEFA Europa League": "Ligue Europa",
    "UEFA Europa Conference League": "Ligue Conférence",
  };
  return labels[name] || name || "Compétition";
}

function apiSportsState(short) {
  if (["1H", "2H", "ET", "BT", "P", "LIVE", "INT"].includes(short)) return "in";
  if (["FT", "AET", "PEN"].includes(short)) return "post";
  return "pre";
}

function apiSportsStatus(fixture) {
  const status = fixture?.status || {};
  if (apiSportsState(status.short) === "in") return status.elapsed ? `${status.elapsed}'` : status.long || "Live";
  if (apiSportsState(status.short) === "post") return "Terminé";
  return status.long || "À venir";
}

function normalizeApiSportsFixture(item) {
  const fixture = item.fixture || {};
  const leagueInfo = item.league || {};
  const teams = item.teams || {};
  const goals = item.goals || {};
  const status = fixture.status || {};
  return {
    id: `api-football-${fixture.id}`,
    eventId: fixture.id,
    leaguePath: "",
    date: (fixture.date || "").slice(0, 10),
    kickTime: matchTime(fixture.date),
    status: apiSportsStatus(fixture),
    state: apiSportsState(status.short),
    source: "API-SPORTS",
    venue: fixture.venue?.name || "",
    competition: {
      id: `api-league-${leagueInfo.id}`,
      label: translateApiLeagueName(leagueInfo.name),
      country: leagueInfo.country || "Monde",
      flag: leagueInfo.flag || leagueInfo.logo || "un",
      path: "",
      apiLeagueId: leagueInfo.id,
      season: leagueInfo.season,
    },
    home: {
      name: teams.home?.name || "Équipe domicile",
      code: "",
      logo: teams.home?.logo || "",
      score: goals.home ?? "-",
      winner: teams.home?.winner === true,
    },
    away: {
      name: teams.away?.name || "Équipe extérieur",
      code: "",
      logo: teams.away?.logo || "",
      score: goals.away ?? "-",
      winner: teams.away?.winner === true,
    },
  };
}

async function fetchFullArticle(article) {
  if (!article?.apiUrl) return article;
  const payload = await fetchJson(article.apiUrl, 14000);
  const full = payload?.headlines?.[0] || payload;
  const story = full.story || article.body || article.description || "";
  const images = full.images || [];
  return {
    ...article,
    title: full.headline || full.title || article.title,
    description: full.description || article.description,
    body: story,
    paragraphs: htmlToParagraphs(story),
    image: images[0]?.url || article.image,
    imageCredit: images[0]?.credit || article.imageCredit,
    imageAlt: images[0]?.alt || images[0]?.caption || article.imageAlt,
    byline: full.byline || article.byline,
    published: full.published || full.lastModified || article.published,
    sourceUrl: full.links?.web?.href || article.sourceUrl,
    loadedFull: true,
  };
}

async function translateArticle(article) {
  const paragraphs = article.paragraphs?.length ? article.paragraphs : htmlToParagraphs(article.body || article.description || "");
  const translatedParagraphs = [];
  for (const paragraph of paragraphs) {
    translatedParagraphs.push(await translateTextToFrench(paragraph));
  }
  return {
    ...article,
    title: await translateTextToFrench(article.title),
    description: await translateTextToFrench(article.description),
    paragraphs: translatedParagraphs,
    translated: true,
  };
}

function App() {
  const [route, setRoute] = useState(() => readRoute());
  const [sportId, setSportId] = useState("football");
  const [navId, setNavId] = useState("football");
  const [date, setDate] = useState(() => todayInAlgiers());
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingLabel, setLoadingLabel] = useState("Chargement des matches ESPN...");
  const [lastUpdated, setLastUpdated] = useState("");
  const [apiSportsKey, setApiSportsKey] = useState(() => localStorage.getItem(API_SPORTS_KEY_STORAGE) || "");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("footlive:favorites") || "[]"));
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
    const key = new URLSearchParams(window.location.search).get("apisports");
    if (key) {
      localStorage.setItem(API_SPORTS_KEY_STORAGE, key);
      setApiSportsKey(key);
    }
  }, []);

  useEffect(() => {
    if (apiSportsKey) localStorage.setItem(API_SPORTS_KEY_STORAGE, apiSportsKey);
  }, [apiSportsKey]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingLabel(sport.id === "football" && apiSportsKey ? "Chargement des matches API-SPORTS..." : "Chargement des matches ESPN...");
      if (!sport.leagues.length) {
        if (!cancelled) {
          setMatches([]);
          setNews([]);
          setLoadingLabel(sport.unavailable || "Aucun flux ESPN configure pour ce sport.");
        }
        return;
      }
      if (sport.id === "football" && apiSportsKey) {
        let nextNews = [];
        try {
          nextNews = normalizeNews(await fetchJson(newsUrl(sport)));
        } catch {
          nextNews = [];
        }
        try {
          const payload = await fetchApiSports("/fixtures", apiSportsKey, { date, timezone: "Africa/Algiers" });
          if (!cancelled) {
            const apiMatches = (payload.response || []).map(normalizeApiSportsFixture);
            setMatches(apiMatches);
            setNews(nextNews);
            setLastUpdated(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
            setLoadingLabel(`${apiMatches.length} match(s) API-SPORTS - tous pays/ligues disponibles`);
          }
          return;
        } catch {
          if (!cancelled) setLoadingLabel("API-SPORTS indisponible ou clé manquante. Fallback ESPN chargé.");
        }
      }
      const settled = await Promise.allSettled(
        sport.leagues.map(async (item) => {
          const payload = await fetchJson(scoreboardUrl(item, date));
          return (payload.events || []).map((event) => normalizeEvent(event, item));
        }),
      );
      const espnMatches = uniqueMatches(settled.flatMap((result) => (result.status === "fulfilled" ? result.value : [])));
      let nextNews = [];
      try {
        nextNews = normalizeNews(await fetchJson(newsUrl(sport)));
      } catch {
        nextNews = [];
      }
      if (!cancelled) {
        const failed = settled.filter((result) => result.status === "rejected").length;
        setMatches(espnMatches);
        setNews(nextNews);
        setLastUpdated(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        setLoadingLabel(`${espnMatches.length} match(s) affichés - ${sport.leagues.length - failed}/${sport.leagues.length} compétitions ESPN chargées`);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [sportId, date, refreshKey, apiSportsKey]);

  useEffect(() => {
    const timer = window.setInterval(() => setRefreshKey((value) => value + 1), 60000);
    return () => window.clearInterval(timer);
  }, []);

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
        filter === "odds" ||
        (filter === "live" && match.state === "in") ||
        (filter === "finished" && match.state === "post") ||
        (filter === "scheduled" && match.state !== "post" && match.state !== "in");
      return queryOk && filterOk;
    });
  }, [matches, query, filter]);

  const favoriteMatches = matches.filter((match) => favorites.includes(match.id));
  const currentArticle = news.find((item) => item.id === route.id) || news[0] || null;
  const currentMatch = matches.find((match) => match.id === route.id) || null;
  const openMatchPage = (match) => navigate("match", match.id);
  const toggleFavorite = (id) => setFavorites((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  const changeSport = (id, nextQuery = "", nextNavId = id) => {
    setSportId(id);
    setNavId(nextNavId);
    setFilter("all");
    setQuery(nextQuery);
    navigate("scores");
  };
  const selectSearch = (term) => {
    setNavId("");
    setQuery(term);
    navigate("scores");
  };

  return html`
    <div className="app">
      <${TopAnnouncement} />
      <${Topbar} query=${query} setQuery=${setQuery} route=${route} navigate=${navigate} />
      <${HeroBanner} sport=${sport} matches=${matches} navigate=${navigate} />
      <${SportsBar} navId=${navId} setSportId=${changeSport} />
      ${route.view === "scores" && sport.id === "football" && html`<${FootballNewsStrip} news=${news} navigate=${navigate} />`}
      ${route.view === "scores" && sport.id === "football" && html`<${ApiSportsConfig} apiKey=${apiSportsKey} setApiKey=${setApiSportsKey} />`}
      ${route.view === "news" && html`<${NewsPage} sport=${sport} news=${news} navigate=${navigate} />`}
      ${route.view === "article" && html`<${ArticlePage} article=${currentArticle} sport=${sport} navigate=${navigate} />`}
      ${route.view === "match" && html`<${MatchPage} match=${currentMatch} navigate=${navigate} apiSportsKey=${apiSportsKey} />`}
      ${route.view === "favorites" && html`<${FavoritesPage} favorites=${favoriteMatches} navigate=${navigate} openMatch=${openMatchPage} />`}
      ${route.view === "scores" && html`
        <main className="page-grid">
          <${LeftPanel} sport=${sport} matches=${matches} favorites=${favoriteMatches} openMatch=${openMatchPage} selectSearch=${selectSearch} />
          <section className="center-panel">
            <${ScoreHeader} filter=${filter} setFilter=${setFilter} date=${date} setDate=${setDate} />
            <div className="status-line"><span>${loadingLabel}${lastUpdated ? ` - MAJ ${lastUpdated}` : ""}</span><button className="liquid-button dark" type="button" onClick=${() => setRefreshKey((value) => value + 1)}>Actualiser</button></div>
            <${Scoreboard} matches=${visibleMatches} favorites=${favorites} toggleFavorite=${toggleFavorite} openMatch=${openMatchPage} />
          </section>
          <${RightPanel} sport=${sport} news=${news} matches=${matches} openNews=${(item) => navigate("article", item.id)} navigate=${navigate} selectSearch=${selectSearch} />
        </main>
      `}
      <${Footer} navigate=${navigate} sport=${sport} matches=${matches} news=${news} />
    </div>
  `;
}

function TopAnnouncement() {
  return html`<div className="announcement"><strong>Foot Live Pro</strong><span>Scores multi-sports ESPN, actualites internes et interface sans compte client.</span></div>`;
}

function Topbar({ query, setQuery, route, navigate }) {
  return html`
    <header className="topbar">
      <button className="brand brand-button" type="button" onClick=${() => navigate("scores")} aria-label="Foot Live accueil">
        <span className="brand-mark">FL</span>
        <span><strong>Foot Live</strong><small>Scores, calendriers, actus</small></span>
      </button>
      <nav className="main-links" aria-label="Navigation principale">
        <button className=${`main-link liquid-button ${route.view === "scores" ? "active" : ""}`} onClick=${() => navigate("scores")}>Résultats</button>
        <button className=${`main-link liquid-button ${route.view === "news" || route.view === "article" ? "active" : ""}`} onClick=${() => navigate("news")}>Actualités</button>
        <button className=${`main-link liquid-button ${route.view === "favorites" ? "active" : ""}`} onClick=${() => navigate("favorites")}>Favoris</button>
      </nav>
      <label className="search"><span>Recherche</span><input value=${query} onInput=${(event) => setQuery(event.target.value)} type="search" placeholder="Rechercher équipe, pays, compétition" /></label>
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
        <h1>Scores propres, actus internes, compétitions ordonnées.</h1>
        <p>Tableau de bord sportif React inspiré de la structure Flashscore, avec une vraie page actualités et des contrôles utiles.</p>
        <div className="hero-actions">
          <button className="liquid-button active" onClick=${() => navigate("scores")}>Voir les scores</button>
          <button className="liquid-button ghost" onClick=${() => navigate("news")}>Lire les actualités</button>
        </div>
      </div>
      <div className="hero-card"><span>${sport.label}</span><strong>${matches.length}</strong><small>${live} live / ${scheduled} à venir</small></div>
    </section>
  `;
}

function SportsBar({ navId, setSportId }) {
  const selectItem = (item) => {
    setSportId(item.target, item.query || "", item.id);
  };
  return html`<nav className="sports-bar" aria-label="Sports">
    ${SPORT_NAV_ITEMS.map((item) => html`<button key=${item.id} className=${`sport-btn ${item.id === navId ? "active" : ""}`} onClick=${() => selectItem(item)} type="button"><span className="sport-icon-wrap"><${SportIcon} id=${item.id} /></span><span>${item.label}</span></button>`)}
  </nav>`;
}

function FootballNewsStrip({ news, navigate }) {
  const shownNews = useTranslatedNews(news);
  if (!shownNews.length) return null;
  return html`
    <section className="football-news-strip">
      <div className="strip-heading">
        <span>Flashscore Actualités</span>
        <button type="button" onClick=${() => navigate("news")}>Toutes les actualités</button>
      </div>
      <div className="strip-news-row">
        ${shownNews.slice(0, 4).map((item) => html`
          <button className="strip-news-card" type="button" onClick=${() => navigate("article", item.id)}>
            ${item.image ? html`<img src=${item.image} alt="" loading="lazy" />` : html`<span className="strip-news-fallback">FL</span>`}
            <strong>${item.title}</strong>
            <small>${item.description}</small>
          </button>
        `)}
      </div>
    </section>
  `;
}

function ApiSportsConfig({ apiKey, setApiKey }) {
  const [draft, setDraft] = useState(apiKey);
  useEffect(() => setDraft(apiKey), [apiKey]);
  const saveKey = () => setApiKey(draft.trim());
  const clearKey = () => {
    localStorage.removeItem(API_SPORTS_KEY_STORAGE);
    setDraft("");
    setApiKey("");
  };
  return html`
    <section className=${`api-sports-config ${apiKey ? "connected" : ""}`}>
      <div>
        <strong>${apiKey ? "Football API-SPORTS actif" : "Clé API-SPORTS requise pour tous les matchs football"}</strong>
        <span>${apiKey ? "Le football charge /fixtures API-SPORTS pour tous les pays et ligues du jour." : "Colle la clé x-apisports-key pour remplacer ESPN sur Football et Coupe du Monde."}</span>
      </div>
      <label>
        <span>x-apisports-key</span>
        <input value=${draft} onInput=${(event) => setDraft(event.target.value)} type="password" placeholder="Colle ta clé API-SPORTS" />
      </label>
      <button type="button" className="liquid-button active" onClick=${saveKey}>Activer</button>
      ${apiKey && html`<button type="button" className="liquid-button" onClick=${clearKey}>Retirer</button>`}
    </section>
  `;
}

function SportIcon({ id }) {
  if (id === "world-cup") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v3.5c0 3.1-1.7 5.2-4 5.2s-4-2.1-4-5.2V4Z" /><path d="M8 6H5.5c0 3 .9 4.7 3.2 5.3M16 6h2.5c0 3-.9 4.7-3.2 5.3M12 12.7V17M8.8 20h6.4M10 17h4" /><circle className="cup-dot" cx="17.4" cy="5.2" r="1.8" /></svg>`;
  if (id === "basketball") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M3.8 12h16.4M12 3.5v17M5.8 6.2c3 2.4 4.6 5.9 4.7 10.8M18.2 6.2c-3 2.4-4.6 5.9-4.7 10.8" /></svg>`;
  if (id === "tennis") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="10.2" cy="9.2" rx="4.2" ry="6.1" transform="rotate(35 10.2 9.2)" /><path d="M13.3 13.7 19 20M7.6 5.5l5.6 7.4M5.8 8.4l5.8 7.6" /></svg>`;
  if (id === "rugby") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15.5C7.8 20.2 16.2 20.2 20 8.5C16.2 3.8 7.8 3.8 4 15.5Z" /><path d="M8 15.5 16 8.5M10 12l3 3M12 10l3 3" /></svg>`;
  if (id === "handball") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="17.2" cy="5.6" r="2" /><path d="M9 8.5 13 7l2.5 3.5M13 7l-1.4 5.2 3.4 2.2M11.6 12.2 8 17.5M15 14.4l2.7 4.8M7 5.8l2.8 2.7" /></svg>`;
  if (id === "volleyball") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5c.6 3.7 2.7 6.1 6.8 7M12 3.5C8.7 5 6.7 7.5 6 11.4M3.8 13.8c3.9-1.9 7.5-1.5 10.8 1.1M7 18.5c.7-3.6 2.8-6.1 6.4-7.6M18.7 13.5c-2.8 2-5.5 4-6 7" /></svg>`;
  if (id === "american-football") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15.5C7.8 20.2 16.2 20.2 20 8.5C16.2 3.8 7.8 3.8 4 15.5Z" /><path d="M8 15.5 16 8.5M10 12l3 3M12 10l3 3" /></svg>`;
  if (id === "baseball") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M7 5.4c2.3 3.1 2.3 10.1 0 13.2M17 5.4c-2.3 3.1-2.3 10.1 0 13.2M7.7 8.2l1.7.9M7.5 11l1.9.4M7.6 13.8l1.8-.5M16.3 8.2l-1.7.9M16.5 11l-1.9.4M16.4 13.8l-1.8-.5" /></svg>`;
  if (id === "hockey") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v10.5c0 2.5 1.7 3.5 4 3.5h5.5c1.8 0 3-1 3-2.4 0-1.2-1-2.1-2.5-2.1h-4" /><path d="M12 18h-8M3 20h6" /></svg>`;
  if (id === "more") return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5" /></svg>`;
  return html`<svg className="sport-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.4 15.9 10l-1.5 4.5H9.6L8.1 10 12 7.4ZM12 3.5v3.9M4.5 9.2 8.1 10M6.2 18.2l3.4-3.7M17.8 18.2l-3.4-3.7M19.5 9.2 15.9 10" /></svg>`;
}

function LeftPanel({ sport, matches, favorites, openMatch, selectSearch }) {
  const leagueSource = sport.id === "football" && matches.length ? [...new Map(matches.map((match) => [match.competition.id, match.competition])).values()] : sport.leagues;
  const countries = [...new Map(leagueSource.map((item) => [item.country, item])).values()];
  return html`
    <aside className="left-panel">
      <section className="panel"><h2>${sport.id === "football" ? "Ligues du jour" : "Ligues épinglées"}</h2><div className="stack">${leagueSource.slice(0, 20).map((item) => html`<${LeagueButton} key=${item.id} league=${item} count=${countForLeague(matches, item.id)} onClick=${() => selectSearch(item.label)} />`)}</div></section>
      <section className="panel"><h2>Mes équipes</h2>${favorites.length ? html`<div className="stack">${favorites.map((match) => html`<button className="favorite-row" onClick=${() => openMatch(match)}><strong>${match.away.name} - ${match.home.name}</strong><span>${match.status}</span></button>`)}</div>` : html`<p className="muted">Clique sur une étoile pour ajouter un match.</p>`}</section>
      <section className="panel standings-panel"><h2>Pays</h2><div className="country-list">${countries.map((item) => html`<button className="country-link" onClick=${() => selectSearch(item.country)}><span className="country-main"><${Flag} code=${item.flag} /><strong>${item.country}</strong></span><span className="count-pill">${leagueSource.filter((league) => league.country === item.country).length}</span></button>`)}</div></section>
    </aside>
  `;
}

function LeagueButton({ league, count, onClick }) {
  return html`<button className="league-link" onClick=${onClick}><span className="league-main"><${Flag} code=${league.flag} /><span><strong>${league.label}</strong><br /><small>${league.country}</small></span></span><span className="count-pill">${count}</span></button>`;
}

function ScoreHeader({ filter, setFilter, date, setDate }) {
  const shiftDate = (days) => {
    setDate(addDaysISO(date, days));
  };
  const label = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", weekday: "short" }).format(new Date(`${date}T12:00:00`)).replace(".", "");
  const tabs = [
    ["all", "Tous"],
    ["live", "Direct"],
    ["odds", "Côtes"],
    ["finished", "Terminés"],
    ["scheduled", "Prévus"],
  ];
  return html`
    <div className="score-header">
      <div className="tabs-row">${tabs.map(([id, label]) => html`<button className=${`tab ${filter === id ? "active" : ""}`} onClick=${() => setFilter(id)} type="button">${label}</button>`)}</div>
      <div className="date-controls">
        <button className="date-arrow" onClick=${() => shiftDate(-1)} type="button" aria-label="Jour précédent">${"\u2039"}</button>
        <label className="date-picker"><span className="calendar-mark">${"\u25a6"}</span><input className="date-input" value=${date} onChange=${(event) => setDate(event.target.value)} type="date" /><strong>${label}</strong></label>
        <button className="date-arrow" onClick=${() => shiftDate(1)} type="button" aria-label="Jour suivant">${"\u203a"}</button>
      </div>
    </div>
  `;
}

function Scoreboard({ matches, favorites, toggleFavorite, openMatch }) {
  const groups = groupByCompetition(matches);
  if (!groups.length) return html`<div className="match-list"><section className="competition"><div className="competition-head"><span>Aucun match</span></div><div className="empty-match-row">Aucun match ESPN pour ce filtre.</div></section></div>`;
  return html`<div className="match-list">${groups.map(([key, items]) => html`<section className="competition" key=${key}><div className="competition-head"><span className="competition-main"><button className="star-btn header-star" type="button">☆</button><${Flag} code=${items[0].competition.flag} /><strong>${items[0].competition.country.toUpperCase()}: ${items[0].competition.label}</strong><span className="pin-mark">●</span></span><button className="standings-link" type="button">Classement Live ˄</button></div>${items.map((match) => html`<${MatchRow} key=${match.id} match=${match} favorite=${favorites.includes(match.id)} toggleFavorite=${toggleFavorite} openMatch=${openMatch} />`)}</section>`)}</div>`;
}

function MatchRow({ match, favorite, toggleFavorite, openMatch }) {
  const minute = match.state === "in" ? translateStatus(match.status) : match.state === "post" ? "Terminé" : match.kickTime || translateStatus(match.status);
  const style = match.state === "in" ? { "--live-progress": `${liveProgress(match.status)}%` } : {};
  return html`
    <div className=${`match-row ${match.state === "in" ? "live-row" : ""}`} style=${style}>
      <button className=${`star-btn ${favorite ? "active" : ""}`} onClick=${() => toggleFavorite(match.id)} type="button">${"\u2606"}</button>
      <button className=${`time-cell ${match.state === "in" ? "live" : ""}`} onClick=${() => openMatch(match)} type="button">${minute}</button>
      <div className="teams-stack" onClick=${() => openMatch(match)} role="button" tabIndex="0">
        <${TeamLine} team=${match.away} />
        <${TeamLine} team=${match.home} />
      </div>
      <div className="scores-stack" onClick=${() => openMatch(match)} role="button" tabIndex="0">
        <span className=${`score ${match.away.winner ? "winner" : ""}`}>${match.away.score}</span>
        <span className=${`score ${match.home.winner ? "winner" : ""}`}>${match.home.score}</span>
      </div>
      <div className="preview-cell"></div>
    </div>
  `;
}

function TeamLine({ team }) {
  const img = team.logo || (team.flag ? flagUrl(team.flag) : "");
  return html`<span className="team-line">${img && html`<img className="team-logo" src=${img} alt="" loading="lazy" />`}<span className="team-name">${team.name}</span></span>`;
}

function TeamCell({ team, side = "" }) {
  const img = team.logo || (team.flag ? flagUrl(team.flag) : "");
  return html`<span className=${`team-cell ${side}`}>${img && html`<img className="team-logo" src=${img} alt="" loading="lazy" />`}<span className="team-name">${team.name}</span></span>`;
}

function RightPanel({ sport, news, matches, openNews, navigate, selectSearch }) {
  const shownNews = useTranslatedNews(news);
  const live = matches.filter((match) => match.state === "in").length;
  const finished = matches.filter((match) => match.state === "post").length;
  const scheduled = matches.filter((match) => match.state !== "in" && match.state !== "post").length;
  return html`<aside className="right-panel"><section className="panel news-panel"><div className="panel-heading-row"><h2>Actualités</h2><button className="panel-link" onClick=${() => navigate("news")}>Tout voir</button></div><div className="news-list">${shownNews.slice(0, 5).map((item) => html`<button className="news-card" onClick=${() => openNews(item)}>${item.image ? html`<img src=${item.image} alt="" loading="lazy" />` : html`<div className="team-logo"></div>`}<span><strong>${item.title}</strong><small>${item.description || "Lire dans Foot Live"}</small></span></button>`)}</div></section><section className="panel data-panel"><h2>Infos du jour</h2><div className="data-grid"><div><strong>${matches.length}</strong><span>matchs chargés</span></div><div><strong>${live}</strong><span>live</span></div><div><strong>${finished}</strong><span>terminés</span></div><div><strong>${scheduled}</strong><span>à venir</span></div></div></section><section className="panel"><h2>Top compétitions</h2><div className="stack">${sport.leagues.slice(0, 8).map((item) => html`<button className="top-row" onClick=${() => selectSearch(item.label)}><span className="top-main"><${Flag} code=${item.flag} /><strong>${item.label}</strong></span><span className="count-pill">${countForLeague(matches, item.id)}</span></button>`)}</div></section></aside>`;
}

function NewsPage({ sport, news, navigate }) {
  const shownNews = useTranslatedNews(news);
  return html`<main className="page-shell"><section className="section-header"><p className="eyebrow">${sport.label}</p><h1>Actualités sportives</h1><p>Vraies actualités ESPN, traduites en français et consultables directement dans Foot Live.</p></section>${shownNews.length ? html`<div className="news-grid">${shownNews.map((item) => html`<button className="article-card" key=${item.id} onClick=${() => navigate("article", item.id)}>${item.image ? html`<img src=${item.image} alt="" loading="lazy" />` : html`<div className="article-fallback">FL</div>`}<span><small>${sport.label} / ${item.translated ? "FR" : "ESPN"}</small><strong>${item.title}</strong><p>${item.description || "Lire l'article complet dans le site."}</p></span></button>`)}</div>` : html`<div className="empty-panel"><h2>Aucune actualité ESPN chargée</h2><p>Le site n'affiche pas d'actualité locale inventée.</p></div>`}</main>`;
}

function ArticlePage({ article, sport, navigate }) {
  const [detail, setDetail] = useState(article);
  const [translated, setTranslated] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadArticle() {
      if (!article) return;
      setDetail(article);
      setTranslated(null);
      setStatus("");
      let full = article;
      try {
        full = await fetchFullArticle(article);
      } catch {
        full = article;
      }
      if (cancelled) return;
      setDetail(full);
      setStatus("");
      try {
        const fr = await translateArticle(full);
        if (!cancelled) {
          setTranslated(fr);
          setStatus("");
        }
      } catch {
        if (!cancelled) setStatus("Actualité ESPN réelle affichée. Traduction indisponible pour le moment.");
      }
    }
    loadArticle();
    return () => {
      cancelled = true;
    };
  }, [article?.id]);

  if (!article) return html`<main className="page-shell article-layout"><button className="liquid-button ghost back-button" onClick=${() => navigate("news")}>Retour aux actualités</button><div className="empty-panel"><h2>Aucun article ESPN chargé</h2><p>Le site n'affiche pas de faux article local.</p></div></main>`;
  const shown = translated || detail || article;
  const paragraphs = shown.paragraphs?.length ? shown.paragraphs : htmlToParagraphs(shown.body || shown.description || "");
  return html`<main className="page-shell article-layout"><button className="liquid-button ghost back-button" onClick=${() => navigate("news")}>Retour aux actualités</button><article className="article-page"><p className="eyebrow">${sport.label} / Actualité ESPN réelle</p><h1>${shown.title}</h1><div className="article-meta"><span>${shown.byline || "ESPN"}</span><span>${formatNewsDate(shown.published)}</span><strong>${shown.translated ? "Français" : "Source ESPN"}</strong></div>${shown.image && html`<figure className="article-figure"><img className="article-hero" src=${shown.image} alt=${shown.imageAlt || ""} /><figcaption>${shown.imageCredit || shown.imageAlt || ""}</figcaption></figure>`}<p className="article-lead">${shown.description || ""}</p>${status && html`<div className="article-status">${status}</div>`}<div className="article-body">${paragraphs.map((paragraph) => html`<p>${paragraph}</p>`)}</div></article></main>`;
}

function FavoritesPage({ favorites, navigate, openMatch }) {
  return html`<main className="page-shell"><section className="section-header"><p className="eyebrow">Favoris</p><h1>Mes matchs suivis</h1><p>Les favoris restent dans le navigateur, sans connexion client.</p></section>${favorites.length ? html`<div className="favorite-page-grid">${favorites.map((match) => html`<button className="favorite-large-card" onClick=${() => openMatch(match)}><span>${match.competition.label}</span><strong>${match.away.name} - ${match.home.name}</strong><small>${match.status}</small></button>`)}</div>` : html`<div className="empty-panel"><h2>Aucun favori</h2><p>Retourne aux scores et clique sur une étoile pour ajouter un match.</p><button className="liquid-button active" onClick=${() => navigate("scores")}>Voir les scores</button></div>`}</main>`;
}

function athleteName(participant) {
  return participant?.athlete?.displayName || participant?.displayName || "";
}

function normalizeLooseName(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function goalScoreFromText(text, homeName, awayName) {
  const match = String(text || "").match(/Goal!\s*([^,]+?)\s+(\d+),\s*([^\.]+?)\s+(\d+)\./i);
  if (!match) return null;
  const first = normalizeLooseName(match[1]);
  const second = normalizeLooseName(match[3]);
  const home = normalizeLooseName(homeName);
  const away = normalizeLooseName(awayName);
  if (first.includes(home) || home.includes(first)) return { home: Number(match[2]), away: Number(match[4]) };
  if (first.includes(away) || away.includes(first)) return { home: Number(match[4]), away: Number(match[2]) };
  if (second.includes(home) || home.includes(second)) return { home: Number(match[4]), away: Number(match[2]) };
  return { home: Number(match[2]), away: Number(match[4]) };
}

function eventKind(event) {
  const type = event?.type?.type || "";
  if (type.includes("goal")) return "goal";
  if (type.includes("yellow")) return "yellow";
  if (type.includes("red")) return "red";
  if (type.includes("substitution")) return "sub";
  return "";
}

function summaryEventTitle(event) {
  const kind = eventKind(event);
  const first = athleteName(event.participants?.[0]);
  const second = athleteName(event.participants?.[1]);
  if (kind === "sub") return first || event.shortText || "Remplacement";
  if (kind === "goal") return first || event.shortText || "But";
  if (kind === "yellow") return first || event.shortText || "Carton jaune";
  if (kind === "red") return first || event.shortText || "Carton rouge";
  return event.shortText || event.text || "Événement";
}

function summaryEventMeta(event) {
  const kind = eventKind(event);
  const second = athleteName(event.participants?.[1]);
  if (kind === "sub" && second) return second;
  if (kind === "goal" && second) return `(${second})`;
  if (kind === "yellow") return "(Carton jaune)";
  if (kind === "red") return "(Carton rouge)";
  return "";
}

function buildTimeline(events, homeName, awayName) {
  const score = { home: 0, away: 0 };
  return (events || [])
    .filter((event) => eventKind(event))
    .sort((a, b) => ((a.period?.number || 0) - (b.period?.number || 0)) || ((a.clock?.value || 0) - (b.clock?.value || 0)))
    .map((event) => {
      const kind = eventKind(event);
      if (kind === "goal") {
        const parsed = goalScoreFromText(event.text, homeName, awayName);
        if (parsed) {
          score.home = parsed.home;
          score.away = parsed.away;
        } else if (normalizeLooseName(event.team?.displayName) === normalizeLooseName(homeName)) {
          score.home += 1;
        } else {
          score.away += 1;
        }
      }
      return {
        event,
        kind,
        side: normalizeLooseName(event.team?.displayName) === normalizeLooseName(homeName) ? "home" : "away",
        period: event.period?.number || 1,
        score: { ...score },
      };
    });
}

function SummaryTimeline({ events, homeName, awayName, comments }) {
  const rows = buildTimeline(events, homeName, awayName);
  const periods = [1, 2].filter((period) => rows.some((row) => row.period === period) || period === 1);
  if (!rows.length) return html`<section className="match-section summary-card"><p className="muted">Aucun événement clé ESPN chargé.</p></section>`;
  const periodScore = (period) => {
    const last = [...rows].reverse().find((row) => row.period <= period);
    return `${last?.score.home || 0} - ${last?.score.away || 0}`;
  };
  return html`
    <section className="match-section summary-card">
      ${periods.map((period) => html`
        <div className="period-row"><strong>${period}. MI-TEMPS</strong><span>${periodScore(period)}</span></div>
        <div className="timeline-block">
          ${rows.filter((row) => row.period === period).map((row) => html`<${SummaryEventRow} key=${row.event.id} row=${row} />`)}
        </div>
      `)}
      <div className="period-row comments-title"><strong>COMMENTAIRES</strong></div>
      <div className="summary-comments">${comments.slice(0, 3).map((item) => html`<p><strong>${item.time?.displayValue || item.clock?.displayValue || ""}</strong>${translateText(item.text)}</p>`)}</div>
    </section>
  `;
}

function SummaryEventRow({ row }) {
  const { event, kind, side, score } = row;
  return html`
    <div className=${`summary-event ${side}-event`}>
      <span className="summary-minute">${event.clock?.displayValue || ""}</span>
      ${kind === "goal" && html`<span className="summary-score">${score.home} - ${score.away}</span>`}
      <span className=${`summary-icon ${kind}`}>${kind === "goal" ? "⚽" : kind === "sub" ? "↻" : ""}</span>
      <p><strong>${summaryEventTitle(event)}</strong>${summaryEventMeta(event) && html` <span>${summaryEventMeta(event)}</span>`}</p>
    </div>
  `;
}

function mapApiSportsEvent(event, match) {
  const type = String(event.type || "").toLowerCase();
  const detail = String(event.detail || "").toLowerCase();
  const kind = type.includes("goal") ? "goal" : type.includes("card") && detail.includes("yellow") ? "yellow-card" : type.includes("card") ? "red-card" : type.includes("subst") ? "substitution" : type;
  return {
    id: `${event.time?.elapsed || ""}-${event.team?.id || ""}-${event.player?.id || ""}-${event.type || ""}`,
    type: { type: kind },
    text: event.comments || event.detail || event.type || "",
    shortText: `${event.player?.name || ""} ${event.detail || event.type || ""}`.trim(),
    period: { number: (event.time?.elapsed || 0) > 45 ? 2 : 1 },
    clock: { value: (event.time?.elapsed || 0) * 60, displayValue: event.time?.elapsed ? `${event.time.elapsed}'` : "" },
    team: { displayName: event.team?.name || "" },
    participants: [
      event.player?.name ? { athlete: { displayName: event.player.name } } : null,
      event.assist?.name ? { athlete: { displayName: event.assist.name } } : null,
    ].filter(Boolean),
  };
}

function normalizeApiSportsSummary(eventsPayload, statsPayload, lineupsPayload, playersPayload, match) {
  const events = (eventsPayload?.response || []).map((event) => mapApiSportsEvent(event, match));
  const boxscoreTeams = (statsPayload?.response || []).map((team) => ({
    team: { displayName: team.team?.name || "" },
    statistics: (team.statistics || []).map((stat) => ({
      name: stat.type,
      label: stat.type,
      displayValue: stat.value ?? "0",
    })),
  }));
  const rosters = (lineupsPayload?.response || []).map((team) => ({
    team: { displayName: team.team?.name || "" },
    roster: [
      ...(team.startXI || []).map((item) => ({ athlete: { displayName: item.player?.name || "" }, position: { abbreviation: item.player?.pos || "" } })),
      ...(team.substitutes || []).map((item) => ({ athlete: { displayName: item.player?.name || "" }, position: { abbreviation: item.player?.pos || "" } })),
    ],
  }));
  const leaders = (playersPayload?.response || []).map((team) => ({
    team: { displayName: team.team?.name || "" },
    leaders: [{
      displayName: "Joueurs",
      leaders: (team.players || []).slice(0, 8).map((item) => ({
        athlete: { displayName: item.player?.name || "" },
        displayValue: item.statistics?.[0]?.games?.position || "",
      })),
    }],
  }));
  return { keyEvents: events, commentary: [], boxscore: { teams: boxscoreTeams }, rosters, leaders, standings: [] };
}

async function fetchApiSportsSummary(match, apiKey) {
  if (!apiKey) throw new Error("Clé API-SPORTS manquante");
  const params = { fixture: match.eventId };
  const [events, stats, lineups, players] = await Promise.allSettled([
    fetchApiSports("/fixtures/events", apiKey, params),
    fetchApiSports("/fixtures/statistics", apiKey, params),
    fetchApiSports("/fixtures/lineups", apiKey, params),
    fetchApiSports("/fixtures/players", apiKey, params),
  ]);
  return normalizeApiSportsSummary(
    events.status === "fulfilled" ? events.value : null,
    stats.status === "fulfilled" ? stats.value : null,
    lineups.status === "fulfilled" ? lineups.value : null,
    players.status === "fulfilled" ? players.value : null,
    match,
  );
}

function MatchPage({ match, navigate, apiSportsKey }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState("");
  const [mainTab, setMainTab] = useState("match");
  const [subTab, setSubTab] = useState("summary");

  useEffect(() => {
    let cancelled = false;
    async function loadSummary() {
      if (!match) return;
      setLoading("");
      try {
        const payload = match.source === "API-SPORTS" ? await fetchApiSportsSummary(match, apiSportsKey) : await fetchJson(summaryUrl(match));
        if (!cancelled) {
          setSummary(payload);
          setLoading("");
        }
      } catch {
        if (!cancelled) {
          setSummary(null);
          setLoading("");
        }
      }
    }
    loadSummary();
    const timer = window.setInterval(loadSummary, 45000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [match?.id, apiSportsKey]);

  if (!match) return html`<main className="page-shell match-page"><button className="liquid-button ghost back-button" onClick=${() => navigate("scores")}>Retour aux scores</button><div className="empty-panel"><h2>Match introuvable</h2><p>Retourne aux scores et ouvre un match chargé depuis ESPN.</p></div></main>`;

  const competition = summary?.header?.competitions?.[0] || {};
  const competitors = competition.competitors || [];
  const homeSummary = competitors.find((item) => item.homeAway === "home");
  const awaySummary = competitors.find((item) => item.homeAway === "away");
  const homeScore = homeSummary?.score ?? match.home.score;
  const awayScore = awaySummary?.score ?? match.away.score;
  const status = translateStatus(summary?.header?.competitions?.[0]?.status?.type?.shortDetail || match.status);
  const commentary = (summary?.commentary || []).slice(-8).reverse();
  const keyEvents = summary?.keyEvents || [];
  const odds = summary?.odds?.[0] || null;
  const stats = summary?.boxscore?.teams || [];
  const homeStats = stats.find((item) => item.team?.displayName === match.home.name)?.statistics || [];
  const awayStats = stats.find((item) => item.team?.displayName === match.away.name)?.statistics || [];
  const rosters = summary?.rosters || [];
  const leaders = summary?.leaders || [];
  const standings = summary?.standings?.entries || summary?.standings || [];
  const matchNews = summary?.news || [];
  const mainTabs = [
    ["match", "Match"],
    ["odds", "Côtes"],
    ["h2h", "TàT"],
    ["standings", "Classements"],
    ["news", "Actualités"],
  ];
  const subTabs = [
    ["summary", "Résumé"],
    ["stats", "Stats"],
    ["lineups", "Compos"],
    ["players", "Stats joueurs"],
    ["comments", "Commentaires"],
  ];
  return html`
    <main className="page-shell match-page">
      <div className="match-breadcrumb"><button onClick=${() => navigate("scores")} type="button">Football</button><span>${"\u203a"}</span><span>${match.competition.country}</span><span>${"\u203a"}</span><strong>${match.competition.label}</strong><button className="new-window-btn" type="button">Nouvelle fenêtre</button></div>
      <section className="match-hero">
        <button className="star-btn" type="button">☆</button>
        <div className="match-team-card"><${TeamBadge} team=${match.home} /><strong>${match.home.name}</strong><span>${match.home.code || ""}</span></div>
        <div className="match-score-card"><span>${formatMatchDate(match.date)}</span><strong>${homeScore} - ${awayScore}</strong><small>${status}</small></div>
        <div className="match-team-card"><${TeamBadge} team=${match.away} /><strong>${match.away.name}</strong><span>${match.away.code || ""}</span></div>
        <button className="star-btn" type="button">☆</button>
      </section>
      <nav className="match-tabs">${mainTabs.map(([id, label]) => html`<button className=${mainTab === id ? "active" : ""} onClick=${() => setMainTab(id)} type="button">${label}</button>`)}</nav>
      ${mainTab === "match" && html`<div className="match-subtabs">${subTabs.map(([id, label]) => html`<button className=${subTab === id ? "active" : ""} onClick=${() => setSubTab(id)} type="button">${label}</button>`)}</div>`}
      ${mainTab === "match" && subTab === "summary" && html`<${SummaryTimeline} events=${keyEvents} homeName=${match.home.name} awayName=${match.away.name} comments=${commentary} />`}
      ${mainTab === "match" && subTab === "stats" && html`<section className="match-section"><h3>Stats ESPN</h3><${StatsTable} home=${homeStats} away=${awayStats} homeName=${match.home.name} awayName=${match.away.name} /></section>`}
      ${mainTab === "match" && subTab === "lineups" && html`<section className="match-section"><h3>Compositions ESPN</h3><${RosterList} rosters=${rosters} /></section>`}
      ${mainTab === "match" && subTab === "players" && html`<section className="match-section"><h3>Stats joueurs ESPN</h3><${LeadersList} leaders=${leaders} /></section>`}
      ${mainTab === "match" && subTab === "comments" && html`<section className="match-section"><h3>Commentaires</h3>${commentary.length ? commentary.map((item) => html`<div className="comment-line"><strong>${item.time?.displayValue || ""}</strong><p>${translateText(item.text)}</p></div>`) : html`<p className="muted">Aucun commentaire ESPN chargé.</p>`}</section>`}
      ${mainTab === "odds" && html`<section className="match-section odds-section"><h3>Côtes ${odds?.provider?.name ? html`<span>${odds.provider.name}</span>` : ""}</h3><div className="odds-grid"><div><span>1</span><strong>${formatOdds(odds?.homeTeamOdds)}</strong></div><div><span>X</span><strong>${formatDrawOdds(odds)}</strong></div><div><span>2</span><strong>${formatOdds(odds?.awayTeamOdds)}</strong></div></div></section>`}
      ${mainTab === "h2h" && html`<section className="match-section"><h3>Tête-à-tête ESPN</h3><${GamesList} games=${summary?.headToHeadGames || []} /></section>`}
      ${mainTab === "standings" && html`<section className="match-section"><h3>Classements ESPN</h3><${StandingsList} standings=${standings} /></section>`}
      ${mainTab === "news" && html`<section className="match-section"><h3>Actualités ESPN</h3><${MatchNewsList} news=${matchNews} /></section>`}
    </main>
  `;
}

function TeamBadge({ team }) {
  const img = team.logo || (team.flag ? flagUrl(team.flag) : "");
  return html`<div className="team-badge">${img && html`<img src=${img} alt="" />`}</div>`;
}

function formatMatchDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

function formatNewsDate(date) {
  if (!date) return "Date ESPN indisponible";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}

function formatOdds(teamOdds) {
  return teamOdds?.moneyLine ?? teamOdds?.odds?.summary ?? "-";
}

function formatDrawOdds(odds) {
  return odds?.drawOdds?.moneyLine ?? odds?.drawOdds?.summary ?? "-";
}

function StatsTable({ home, away, homeName, awayName }) {
  const rows = (away.length ? away : home).slice(0, 8);
  if (!rows.length) return html`<p className="muted">Stats ESPN indisponibles pour ce match.</p>`;
  return html`<div className="stats-table"><div className="stats-head"><strong>${awayName}</strong><strong>${homeName}</strong></div>${rows.map((row) => {
    const homeRow = home.find((item) => item.name === row.name || item.label === row.label) || {};
    const awayValue = row.displayValue || row.value || "0";
    const homeValue = homeRow.displayValue || homeRow.value || "0";
    return html`<div className="stat-row"><span>${awayValue}</span><p>${translateStatLabel(row.name || row.label)}</p><span>${homeValue}</span></div>`;
  })}</div>`;
}

function RosterList({ rosters }) {
  if (!rosters.length) return html`<p className="muted">Compositions ESPN indisponibles pour ce match.</p>`;
  return html`<div className="real-list">${rosters.map((team) => html`<section><h4>${team.team?.displayName || "Equipe"}</h4>${(team.roster || []).slice(0, 16).map((player) => html`<p>${player.athlete?.displayName || player.displayName || "Joueur"} <span>${player.position?.abbreviation || ""}</span></p>`)}</section>`)}</div>`;
}

function LeadersList({ leaders }) {
  if (!leaders.length) return html`<p className="muted">Stats joueurs ESPN indisponibles pour ce match.</p>`;
  return html`<div className="real-list">${leaders.map((team) => html`<section><h4>${team.team?.displayName || "Equipe"}</h4>${(team.leaders || []).map((group) => html`<p><strong>${translateStatLabel(group.displayName || group.name)}</strong> ${(group.leaders || []).map((item) => `${item.athlete?.displayName || ""} ${item.displayValue || ""}`).join(" / ")}</p>`)}</section>`)}</div>`;
}

function GamesList({ games }) {
  if (!games.length) return html`<p className="muted">Tête-à-tête ESPN indisponible pour ce match.</p>`;
  return html`<div className="real-list">${games.slice(0, 8).map((game) => html`<p><strong>${formatMatchDate((game.gameDate || game.date || "").slice(0, 10))}</strong> ${game.name || game.shortName || "Match ESPN"}</p>`)}</div>`;
}

function StandingsList({ standings }) {
  const rows = Array.isArray(standings) ? standings : [];
  if (!rows.length) return html`<p className="muted">Classement ESPN indisponible pour ce match.</p>`;
  return html`<div className="real-list">${rows.slice(0, 12).map((entry) => html`<p><strong>${entry.team?.displayName || entry.team || entry.name || "Equipe"}</strong> ${entry.stats?.map((stat) => `${translateStatLabel(stat.name)}: ${stat.displayValue}`).join(" · ") || ""}</p>`)}</div>`;
}

function MatchNewsList({ news }) {
  const items = Array.isArray(news) ? news : [];
  if (!items.length) return html`<p className="muted">Actualités ESPN indisponibles pour ce match.</p>`;
  return html`<div className="real-list">${items.slice(0, 8).map((item) => html`<p><strong>${item.headline || item.title}</strong> ${item.description || ""}</p>`)}</div>`;
}

function Footer({ navigate, sport, matches, news }) {
  const worldCupItems = matches.filter((match) => match.competition.id === "fifa.world").slice(0, 10).map(matchLabel);
  const popularItems = sport.leagues.slice(0, 10).map((item) => item.label);
  const liveItems = matches.filter((match) => match.state === "in").slice(0, 10).map(matchLabel);
  const footballItems = sport.id === "football" ? matches.slice(0, 10).map(matchLabel) : [];
  const directItems = matches.slice(0, 10).map(matchLabel);
  const footerColumns = [
    ["CDM 2026", ...filledItems(worldCupItems, "Aucun match ESPN chargé")],
    ["Populaire", ...filledItems(popularItems, "Aucune compétition chargée")],
    ["Livescore", ...filledItems(liveItems, "Aucun live ESPN chargé")],
    ["Football Live", ...filledItems(footballItems, "Selectionne Football")],
    ["Match en direct", ...filledItems(directItems, "Aucun match ESPN chargé")],
  ];
  const legalLeft = ["Conditions d'utilisation", "Politique de confidentialité", "RGPD et journalisme", "Impressum", "Publicité", "Contact"];
  const legalRight = ["Mobile", "Livescore", "Sites recommandes", "FAQ", "Audio", "Bonus de paris sportifs"];
  const social = ["Facebook", "X", "Instagram", "TikTok"];
  return html`
    <footer className="site-footer">
      <div className="footer-link-grid">
        ${footerColumns.map(([title, ...items]) => html`<section><h3>${title}</h3>${items.map((item) => html`<button type="button" onClick=${() => navigate("scores")}>${item}</button>`)}</section>`)}
      </div>
      <div className="footer-meta">
        <section>
          <h3>Footlive.fr</h3>
          <div className="footer-mini-grid">${legalLeft.map((item) => html`<button type="button">${item}</button>`)}</div>
        </section>
        <section>
          <h3>&nbsp;</h3>
          <div className="footer-mini-grid">${legalRight.map((item) => html`<button type="button">${item}</button>`)}</div>
        </section>
        <section>
          <h3>Suivez nous</h3>
          <div className="social-list">${social.map((item) => html`<button type="button"><span className="social-dot">${item[0]}</span>${item}</button>`)}</div>
        </section>
      </div>
      <div className="footer-bottom">
        <button type="button" className="lite-link">Version lite</button>
        <p>Jeu responsable. Gambling Therapy. 18+</p>
        <p>Copyright © 2026 Footlive.fr | Définir la confidentialité</p>
      </div>
    </footer>
  `;
}

function countForLeague(matches, id) {
  return matches.filter((match) => match.competition.id === id).length;
}

function groupByCompetition(matches) {
  const map = new Map();
  const sortedMatches = [...matches].sort((a, b) => {
    const stateRank = { in: 0, pre: 1, post: 2 };
    const stateDiff = (stateRank[a.state] ?? 3) - (stateRank[b.state] ?? 3);
    if (stateDiff) return stateDiff;
    return `${a.date} ${a.kickTime}`.localeCompare(`${b.date} ${b.kickTime}`);
  });
  sortedMatches.forEach((match) => {
    const key = `${match.competition.country}-${match.competition.label}`;
    map.set(key, [...(map.get(key) || []), match]);
  });
  return [...map.entries()].sort((a, b) => {
    const first = a[1][0].competition;
    const second = b[1][0].competition;
    if (first.id === "fifa.world") return -1;
    if (second.id === "fifa.world") return 1;
    return `${first.country} ${first.label}`.localeCompare(`${second.country} ${second.label}`, "fr");
  });
}

function matchLabel(match) {
  return `${match.away.name} ${match.away.score} - ${match.home.score} ${match.home.name}`;
}

function filledItems(items, emptyLabel) {
  return items.length ? items : [emptyLabel];
}

createRoot(document.getElementById("root")).render(html`<${App} />`);

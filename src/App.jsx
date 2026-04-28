import {useState} from 'react'
import './App.css'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {InputGroup} from "react-bootstrap";

import Game from "./Game.jsx";

async function fetchJson(url, label) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
  const contentType = response.headers.get("Content-Type") || "";
  const body = await response.text();
  const bodyStart = body.slice(0, 200);

  if (!response.ok) {
    throw new Error(`${label} request failed: ${response.status} ${response.statusText}. URL: ${url}. Body: ${bodyStart}`);
  }

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error(`${label} did not return JSON. URL: ${url}. Content-Type: ${contentType || "unknown"}. Body: ${bodyStart}`);
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error(`${label} returned invalid JSON. URL: ${url}. Content-Type: ${contentType || "unknown"}. Body: ${bodyStart}. Parse error: ${error.message}`);
  }
}

function App() {

  const gamesBatchSize = 100;

  const [totalGames, setTotalGames] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndProcessGames = async () => {
    setIsLoading(true);
    setGames([]);
    setLoadingProgress(0);
    try {

      // Loading all Games with Trading Cards
      // const steamCardExchangeTargetUrl = `https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Guest`;
      // const steamCardExchangeProxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(steamCardExchangeTargetUrl)}`;
      // const steamCardExchangeResponse = await fetch(steamCardExchangeProxyUrl);
      const steamCardExchangeJson = await fetchJson('/steamcardexchange', 'SteamCardExchange');
      const steamCardExchangeData = steamCardExchangeJson?.data ?? [];
      setTotalGames(steamCardExchangeData.length)

      // Bundle in Packages for SteamAPI calls
      const packages = [];
      for (let i = 0; i < steamCardExchangeData.length; i += gamesBatchSize) {
        packages.push(steamCardExchangeData.slice(i, i + gamesBatchSize));
      }

      // Load Steam Data for each Package
      const sceById = new Map(
          steamCardExchangeData.map((entry) => [String(entry?.[0]?.[0]), entry])
      );

      for (const pack of packages) {
        const nextGames = [];

        // Build URL for Steam API
        let urlIdPart = "";
        pack.forEach(data => {
          urlIdPart += data[0][0] + ","
        });
        urlIdPart = urlIdPart.slice(0, urlIdPart.length - 1); // Remove last comma

        const steamUrl = `/steam?appids=${encodeURIComponent(urlIdPart)}`;
        const steamApiPriceData = Object.entries(await fetchJson(steamUrl, 'Steam API'));

        steamApiPriceData
        .filter(([, value]) => value?.success === true)
        .forEach(([id, priceData]) => {
          const initialPrice = priceData?.data?.price_overview?.initial;
          const finalPrice = priceData?.data?.price_overview?.final;
          const finalFormatted = priceData?.data?.price_overview?.final_formatted;
          const sceData = sceById.get(String(id));
          const numberOfCards = Number(sceData?.[1]);

          if (priceData?.success === true && typeof initialPrice === "number"
              && initialPrice > 0 && Number.isFinite(numberOfCards)
              && numberOfCards > 0 && typeof finalPrice === "number") {
            const gameData = {
              id: id,
              name: sceData?.[0]?.[1] ?? id,
              score: finalPrice / numberOfCards,
              price: finalFormatted ?? "",
              numberOfCards: numberOfCards
            };
            nextGames.push(gameData);
          }
        });
        setGames((loadedGames) => [...loadedGames, ...nextGames].sort((a, b) => a.score - b.score))
        setLoadingProgress((progress) => progress + steamApiPriceData.length);
      }
    } catch (e) {
      console.error("Game loading failed", e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="container">
        <div className="row header justify-content-center">
          [WIP] Best Steam Trading Card Games Finder
        </div>

        <div className="row">
          {/*<div className="col-4 box">
            <Form.Select className="shop-region-select" id="shop-region-select" aria-label="Select Shop Region" data-style="btn-primary">

            </Form.Select>
          </div>*/}
          <div className="col box">
            <progress className="w-100 h-100" value={loadingProgress} max={totalGames}>%</progress>
          </div>
          <div className="col-2 box">
            <Button className="btn-primary w-auto"
                    onClick={fetchAndProcessGames} disabled={isLoading}>
              Load Button
            </Button>
          </div>
        </div>
        {/*<div className="row">
          <div className="col box">
            <Form.Select aria-label="Select Profile">

            </Form.Select>
          </div>
          <div className="col-2 box">
            <Button className="btn-primary">New Profile</Button>
          </div>
          <div className="col-2 box">
            <Button className="btn-danger">Delete Profile</Button>
          </div>
        </div>
        <div className="row">
          <div className="col box">
            <Form>
              {['checkbox'].map((type) => (
                  <div key={`inline-${type}`} className="mb">
                    <Form.Check inline label="Purchased" name="gameStatusFilter" type={type} id={`inline-${type}-1`} />
                    <Form.Check inline label="Wishlisted" name="gameStatusFilter" type={type} id={`inline-${type}-2`} />
                    <Form.Check inline label="Ignored" name="gameStatusFilter" type={type} id={`inline-${type}-3`} />
                    <Form.Check inline label="None" name="gameStatusFilter" type={type} id={`inline-${type}-0`} />
                  </div>
              ))}
            </Form>
          </div>
        </div>*/}
        <div className="row">
          <div className="col box flex-nowrap">
            <InputGroup className="search-text-group" disabled={isLoading}>
              <InputGroup.Text id="searchInput" className="search-text-icon">🔎</InputGroup.Text>
              <Form.Control className="search-text-field"
                            id="searchInputTextField"
                            aria-describedby="searchInput" type="text"
                            placeholder="..."/>
              <Button className="btn-secondary"
                      id={"searchInputClear"}
                      aria-describedby="searchInput">
                X
              </Button>
            </InputGroup>
          </div>
        </div>

        <div className="row">
          <div className="game-grid">
            {games.map((game) => (
                <Game key={game.id} data={game}/>
            ))}
          </div>
        </div>
      </div>
  )
}

export default App

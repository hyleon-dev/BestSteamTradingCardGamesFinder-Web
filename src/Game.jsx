import './Game.css'

function openInNewTab(url) {
  window.open(url, '_blank', 'noopener,noreferrer').focus();
}

export default function Game({data}) {

  return (

      <div className={"row game-card"}>
        <div className={"col col-3 img-col"}>
          <img src={data.imgUrl} alt={data.name} loading="lazy"/>
        </div>
        <div className={"col game-info-col"}>
          <div className={"row row-2"}>
            <h3 className={"fw-bold"}>{data.name}</h3>
          </div>
          <div className={"row"}>
            <p>💰 {data.price}</p>
            <p>🎴 {data.numberOfCards}</p>
            <p>💯 {data.score.toFixed(2)}</p>
          </div>
          <div className={"row row-1 actions-row"}>
            <div className={"col"}>
              <button className="btn btn-primary" onClick={() => openInNewTab(
                  `https://store.steampowered.com/app/${data.id}`)}>Store
              </button>
            </div>
            <div className={"col"}>
              <button className="btn btn-secondary" onClick={() => openInNewTab(
                  `https://steamdb.info/app/${data.id}/`)}>SteamDB
              </button>
            </div>
            <div className={"col"}>
              <button className="btn btn-danger" disabled={true}>Ignore</button>
            </div>

          </div>
        </div>
      </div>
  )
}
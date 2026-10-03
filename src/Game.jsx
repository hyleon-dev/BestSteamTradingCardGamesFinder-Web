import './Game.css'

// Some games have no portrait cover. Use the header image then.
function onImageError(event, id) {
  const img = event.currentTarget;
  if (img.dataset.fallback) {
    return;
  }
  img.dataset.fallback = "true";
  img.src = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/header.jpg`;
}

export default function Game({data}) {

  return (

      <div className={"game-card"}>
        <div className={"img-col"}>
          <img src={data.imgUrl} alt={data.name} loading="lazy"
               onError={(event) => onImageError(event, data.id)}/>
        </div>
        <div className={"col game-info-col"}>
          <div className={"row row-2"}>
            <h3 className={"fw-bold"}>{data.name}</h3>
          </div>
          <div className={"game-info-bottom"}>
            <div className={"row"}>
              <p>💰 Price - {data.price}</p>
              <p>🎴 Cards - {data.numberOfCards}</p>
              <p>💯 Score - {data.score.toFixed(2)}</p>
            </div>
            <div className={"row row-1 actions-row"}>
              <div className={"col"}>
                <a className="btn btn-primary" target="_blank" rel="noopener noreferrer"
                   href={`https://store.steampowered.com/app/${data.id}`}>Store</a>
              </div>
              <div className={"col"}>
                <a className="btn btn-secondary" target="_blank" rel="noopener noreferrer"
                   href={`https://steamdb.info/app/${data.id}/`}>SteamDB</a>
              </div>
              <div className={"col"}>
                <button className="btn btn-danger" disabled={true}>Ignore</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

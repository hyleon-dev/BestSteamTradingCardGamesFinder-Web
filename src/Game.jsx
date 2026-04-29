import './Game.css'

export default function Game({ data }) {

  return(
      <div className="game-card container">
        <div className={"row"}>
          <div className="col-2 game-image-col">
            <img src={data.imgUrl} alt={data.name} className="game-image" loading="lazy"/>
          </div>
          <div className="col game-info-col">
            <div className="row-2 game-title-row">
              <div className="col">
                <h2>{data.name}</h2>
              </div>
              <div className="col">
                <p>{data.id}</p>
              </div>
            </div>
            <div className="row game-details-row">
              <div className="col">
                <p>Price: {data.price}</p>
              </div>
              <div className="col">
                <p>Number of Cards: {data.numberOfCards}</p>
              </div>
              <div className="col">
                <p>Score: {data.score}</p>
              </div>
            </div>
            <div className="row-1 actions-row">
            </div>
          </div>
        </div>
      </div>
  )
}
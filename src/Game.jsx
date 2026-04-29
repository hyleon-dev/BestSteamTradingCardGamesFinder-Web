import './Game.css'

export default function Game({ data }) {

  return(
      <div className="game-card card">
        <img src={data.imgUrl} alt={data.name}
             className="game-card-img card-img-top"
             loading="lazy"/>
        <div className="card-body">
          <h3 className={"card-title fw-bold"}>{data.name}</h3>
          <p className={"card-subtitle"}>{data.id}</p>
          <div className="card-text">
            <p>Price: {data.price}</p>
            <p>Number of Cards: {data.numberOfCards}</p>
            <p>Score: {data.score.toFixed(2)}</p>
          </div>
          <div className="actions-row card-footer"></div>
        </div>
      </div>
  )
}
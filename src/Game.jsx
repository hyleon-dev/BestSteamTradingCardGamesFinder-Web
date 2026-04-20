export default function Game({ data }) {

  return(
      <div className="game-card">
        <h2>{data.name}</h2>

        <p>{data.id}</p>
        <p>Price: {data.price}</p>
        <p>Number of Cards: {data.numberOfCards}</p>
        <p>Score: {data.score}</p>
      </div>
  )
}
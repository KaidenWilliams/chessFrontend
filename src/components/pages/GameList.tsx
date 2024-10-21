import { Link } from "react-router-dom";

interface Game {
  id: string;
  name: string;
  players: number;
  timeControl: string;
}

interface Props {}

const GameList = (props: Props) => {
  const games: Game[] = [
    { id: "1", name: "Chess", players: 2, timeControl: "10+0" },
    { id: "2", name: "Go", players: 2, timeControl: "15+10" },
    { id: "3", name: "Checkers", players: 2, timeControl: "5+3" },
  ];

  return (
    <div>
      <h2 className="mb-4">Game List</h2>
      <div className="row">
        {games.map((game) => (
          <div key={game.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{game.name}</h5>
                <p className="card-text">Players: {game.players}</p>
                <p className="card-text">Time Control: {game.timeControl}</p>
                <Link to={`/play/${game.id}`} className="btn btn-primary">
                  Play Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="btn btn-success">Create New Game</button>
      </div>
    </div>
  );
};

export default GameList;

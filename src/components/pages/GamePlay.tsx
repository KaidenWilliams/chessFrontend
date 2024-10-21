import { useParams } from "react-router-dom";

interface Props {}

const GamePlay = (props: Props) => {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <div className="row">
      <div className="col-md-8">
        <div
          className="game-board"
          style={{ height: "500px", backgroundColor: "#f0f0f0" }}
        >
          {/* Game board will be rendered here */}
          <p className="text-center pt-5">Game Board for Game ID: {gameId}</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Game Info</h5>
            <p>Players: Player 1 vs Player 2</p>
            <p>Time Control: 10+0</p>
            <p>Moves: 0</p>
          </div>
        </div>
        <div className="mt-4">
          <button className="btn btn-danger btn-block">Resign</button>
          <button className="btn btn-secondary btn-block mt-2">
            Offer Draw
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;

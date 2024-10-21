import React from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../auth/AuthContextHook";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="text-center py-5">
      <h1 className="display-4">Welcome to MyChess.com</h1>
      <p className="lead">
        Experience the classic game of chess in a modern online environment.
      </p>
      <div className="my-4">
        <p>
          Challenge players from around the world, improve your skills, and
          climb the rankings.
        </p>
      </div>
      {!isAuthenticated ? (
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-outline-primary">
            Register
          </Link>
        </div>
      ) : (
        <Link to="/games" className="btn btn-primary">
          View Games
        </Link>
      )}
    </div>
  );
};

export default Home;

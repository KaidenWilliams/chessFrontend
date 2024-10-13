import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="jumbotron">
      <h1 className="display-4">Welcome to GameHub</h1>
      <p className="lead">Play your favorite games online with friends!</p>
      <hr className="my-4" />
      <p>Get started by logging in or browsing our game list.</p>
      <Link to="/login" className="btn btn-primary btn-lg mr-2">
        Login
      </Link>
      <Link to="/games" className="btn btn-secondary btn-lg">
        Browse Games
      </Link>
    </div>
  );
};

export default Home;

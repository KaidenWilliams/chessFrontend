import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import useAuthContext from "./components/auth/AuthContextHook";
import GamePlay from "./components/pages/GamePlay";
import GameList from "./components/pages/GameList";

const App = () => {
  const { isAuthenticated } = useAuthContext();

  const GetAllRoutes = () => {
    return (
      <>
        <SharedRoutes />
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </>
    );
  };

  const SharedRoutes = () => {
    return (
      <>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </>
    );
  };

  const UnauthenticatedRoutes = () => (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  );

  const AuthenticatedRoutes = () => (
    <>
      <Route path="/list" element={<GameList />} />
      <Route path="/play" element={<GamePlay />} />
    </>
  );

  return (
    <Router>
      <div className="app bg-dark text-white min-vh-100 d-flex flex-column">
        <main className="container my-4">
          <Routes>
            <GetAllRoutes />
          </Routes>
        </main>
        <footer className="text-center py-4">
          <p>
            &copy; {new Date().getFullYear()} MyChess.com. No rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;

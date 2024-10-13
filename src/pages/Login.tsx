import React, { useState } from "react";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <form>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter username"
                  />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            <p className="text-center mt-3">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <a href="#" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign Up" : "Login"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

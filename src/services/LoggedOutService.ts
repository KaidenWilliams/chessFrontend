export class LoggedOutService {



    private String register(String[] params) {

        if (params == null || params.length != 3) {
            return getErrorStringSyntax("register");
        }

        try {
            var req = new RegisterRequest(params[0], params[1], params[2]);
            RegisterResponse res = context.serverFacade.registerUser(req);
            context.authToken = res.authToken();
            context.username = params[0];
            context.observer.changeStateLoggedIn();
            return setStringColor(_color, getRegisterString(context.username));

        } catch (ClientException e) {
            return getErrorStringRequest(e.toString(), "register");
        }
    }

    private String login(String[] params)  {

        if (params == null || params.length != 2) {
            return getErrorStringSyntax("login");
        }
        try {
            var req = new LoginRequest(params[0], params[1]);
            LoginResponse res = context.serverFacade.loginUser(req);

            context.authToken = res.authToken();
            context.username = params[0];
            context.observer.changeStateLoggedIn();
            return setStringColor(_color, getLoginString(context.username));
        }
        catch (ClientException e) {
            return getErrorStringRequest(e.toString(), "login");
        }
    }
}
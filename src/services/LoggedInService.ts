export class LoggedInService {


    private String logout(String[] params)  {

        try {
            context.serverFacade.logoutUser(context.authToken);
            String tempUsername = context.username;

            context.username = null;
            context.authToken = null;
            context.observer.changeStateLoggedOut();
            return setStringColor(_color, getLogoutString(tempUsername));
        }
        catch (ClientException e) {
            return getErrorStringRequest(e.toString(), "logout");
        }
    }


    private String list(String[] params)  {

        try {
            ListGamesResponse res = context.serverFacade.listGames(context.authToken);

            StringBuilder sb = new StringBuilder();
            int i = 1;
            gameNumberMap.clear();

            for (ListGamesResponse.Game game : res.games()) {
                sb.append(getListGamesString(i, game.gameName(), game.whiteUsername(), game.blackUsername()));
                gameNumberMap.put(i, game.gameID());
                i++;
            }
            return setStringColor(_color, sb.toString());
        }
        catch (ClientException e) {
            return getErrorStringRequest(e.toString(), "list");
        }
    }

    private String create(String[] params)  {

        if (params == null || params.length != 1) {
            return getErrorStringSyntax("create");
        }
        try {
            var req = new CreateGameRequest.RequestBody(params[0]);
            context.serverFacade.createGame(req, context.authToken);

            return setStringColor(_color, getCreateGameString(params[0]));
        }
        catch (ClientException e) {
            return getErrorStringRequest(e.toString(), "list");
        }
    }


    private String join(String[] params)  {

        if (params == null || params.length != 2) {
            return getErrorStringSyntax("join");
        }
        try {
            String color = params[1].toLowerCase();
            Integer gameNumber = gameNumberMap.get(Integer.parseInt(params[0]));

            if (gameNumber == null) {
                return getJoinGameErrorString(params[0]);
            }

            var req = new JoinGameRequest.RequestBody(color, gameNumber);
            context.serverFacade.joinGame(req, context.authToken);
            context.webSocketFacade = new WebSocketFacade(context.url, context.authToken, gameNumber, context.observer);
            context.webSocketFacade.joinPlayer(color);

            context.observer.changeStateChessGame();
            context.gameColor = color;
            return setStringColor(_color, getJoinGameString(gameNumber, color));
        }
        catch (NumberFormatException e) {
            return getJoinGameErrorString(params[0]);
        }
        catch (ClientException e) {
            return getErrorStringRequest(e.toString(), "join");
        }
    }

    private String spectate(String[] params) {
        if (params == null || params.length != 1) {
            return getErrorStringSyntax("spectate");
        }
        try {
            Integer gameNumber = gameNumberMap.get(Integer.parseInt(params[0]));

            if (gameNumber == null) {
                return getJoinGameErrorString(params[0]);
            }

            var req = new JoinGameRequest.RequestBody(null, gameNumber);
            context.serverFacade.joinGame(req, context.authToken);
            context.webSocketFacade = new WebSocketFacade(context.url, context.authToken, gameNumber, context.observer);
            context.webSocketFacade.joinObserver();

            context.observer.changeStateChessGame();
            context.gameColor = null;
            return setStringColor(_color, getSpecateGameString(gameNumber));
        }
        catch (NumberFormatException e) {
            return getJoinGameErrorString(params[0]);
        }
        catch (ClientException e) {
            return  getErrorStringRequest(e.toString(), "spectate");
        }
    }

}
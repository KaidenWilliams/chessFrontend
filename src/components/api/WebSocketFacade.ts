public class WebSocketFacade extends Endpoint {

    public Session session;
    Integer gameId;
    String authToken;


    public WebSocketFacade(String url, String authToken, Integer gameId, StateNotifier observer) throws ClientException {

        try {
            url = url.replace("http", "ws");
            URI socketURI = new URI(url + "/connect");
            this.authToken = authToken;
            this.gameId = gameId;

            WebSocketContainer container = ContainerProvider.getWebSocketContainer();
            this.session = container.connectToServer(this, socketURI);

            //set message handler
            this.session.addMessageHandler(new MessageHandler.Whole<String>() {
                @Override
                public void onMessage(String message) {
                    ServerMessage serverMessage = new Gson().fromJson(message, ServerMessage.class);

                    var type = serverMessage.getServerMessageType();
                    switch (type) {
                        case LOAD_GAME:
                            LoadGameMessage gameMessage = JsonRegistrar.getChessGameGson().fromJson(message, LoadGameMessage.class);

                            var chessGame = gameMessage.getGame();
                            ChessGameState state = observer.getChessGameState();
                            if (state != null) {
                                state.setGame(chessGame);
                                WebSocketPrinter.printGame(state.drawBoard(state.getGame().getBoard().getSquares()));
                            } else {
                                WebSocketPrinter.printError("Error: Invalid LoadGame Message sent. User is not in ChessGame State");
                            }
                            break;
                        case ERROR:
                            ErrorMessage errorMessage = new Gson().fromJson(message, ErrorMessage.class);
                            WebSocketPrinter.printError(errorMessage.getErrorMessage());
                            break;
                        case NOTIFICATION:
                            NotificationMessage notificationMessage = new Gson().fromJson(message, NotificationMessage.class);
                            WebSocketPrinter.printNotification(notificationMessage.getMessage());
                            break;
                        default:
                            WebSocketPrinter.printError("Error: Unknown Server Message Type encountered");
                            break;
                    }
                }
            });

        } catch (Exception ex) {
            throw new ClientException(ex.getMessage(), 500);
        }
    }


    @Override
    public void onOpen(Session session, EndpointConfig endpointConfig) {
    }


    public void joinPlayer(String playerColor) throws ClientException {
        try {
            ChessGame.TeamColor realColor = (playerColor.equals("white") ? ChessGame.TeamColor.WHITE : ChessGame.TeamColor.BLACK);
            var action = new JoinPlayerCommand(authToken, gameId, realColor);
            sendMessage(action);
        } catch (IOException ex) {
            throw new ClientException(ex.getMessage(), 500);
        }
    }


    public void joinObserver() throws ClientException {
        try {
            var action = new JoinObserverCommand(authToken, gameId);
            sendMessage(action);
        } catch (IOException ex) {
            throw new ClientException(ex.getMessage(), 500);
        }
    }


    public void makeMove(ChessMove move) throws ClientException {
        try {
            var action = new MakeMoveCommand(authToken, gameId, move);
            this.session.getBasicRemote().sendText(JsonRegistrar.getChessGameGson().toJson(action));
        } catch (IOException ex) {
            throw new ClientException(ex.getMessage(), 500);
        }
    }

    public void leave() throws ClientException {
        try {
            var action = new LeaveCommand(authToken, gameId);
            sendMessage(action);
        } catch (IOException ex) {
            throw new ClientException(ex.getMessage(), 500);
        }
    }

    public void resign() throws ClientException {
        try {
            var action = new ResignCommand(authToken, gameId);
            sendMessage(action);
        } catch (IOException ex) {
            throw new ClientException(ex.getMessage(), 500);
        }
    }

    private void sendMessage(UserGameCommand action) throws IOException {
        this.session.getBasicRemote().sendText(new Gson().toJson(action));
    }

}
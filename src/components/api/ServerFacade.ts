interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

interface RegisterResponse {
  username: string;
  authToken: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  username: string;
  authToken: string;
}

interface CreateGameRequest {
  gameName: string;
}

interface CreateGameResponse {
  gameID: string;
}

interface JoinGameRequest {
  gameID: string;
  playerColor?: "WHITE" | "BLACK";
}

interface Game {
  gameID: string;
  whiteUsername?: string;
  blackUsername?: string;
  gameName: string;
}

interface ListGamesResponse {
  games: Game[];
}

interface ExceptionResponse {
  message: string;
}

class ClientException extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "ClientException";
  }
}

export class ServerFacade {
  private static readonly serverUrl: string = process.env.SERVER_URL || "";

  static async registerUser(req: RegisterRequest): Promise<RegisterResponse> {
    const path = "/user";
    return await this.makeRequest<RegisterRequest, RegisterResponse>(
      "POST",
      path,
      req
    );
  }

  static async loginUser(req: LoginRequest): Promise<LoginResponse> {
    const path = "/session";
    return await this.makeRequest<LoginRequest, LoginResponse>(
      "POST",
      path,
      req
    );
  }

  static async logoutUser(authorization: string): Promise<void> {
    const path = "/session";
    return await this.makeRequest<null, void>(
      "DELETE",
      path,
      null,
      authorization
    );
  }

  static async listGames(authorization: string): Promise<ListGamesResponse> {
    const path = "/game";
    return await this.makeRequest<null, ListGamesResponse>(
      "GET",
      path,
      null,
      authorization
    );
  }

  static async createGame(
    req: CreateGameRequest,
    authorization: string
  ): Promise<CreateGameResponse> {
    const path = "/game";
    return await this.makeRequest<CreateGameRequest, CreateGameResponse>(
      "POST",
      path,
      req,
      authorization
    );
  }

  static async joinGame(
    req: JoinGameRequest,
    authorization: string
  ): Promise<void> {
    const path = "/game";
    return await this.makeRequest<JoinGameRequest, void>(
      "PUT",
      path,
      req,
      authorization
    );
  }

  private static async makeRequest<TRequest, TResponse>(
    method: string,
    path: string,
    request: TRequest | null,
    authorization?: string
  ): Promise<TResponse> {
    try {
      const url = new URL(path, this.serverUrl);
      const headers: HeadersInit = {
        ...(request && { "Content-Type": "application/json" }),
        ...(authorization && { Authorization: authorization }),
      };

      const response = await fetch(url.toString(), {
        method,
        headers,
        body: request ? JSON.stringify(request) : undefined,
      });

      if (response.ok) {
        return await this.handleSuccess<TResponse>(response);
      } else {
        return await this.handleFailure(response);
      }
    } catch (error) {
      if (error instanceof ClientException) {
        throw error;
      }
      throw new ClientException(
        error instanceof Error ? error.message : "Unknown error",
        500
      );
    }
  }

  private static async handleSuccess<TResponse>(
    response: Response
  ): Promise<TResponse> {
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 0) {
      return (await response.json()) as TResponse;
    }
    return {} as TResponse;
  }

  private static async handleFailure(response: Response): Promise<never> {
    let errorResponse: ExceptionResponse;
    try {
      errorResponse = await response.json();
      throw new ClientException(errorResponse.message, response.status);
    } catch (e) {
      if (e instanceof ClientException) {
        throw e;
      }
      throw new ClientException(
        "Failed to parse error response",
        response.status
      );
    }
  }
}

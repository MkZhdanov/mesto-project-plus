class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string = "Доступ запрещен. Необходима авторизация") {
    super(message);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;

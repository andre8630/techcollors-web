export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um erro interno nao esperado", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com suporte";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Serviço não disponivel", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verifique se o serviço esta disponivel";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Um erro de validaçao ocorreu", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Ajuste os dados enviados e tente novamente";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Não foi possivel encontrar este usuario", {
      cause,
    });
    this.name = "NotFoundError";
    this.action = action || "Tente usar outro username";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Dados invalidos", {
      cause,
    });
    this.name = "UnauthorizedError";
    this.action = action || "Verifique os dados e tente novamente";
    this.statusCode = 401;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ForbiddenError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Dados invalidos", {
      cause,
    });
    this.name = "ForbiddenError";
    this.action = action || "Verifique os dados e tente novamente";
    this.statusCode = 403;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Metodo nao permitido nesse endpoint");
    this.name = "MethodNotAllowedError";
    this.action = "Use o metodo GET";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

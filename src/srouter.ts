import { Router, Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown> | unknown;

/**
 * wrapAsync gère la promesse et les erreurs pour chaque route,
 * et envoie automatiquement la réponse en JSON ou en 204.
 */
function wrapAsync(fn: AsyncHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Exécute la fonction de la route
      const result = await fn(req, res, next);

      // Si la route n'a pas déjà envoyé la réponse...
      if (!res.headersSent) {
        if (result !== undefined) {
          // ...et qu'il y a un résultat, on l'envoie en JSON
          res.json(result);
        } else {
          // ...sinon on renvoie un 204
          res.status(204).send();
        }
      }
    } catch (err) {
      next(err);
    }
  };
}

export default class SRouter {
  private router = Router({ mergeParams: true });

  post(path: string, handler: AsyncHandler, ...middlewares:RequestHandler[]) {
    this.router.post(path, ...middlewares, wrapAsync(handler));
  }


  get(path: string, handler: AsyncHandler, ...middlewares:RequestHandler[]) {
    this.router.get(path, ...middlewares, wrapAsync(handler));
  }

  put(path: string, handler: AsyncHandler, ...middlewares:RequestHandler[]) {
    this.router.put(path, ...middlewares, wrapAsync(handler));
  }

  delete(path: string, handler: AsyncHandler, ...middlewares:RequestHandler[]) {
    this.router.delete(path, ...middlewares, wrapAsync(handler));
  }

  getRouter() {
    return this.router;
  }
}

import { Router, Request, Response, NextFunction } from 'express';

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

export class SRouter {
  private router = Router({ mergeParams: true });

  post(path: string, handler: AsyncHandler) {
    this.router.post(path, wrapAsync(handler));
  }

  get(path: string, handler: AsyncHandler) {
    this.router.get(path, wrapAsync(handler));
  }

  put(path: string, handler: AsyncHandler) {
    this.router.put(path, wrapAsync(handler));
  }

  delete(path: string, handler: AsyncHandler) {
    this.router.delete(path, wrapAsync(handler));
  }

  getRouter() {
    return this.router;
  }
}

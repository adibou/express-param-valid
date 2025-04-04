import ArgError from './arg-error';
import ValidBase from './valid-base';
export { default as paramValidMiddleware } from './valid-middleware';
export { default as ArgError } from './arg-error';
export { default as SRouter } from './srouter';
export { default as ValidBase } from './valid-base';



export function body(req:any, name:string) {
    if (req.body === undefined) {  throw new ArgError('body', 'undefined reçu, objet attendu' ); }
    if (req.body === null) { throw new ArgError('body', 'null reçu, object attendu'); }
    if (Array.isArray(req.body)) { throw new ArgError('body', 'Array reçu, object attendu');  }
    return validArgument(req.body, name, 'body');
}

export function params(req:any, name:string) {
    return validArgument(req.params, name, 'params');
}

function validArgument(obj:Record<string, unknown>, name:string, paramType:'body' | 'params') {
    return new ValidBase(obj[name], name, paramType);
}


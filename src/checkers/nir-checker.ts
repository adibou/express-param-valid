export default function nirChecker(raw:string) {
    // on sépare corps et clé
    const key = parseInt(raw.slice(-2), 10);
    let body = raw.slice(0, -2);

    // pour Corse : on remplace 2A→19 et 2B→18 (simplification
    // de l'algorithme officiel qui gère A/B)
    body = body.replace(/^(.{5})2A/, '$119')
               .replace(/^(.{5})2B/, '$118');

    // on calcule body % 97 par blocs pour éviter les très grands nombres
    let rem = 0;
    for (let i = 0; i < body.length; i += 7) {
      const block = String(rem) + body.substr(i, 7);
      rem = parseInt(block, 10) % 97;
    }

    // clé attendue = complément à 97 du reste (si reste=0 → clé=97)
    const expected = rem === 0 ? 97 : 97 - rem;
    return expected === key;
}
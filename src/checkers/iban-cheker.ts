export default function ibanChecker(iban:string) {
    // déplace les 4 premiers caractères à la fin
    const rearr = iban.slice(4) + iban.slice(0, 4);
    // remplace lettres par valeurs numériques (A=10, B=11, …)
    const expanded = rearr.split('').map(ch => {
        const code = ch.charCodeAt(0);
        return (code >= 65 && code <= 90) ? (code - 55).toString() : ch;
    }).join('');

    // calcule le reste de la division mod 97
    let remainder = '';
    for (let i = 0; i < expanded.length; i += 7) {
        const block = remainder + expanded.substr(i, 7);
        remainder = String(parseInt(block, 10) % 97);
    }
    return parseInt(remainder, 10) === 1;
}

export default function luhnChecker(str:string): boolean {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        let digit = parseInt(str[str.length - 1 - i], 10);
        if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) { digit -= 9; }
        }
        sum += digit;
    }
    return sum % 10 === 0;
}

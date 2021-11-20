

const persianNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
const latinNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

String.prototype.replaceAllTxt = function replaceAll(search, replace) { return this.split(search).join(replace); }


function latinToPersian(string, addComma = true) {

    if ((string === null) || (string === ''))
        return string

    let result = String(string);
    if (addComma) {
        result = String((+result).toLocaleString())
    }

    for (let index = 0; index < 10; index++) {
        result = result.replaceAllTxt(latinNumbers[index], persianNumbers[index]);
    }
    // console.log({ result, string })

    return result;
}

function PersianToLatin(string) {

    let result = string;

    for (let index = 0; index < 10; index++) {
        result = String(result).replaceAllTxt(persianNumbers[index], latinNumbers[index]);
    }

    return result;
}

export { latinToPersian, PersianToLatin }
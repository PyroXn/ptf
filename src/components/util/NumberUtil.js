function round(num, decimal = 2) {
    return parseFloat(num.toFixed(decimal));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export { round, getRandomInt };
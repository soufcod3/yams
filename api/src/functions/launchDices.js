async function launchDices() {
    const array = [];
    
    // Generate the first pair of numbers
    const firstPair = Math.floor(Math.random() * 6) + 1;
    array.push(firstPair, firstPair);
    
    // Generate the second pair of numbers
    let secondPair = Math.floor(Math.random() * 6) + 1;
    // Ensure the second pair is different from the first
    while (secondPair === firstPair) {
        secondPair = Math.floor(Math.random() * 6) + 1;
    }
    array.push(secondPair, secondPair);
    
    // Generate the fifth digit
    let fifthDigit = Math.floor(Math.random() * 6) + 1;
    // Ensure the fifth digit is different from the pairs
    while (fifthDigit === firstPair || fifthDigit === secondPair) {
        fifthDigit = Math.floor(Math.random() * 6) + 1;
    }
    array.push(fifthDigit);
    
    return array;
}

module.exports = { launchDices }
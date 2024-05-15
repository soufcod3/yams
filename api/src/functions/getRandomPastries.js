const Pastry = require("../models/Pastry");

async function getRandomPastries(numbers) {
    const counts = {};
    numbers.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
    });

    const pairCounts = Object.values(counts).filter(count => count === 2).length;
    const quadrupleCounts = Object.values(counts).filter(count => count === 4).length;
    const quintupleCounts = Object.values(counts).filter(count => count === 5).length;

    let pastriesCount = 0;
    if (quintupleCounts === 1) {
        pastriesCount = 3; // YAM'S
    } else if (quadrupleCounts === 1) {
        pastriesCount = 2; // CARRÉ
    } else if (pairCounts === 2) {
        pastriesCount = 1; // DOUBLE
    } else {
        pastriesCount = 0; // No special combination
    }

    const randomPastries = []
    if (pastriesCount > 0) {
        while (pastriesCount) {
            pastriesCount--;
            const availablePastries = await Pastry.find({stock: { $gt: 0 }})

            if (availablePastries) {
                const randomIndex = Math.floor(Math.random() * availablePastries.length);

            
                // Selecting a random pastry
                const randomPastry = availablePastries[randomIndex]

                if (randomPastry) {
                    randomPastries.push(randomPastry)
                
                    // Updating the pastry's properties stock and quantityWon
                    randomPastry.stock = randomPastry.stock - 1
                    // randomPastry.quantityWon = randomPastry.quantityWon + 1
                    randomPastry.save().then(() => console.log("Pastry updated"));
                }
            } else {
                console.log('No available pastries')
            }
            
        }
    }

    return randomPastries
}

module.exports = { getRandomPastries } 
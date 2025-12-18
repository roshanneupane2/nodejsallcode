const inventory = [];

function addItem(name, quantity, price) {
    const item = {
        name: name,
        quantity: quantity,
        price: price
    };
    inventory.push(item);
    console.log(`Inventory Update: Added ${name}`);
}

function updateStock(name, amount) {
    const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (item) {
        item.quantity += amount;
        console.log(`Stock Change: ${name} is now at ${item.quantity}`);
    } else {
        console.log(`Error: ${name} not found in system.`);
    }
}

function processSale(name, quantitySold) {
    const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (item && item.quantity >= quantitySold) {
        item.quantity -= quantitySold;
        const total = quantitySold * item.price;
        console.log(`Sale Successful: ${quantitySold} ${name}(s) sold for $${total.toFixed(2)}`);
    } else {
        console.log(`Sale Failed: Not enough ${name} in stock.`);
    }
}

function runAudit() {
    console.log("\n--- STORE AUDIT REPORT ---");
    let totalValue = 0;
    
    inventory.forEach(item => {
        const itemValue = item.quantity * item.price;
        totalValue += itemValue;
        
        let status = "OK";
        if (item.quantity === 0) status = "OUT OF STOCK";
        else if (item.quantity < 5) status = "LOW STOCK";

        console.log(`Item: ${item.name.padEnd(10)} | Stock: ${item.quantity.toString().padEnd(3)} | Value: $${itemValue.toFixed(2).padEnd(8)} | Status: ${status}`);
    });

    console.log(`\nTotal Warehouse Value: $${totalValue.toFixed(2)}`);
    console.log("--------------------------\n");
}

addItem("Laptop", 10, 899.99);
addItem("Mouse", 50, 25.00);
addItem("Keyboard", 3, 45.00);
addItem("Monitor", 8, 199.00);

processSale("Laptop", 2);
processSale("Keyboard", 1);
updateStock("Monitor", 5);
processSale("Mouse", 55); 

runAudit();

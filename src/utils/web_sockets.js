
let currentWebSocket;

let watchlistSockets;

// =====================
// realtime trade socket
// =====================

export function setCurrentPriceWebSocket(stockName) {
    // if current websocket is the one being asked for, do nothing
    if (currentWebSocket && currentWebSocket === stockName) {
        return;
    } else {
        // remove the current web socket
        removePriceWebSocket(currentWebSocket);
        // set the new web socket
        currentWebSocket = stockName;
        console.log(`Tracking current price for ${stockName}`);
        // create web socket
        window.currentPriceSocket.send(JSON.stringify({'type':'subscribe', 'symbol': stockName}));
    }
    
};

export function removePriceWebSocket(stockName) {
    console.log(`Removing price tracking for ${stockName}`);
    window.currentPriceSocket.send(JSON.stringify({'type':'unsubscribe', 'symbol': stockName}));
};

export default {
    setCurrentPriceWebSocket,
    removePriceWebSocket
};
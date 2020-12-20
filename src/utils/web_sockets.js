
let currentWebSocket;

let watchlistSockets;

// =====================
// realtime trade socket
// =====================

export function setCurrentPriceWebSocket(stockName) {
    console.log(`Tracking current price for ${stockName}`);
    // set current web socket, for removing later
    currentWebSocket = stockName;
    // create web socket
    window.currentPriceSocket.send(JSON.stringify({'type':'subscribe', 'symbol': stockName}));
};

export function removePriceWebSocket(stockName) {
    console.log(`Removing price tracking for ${stockName}`);
    
    // if there is currently a socket in place
    if (currentWebSocket) {
        //  remove
        window.currentPriceSocket.send(JSON.stringify({'type':'unsubscribe', 'symbol': stockName}));
    }
};

export default {
    setCurrentPriceWebSocket,
    removePriceWebSocket
};
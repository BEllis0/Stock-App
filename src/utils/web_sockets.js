
// =====================
// realtime trade socket
// =====================

export function setCurrentPriceWebSocket(stockName) {
    console.log(`Tracking current price for ${stockName}`);
    window.socket.send(JSON.stringify({'type':'subscribe', 'symbol': stockName}));
};

export function removePriceWebSocket(stockName) {
    console.log(`Tracking current price for ${stockName}`);
    window.socket.send(JSON.stringify({'type':'subscribe', 'symbol': stockName}));
};

export default {
    setCurrentPriceWebSocket,
    removePriceWebSocket
};
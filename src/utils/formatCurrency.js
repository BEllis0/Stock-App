export default function formatCurrency(num, country = 'en-US', currency = 'USD') {
    
    var formatter = new Intl.NumberFormat(country, {
    style: 'currency',
    currency: currency,
    });
  
    return formatter.format(num);
}
const pad = num => num.toString().padStart(2, '0');
const formatDate = (date, dateDiveder = '-') => [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join(dateDiveder) + ' ' + [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(":");

async function getVisitorIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return 'Unknown IP';
    }
}

async function persistVisits() {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const response = await fetch('https://bluegill-cute-leopard.ngrok-free.app/save-visits.php', {
    method: 'POST',
    body: JSON.stringify(localStorage.getItem(VISITS_KEY)),
    headers
  });
  if (response.ok === true && response.status === 200) {
    localStorage.setItem(VISITS_KEY, JSON.stringify([]));
  }
}

async function trackVisitor() {
    const ip = await getVisitorIP();
    const time = formatDate(new Date());
    let visits = JSON.parse(localStorage.getItem(VISITS_KEY)) || [];
    visits.push({ip, time, app});
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
    persistVisits();
}

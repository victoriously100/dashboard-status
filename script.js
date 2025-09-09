  // Websites to check if running
const services = [
    { name: "Barclays Bank", url: "https://www.barclays.co.uk" },
    { name: "HSBC Bank", url: "https://www.hsbc.co.uk" },
    { name: "Halifax Bank", url: "https://www.halifax.co.uk" },
    { name: "NatWest Bank", url: "https://www.natwest.com" },
    { name: "Santander UK", url: "https://www.santander.co.uk" },
    { name: "Metro Bank", url: "https://www.metrobankonline.co.uk" }
];

const statusContainer = document.getElementById('status-container');
const apiContent = document.getElementById('api-content');

   //fetch and display weather based on location
async function fetchLocationAndWeather() {
    const weatherCard = document.getElementById('weather-card');
    weatherCard.innerHTML = `<h3>Local Weather</h3><p>Fetching...</p>`;

    try {
        // First Get location from IP address
        const geoResponse = await fetch('http://ip-api.com/json');
        const geoData = await geoResponse.json();

        if (geoData.status !== 'success') {
            throw new Error('Failed to get location.');
        }

        const city = geoData.city;

        // Then Fetch weather for that city
        const weatherResponse = await fetch(`https://wttr.in/${city}?0?q?T`);
        const weatherData = await weatherResponse.text();

        weatherCard.innerHTML = `
            <h3>Weather in ${city}</h3>
            <pre>${weatherData}</pre>
        `;
    } catch (error) {
        weatherCard.innerHTML = `
            <h3>Local Weather</h3>
            <p>Error: Could not fetch weather.</p>
        `;
        console.error("Failed to fetch location or weather:", error);
    }
}

  // Websites check and display
async function checkServiceStatus() {
    statusContainer.innerHTML = '';
    
    for (const service of services) {
        const card = document.createElement('div');
        card.className = 'service-card';
        
        const serviceName = document.createElement('span');
        serviceName.textContent = service.name;
        
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'status-indicator';
        
        try {
            const response = await fetch(service.url, { mode: 'no-cors' });
            if (response.status === 200 || response.type === 'opaque') {
                statusIndicator.classList.add('operational');
            } else {
                statusIndicator.classList.add('outage');
            }
        } catch (error) {
            statusIndicator.classList.add('outage');
        }
        
        card.appendChild(serviceName);
        card.appendChild(statusIndicator);
        statusContainer.appendChild(card);
    }
}

  //APIs check and display
async function fetchAndDisplayAPIs() {
    // Fetch and display joke
    try {
        const jokeResponse = await fetch('https://official-joke-api.appspot.com/random_joke');
        const jokeData = await jokeResponse.json();
        document.getElementById('joke-card').innerHTML = `
            <h3>Joke of the Day</h3>
            <p>${jokeData.setup}</p>
            <p>... ${jokeData.punchline}</p>
        `;
    } catch (error) {
        console.error("Failed to fetch joke:", error);
    }

    // Fetch and display trivia
    try {
        const triviaResponse = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const triviaData = await triviaResponse.json();
        document.getElementById('trivia-card').innerHTML = `
            <h3>Useless Fact</h3>
            <p>${triviaData.text}</p>
        `;
    } catch (error) {
        console.error("Failed to fetch trivia:", error);
    }

    // Fetch and display placeholder image
    document.getElementById('image-card').innerHTML = `
        <h3>Random Image</h3>
        <img src="https://picsum.photos/200" alt="Random Placeholder Image">
    `;

    // Call the weather function
    fetchLocationAndWeather();
}

// Initial calls and set intervals
checkServiceStatus();
fetchAndDisplayAPIs();
setInterval(checkServiceStatus, 60000); // Check sites refresh every 1 min
setInterval(fetchAndDisplayAPIs, 3600000); // Refresh API content every hour
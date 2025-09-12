// --- Services to Monitor ---
// An array of objects, where each object represents a service to be monitored
// 'id' is a unique identifier for each service, used to target its HTML element
// 'name' is the display name shown on the dashboard
// 'url' is the endpoint used to perform the health check
const services = [
    { id: "barclays", name: "Barclays Bank", url: "https://www.barclays.co.uk" },
    { id: "hsbc", name: "HSBC Bank", url: "https://www.hsbc.co.uk" },
    { id: "halifax", name: "Halifax Bank", url: "https://www.halifax.co.uk" },
    { id: "natwest", name: "NatWest Bank", url: "https://www.natwest.com" },
    { id: "santander", name: "Santander UK", url: "https://www.santander.co.uk" },
    { id: "metrobank", name: "Metro Bank", url: "https://www.metrobankonline.co.uk" }
];

const statusContainer = document.getElementById('status-container');
const apiContent = document.getElementById('api-content');

// --- Service Status Check Function ---
// This asynchronous function iterates through the services and checks their status
// It uses a try-catch block to handle network errors gracefully
// The 'no-cors' mode is used for websites that don't allow cross-origin requests
async function checkServiceStatus() {
    for (const service of services) {
        try {
            const response = await fetch(service.url, { mode: 'no-cors' });
            // Checks if the response type is 'opaque', indicating a successful cross-origin request
            updateServiceCard(service, response.type === 'opaque');
        } catch (error) {
            // Catches any network errors and sets the status to 'outage'
            updateServiceCard(service, false);
        }
    }
}

// --- API Content Fetching Function ---
// This function fetches data from various APIs to populate the content cards
// Each API call is wrapped in a try-catch block to prevent a single failure from breaking the others
async function fetchAndDisplayAPIs() {
    // --- Joke API ---
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

    // --- Trivia API ---
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

    // --- Placeholder Image API ---
    document.getElementById('image-card').innerHTML = `
        <h3>Random Image</h3>
        <img src="https://picsum.photos/200" alt="Random Placeholder Image">
    `;
}

// --- Card Update Utility Function ---
// This function updates an existing service card or creates a new one if it doesn't exist
// This approach prevents the 'blinking' effect by not clearing the entire container on each refresh
function updateServiceCard(service, isOperational) {
    let card = document.getElementById(`service-${service.id}`);
    
    if (!card) {
        // Create the card with its unique ID and structure
        card = document.createElement('div');
        card.id = `service-${service.id}`;
        card.className = 'service-card';
        card.innerHTML = `
            <a href="${service.url}" target="_blank" rel="noopener noreferrer">
                <span>${service.name}</span>
            </a>
            <div class="status-indicator"></div>
        `;
        statusContainer.appendChild(card);
    }
    
    const statusIndicator = card.querySelector('.status-indicator');
    
    // Update the indicator's class to change its color
    statusIndicator.classList.remove('operational', 'outage');
    if (isOperational) {
        statusIndicator.classList.add('operational');
    } else {
        statusIndicator.classList.add('outage');
    }
}

// --- Initial Calls and Intervals ---
checkServiceStatus();
fetchAndDisplayAPIs();
setInterval(checkServiceStatus, 60000); // Refreshes status checks every minute
setInterval(fetchAndDisplayAPIs, 3600000); // Refreshes API content every hour
const suggestions = document.getElementById("suggestions");

// Function to fetch country data from the API
async function fetchCountries() {
    const response = await fetch("https://restcountries.com/v3.1/all");
    return await response.json();
}

// Initialize an empty array for country data
let countryData = [];

// Fetch countries when the page loads
fetchCountries().then(data => {
    countryData = data.map(country => ({
        name: country.name.common,
        capital: country.capital ? country.capital[0] : "N/A",
        population: country.population.toString(),
        region: country.region,
        subregion: country.subregion,
        flag: country.flags.png,
        fact: `Did you know? ${country.name.common} has a population of ${country.population.toLocaleString()}!`
    }));
    
    // Set Germany as the default country
    const defaultCountry = countryData.find(country => country.name === "Germany");
    if (defaultCountry) {
        showCountryInfo(defaultCountry); // Show Germany's info on load
    }
});

// Event listener for search input
document.getElementById("searchInput").addEventListener("input", function() {
    const query = this.value.toLowerCase();
    suggestions.innerHTML = ""; // Clear previous suggestions

    if (query) {
        const filteredCountries = countryData.filter(country => country.name.toLowerCase().includes(query));
        filteredCountries.forEach(country => {
            const item = document.createElement("div");
            item.className = "dropdown-item";
            item.textContent = country.name;
            item.onclick = function() {
                showCountryInfo(country);
                suggestions.style.display = "none"; // Hide suggestions after selection
            };
            suggestions.appendChild(item);
        });
        
        if (filteredCountries.length > 0) {
            suggestions.style.display = "block"; // Show suggestions
        } else {
            suggestions.style.display = "none"; // Hide if no matches
        }
    } else {
        suggestions.style.display = "none"; // Hide if input is empty
    }
});

// Function to show country info
function showCountryInfo(country) {
    document.getElementById("countryName").textContent = `Country: ${country.name}`;
    document.getElementById("countryCapital").textContent = `Capital: ${country.capital}`;
    document.getElementById("countryRegion").textContent = `Region: ${country.region}`;
    document.getElementById("countrySubregion").textContent = `Subregion: ${country.subregion}`;
    document.getElementById("countryFlag").src = country.flag;

    // Speak the fact about the country
    speakFact(country.fact);

    // Show the reward message
    showReward();
}

// Function to display text word by word
function speakFact(fact) {
    const speechElement = document.getElementById("natalia-speech");
    speechElement.innerHTML = ""; // Clear previous speech
    const words = fact.split(" "); // Split into words

    let currentIndex = 0;

    const interval = setInterval(() => {
        if (currentIndex < words.length) {
            speechElement.innerHTML += words[currentIndex] + " "; // Append the next word
            currentIndex++;
        } else {
            clearInterval(interval); // Clear interval when done
            responsiveVoice.speak(fact, "UK English Female"); // Make Natalia speak the full fact
        }
    }, 100); // Adjust speed of word display here
}

// Hide dropdown when clicking outside
document.addEventListener("click", function(event) {
    if (!event.target.closest("#searchInput") && !event.target.closest("#suggestions")) {
        suggestions.style.display = "none"; // Hide suggestions if clicking outside
    }
});

// Function to display a reward message
function showReward() {
    const rewardMessage = document.getElementById("rewardMessage");
    rewardMessage.style.display = "block"; // Show the reward message
    setTimeout(() => {
        rewardMessage.style.display = "none"; // Hide after 3 seconds
    }, 3000);
}

// Add fun fact functionality
document.getElementById("playButton").addEventListener("click", function() {
    const countryName = document.getElementById("countryName").textContent.split(": ")[1];
    const country = countryData.find(c => c.name === countryName);
    if (country) {
        // Just call the speakFact function, no alert
        speakFact(country.fact);
    }
});

// Initialize map
const map = L.map('map').setView([20, 0], 2); // Center the map

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);


let travelData = {};

// Load JSON
fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        travelData = data;
    })
    .catch(error => console.error('Error loading travel data:', error));

function search() {
    const input = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!input) {
        resultsDiv.innerHTML = "<p>Please enter a keyword.</p>";
        return;
    }

    let matched = false;

    // Beaches
    if (input.includes("beach") || input.includes("beaches")) {
        matched = true;
        travelData.beaches.forEach(beach => {
            resultsDiv.innerHTML += formatCard(beach.name, beach.imageUrl, beach.description);
        });
    }

    // Temples
    if (input.includes("temple") || input.includes("temples")) {
        matched = true;
        travelData.temples.forEach(temple => {
            resultsDiv.innerHTML += formatCard(temple.name, temple.imageUrl, temple.description);
        });
    }

    // Countries
    travelData.countries.forEach(country => {
        if (input.includes(country.name.toLowerCase())) {
            matched = true;

            country.cities.forEach(city => {
                const timezone = getTimeZoneForCity(city.name);
                const time = getCurrentTime(timezone);

                resultsDiv.innerHTML += formatCardWithTime(city.name, city.imageUrl, city.description, time);
            });
        }
    });

    if (!matched) {
        resultsDiv.innerHTML = `<p>No matches found for "<strong>${input}</strong>".</p>`;
    }
}

// Clear button
function clearResults() {
    document.getElementById("searchInput").value = "";
    document.getElementById("results").innerHTML = "";
}

// Card formatter without time
function formatCard(name, imgUrl, desc) {
    return `
    <div style="background-color: rgba(0,0,0,0.7); margin: 15px 0; padding: 15px; border-radius: 8px;">
        <h2>${name}</h2>
        <img src="${imgUrl}" alt="${name}" style="width:100%; max-width:500px; border-radius:8px; margin:10px 0;">
        <p>${desc}</p>
    </div>`;
}

// Card formatter with local time
function formatCardWithTime(name, imgUrl, desc, time) {
    return `
    <div style="background-color: rgba(0,0,0,0.7); margin: 15px 0; padding: 15px; border-radius: 8px;">
        <h2>${name}</h2>
        <img src="${imgUrl}" alt="${name}" style="width:100%; max-width:500px; border-radius:8px; margin:10px 0;">
        <p>${desc}</p>
        <p><strong>Current Local Time:</strong> ${time}</p>
    </div>`;
}

// Get current time for a timezone
function getCurrentTime(timeZone) {
    try {
        return new Intl.DateTimeFormat('en-US', {
            timeZone,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }).format(new Date());
    } catch (err) {
        return "Timezone unavailable";
    }
}

// Timezone mapping for city names
function getTimeZoneForCity(cityName) {
    const lower = cityName.toLowerCase();
    if (lower.includes("sydney")) return "Australia/Sydney";
    if (lower.includes("melbourne")) return "Australia/Melbourne";
    if (lower.includes("tokyo")) return "Asia/Tokyo";
    if (lower.includes("kyoto")) return "Asia/Tokyo"; // Kyoto shares Tokyo's timezone
    if (lower.includes("rio")) return "America/Sao_Paulo";
    if (lower.includes("paulo")) return "America/Sao_Paulo";
    return "UTC"; // fallback
}

function Searchfocus(){
    document.getElementById("searchInput").focus();
}

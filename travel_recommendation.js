// travel_recommendation.js

// Global variable to hold fetched data
let travelData = null; 

// ----------------------------------------------------------------------
// TASK 6: DATA FETCHING
// ----------------------------------------------------------------------

/**
 * Task 6: Fetches data from travel_recommendation_api.json.
 */
function fetchRecommendations() {
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); 
        })
        .then(data => {
            console.log("Data successfully fetched:", data);
            travelData = data; // Store data globally
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Could not load travel data. Please check the JSON file path and run the page from a local server (or Live Server in VS Code).");
        });
}

// ----------------------------------------------------------------------
// TASK 7: KEYWORD SEARCHES
// ----------------------------------------------------------------------

/**
 * Task 7: Normalizes the input keyword and identifies the category for search.
 * @param {string} input - The raw keyword entered by the user.
 * @returns {string|null} - The recognized category ('beaches', 'temples', 'countries') or null.
 */
function getSearchCategory(input) {
    // Task 7: Convert input to lowercase for case-insensitive matching
    const keyword = input.toLowerCase().trim();

    // Check for "beach" or "beaches" variations
    if (keyword.includes('beach')) {
        return 'beaches';
    }

    // Check for "temple" or "temples" variations
    if (keyword.includes('temple')) {
        return 'temples';
    }

    // If it's not a beach or temple keyword, treat it as a country search.
    if (keyword) {
        return 'countries'; 
    }
    
    return null; // Empty input
}

/**
 * Task 7: Handles the search button click event.
 */
function handleSearch() {
    const inputElement = document.getElementById('keyword-input');
    const searchTerm = inputElement.value;
    
    if (!searchTerm) {
        alert("Please enter a keyword to search.");
        return;
    }

    if (!travelData) {
        alert("Travel data is still loading. Please try again in a moment.");
        return;
    }

    const category = getSearchCategory(searchTerm);

    if (category) {
        console.log(`Searching for category: ${category} with term: ${searchTerm}`);
        displayRecommendations(category, searchTerm); 
    } else {
        alert("Please search for 'beach', 'temple', or a country name (e.g., 'Japan').");
    }
}

// ----------------------------------------------------------------------
// TASK 8: RECOMMENDATIONS DISPLAY
// ----------------------------------------------------------------------

/**
 * Task 8: Generates the HTML for a single recommendation item.
 */
function createResultCardHTML(item, name) {
    // Optional: Add a placeholder for time (Task 10) if timeZone is available
    // timeZone is currently only available for country cities in the sample JSON.
    const timeDisplay = item.timeZone 
        ? `<p class="time-display" data-timezone="${item.timeZone}">Local Time: Loading...</p>` 
        : '';

    return `
        <div class="result-card">
            <img src="${item.imageUrl}" alt="${name}">
            <div class="card-content">
                <h3>${name}</h3>
                <p>${item.description}</p>
                ${timeDisplay}
            </div>
        </div>
    `;
}

/**
 * Task 8: Filters the data and displays the results in the HTML container.
 */
function displayRecommendations(category, searchTerm) {
    const resultsContainer = document.getElementById('recommendation-results');
    let results = [];
    let htmlContent = '<h2>Top Recommendations</h2><div class="recommendation-grid">';
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    if (category === 'beaches' || category === 'temples') {
        // Direct match for global categories
        results = travelData[category];

    } else if (category === 'countries') {
        // Find the matching country
        const countryMatch = travelData.countries.find(country => 
            country.name.toLowerCase() === normalizedSearchTerm
        );

        if (countryMatch) {
            // Display cities within the matched country
            results = countryMatch.cities;
            htmlContent = `<h2>Recommended Cities in ${countryMatch.name}</h2><div class="recommendation-grid">`;
        }
    }

    // 3. Generate HTML and Display
    if (results.length > 0) {
        results.forEach(item => {
            const itemName = item.name || item.cityName; 
            htmlContent += createResultCardHTML(item, itemName);
        });

        htmlContent += '</div>';
        resultsContainer.innerHTML = htmlContent;
        
        // Call the Task 10 logic (currently a placeholder)
        updateTimeDisplays(); 

    } else {
        // If no results found
        resultsContainer.innerHTML = `
            <h2>No results found</h2>
            <p>We couldn't find recommendations for "${searchTerm}". Try 'beach', 'temple', 'Japan', or 'Australia'.</p>
        `;
    }
}

// ----------------------------------------------------------------------
// TASK 9: CLEAR BUTTON
// ----------------------------------------------------------------------

/**
 * Task 9: Clears the search results and input field.
 */
function handleClear() {
    // 1. Clear the input field
    document.getElementById('keyword-input').value = '';
    
    // 2. Clear the recommendation results container
    const resultsContainer = document.getElementById('recommendation-results');
    
    // Reset the inner HTML back to its initial state
    resultsContainer.innerHTML = '<h2>Your Recommendations Will Appear Here</h2>';
    console.log("Search results cleared.");
}

// ----------------------------------------------------------------------
// TASK 10: COUNTRY DATE AND TIME (Placeholder for Optional Task)
// ----------------------------------------------------------------------

/**
 * Task 10: Placeholder function to be implemented for displaying local time.
 */
function updateTimeDisplays() {
    // Select all elements that have the 'data-timezone' attribute
    const timeElements = document.querySelectorAll('.time-display[data-timezone]');
    
    // Define formatting options
    const options = { 
        timeZone: '', // This will be set dynamically
        hour12: true, 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric' 
    };

    timeElements.forEach(element => {
        const timeZone = element.getAttribute('data-timezone');
        
        if (timeZone) {
            // Set the options object's timeZone for the current location
            options.timeZone = timeZone;
            
            try {
                // Get the current time adjusted for the target timezone
                const localTime = new Date().toLocaleTimeString('en-US', options);
                
                // Update the element's text content
                element.textContent = `Local Time in ${timeZone.split('/')[1].replace('_', ' ')}: ${localTime}`;
            } catch (error) {
                // Handle cases where an invalid timezone might be specified
                console.error(`Error calculating time for ${timeZone}:`, error);
                element.textContent = 'Local Time: N/A';
            }
        }
    });

    // We can use setTimeout to update the time every second, 
    // giving it a real-time clock effect, but this is optional for a simple project.
    // setTimeout(updateTimeDisplays, 1000); 
}


// ----------------------------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------------------------

// Event Listeners: Attach functions to buttons after the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Task 7: Search button listener
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    // Task 9: Reset button listener
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleClear); 
    }
});

// Start fetching data immediately
fetchRecommendations();
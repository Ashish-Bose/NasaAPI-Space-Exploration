const dateInput = document.getElementById('date');
const fetchBtn = document.getElementById('fetch-btn');
const spaceInfoDiv = document.getElementById('space-info');

const API_KEY = 'sC9S4S3kCs5cXdxQCWEWhXr529R96XAup1UiT7pb'; 

async function fetchAPOD(date = '') {
    try {
        spaceInfoDiv.innerHTML = '<p>Loading...</p>';
        
        let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
        if (date) url += `&date=${date}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Could not fetch image. Try another date.');
        }
        const data = await response.json();
        
        let mediaHTML = '';
        if (data.media_type === 'image') {
            mediaHTML = `<img src="${data.url}" alt="${data.title}">`;
        } else if (data.media_type === 'video') {
            mediaHTML = `<iframe width="560" height="315" src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            mediaHTML = '<p>No media available for this date.</p>';
        }
        
        spaceInfoDiv.innerHTML = `
            <h2>${data.title}</h2>
            ${mediaHTML}
            <p>${data.explanation}</p>
            <p><strong>Date:</strong> ${data.date}</p>
        `;
    } catch (error) {
        console.error('Fetch error:', error);
        spaceInfoDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Set date input to today and limit to past dates
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;
dateInput.max = today;

// Fetch today's image on load
fetchAPOD();

// Fetch for selected date
fetchBtn.addEventListener('click', () => {
    const selectedDate = dateInput.value;
    if (!selectedDate) {
        spaceInfoDiv.innerHTML = '<p class="error">Please select a date!</p>';
        return;
    }
    fetchAPOD(selectedDate);
});

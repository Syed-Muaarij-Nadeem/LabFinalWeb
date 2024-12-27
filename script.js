const API_URL = 'http://localhost:3000';

// Fetch Attractions
async function fetchAttractions() {
    try {
        const response = await fetch(`${API_URL}/attractions`);
        const attractions = await response.json();
        displayAttractions(attractions);
    } catch (error) {
        console.error('Error fetching attractions:', error);
    }
}

// Display Attractions
function displayAttractions(attractions) {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <ul>
            ${attractions.map(a => `<li>${a.Name} - ${a.location}</li>`).join('')}
        </ul>
    `;
}

// Adding event listeners for delete confirmation
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const confirmDelete = confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) {
            event.preventDefault();
        }
    });
});


// Initialize
fetchAttractions();

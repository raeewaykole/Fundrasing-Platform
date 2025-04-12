// Initialize DataTable and load data when DOM is ready
$(document).ready(function() {
    // Check for token
    checkAuth();

    // Initialize DataTable
    const startupsTable = $('#startupsTable').DataTable({
        responsive: true,
        order: [[0, 'desc']]
    });
    
    // Load real data from API
    loadStartups();
    
    // Add event listener for save button
    $('#saveStartup').on('click', function() {
        saveStartup();
    });
});

// Load startup data from API
async function loadStartups() {
    try {
        const response = await fetch('http://localhost:3000/api/startups', {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to load startups');
        }

        const startups = await response.json();
        const table = $('#startupsTable').DataTable();
        
        // Clear existing table data
        table.clear();
        
        // Add row data using DataTable API
        startups.forEach(startup => {
            table.row.add([
                startup.id,
                startup.name,
                startup.sector,
                new Date(startup.founded_date).toLocaleDateString(),
                startup.description ? startup.description.split(' ').slice(0, 3).join(' ') + '...' : 'N/A',
                '$' + parseFloat(startup.funding_amount || 0).toLocaleString(),
                getStatusBadge(startup.sector ? 'Active' : 'Inactive'),
                `<button class="btn btn-sm btn-primary" onclick="editStartup(${startup.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteStartup(${startup.id})">
                    <i class="fas fa-trash"></i>
                </button>`
            ]).draw(false);
        });
    } catch (error) {
        console.error('Error loading startups:', error);
        alert(error.message || 'Error loading startups. Please try again.');
    }
}

// Save startup
async function saveStartup() {
    try {
        if (!isAuthenticated()) {
            window.location.href = '/login.html';
            return;
        }

        const startup = {
            name: document.getElementById('startupName').value,
            sector: document.getElementById('industry').value,
            description: document.getElementById('startupDescription').value,
            founded_date: document.getElementById('foundedDate').value
        };

        // Validate required fields
        if (!startup.name || !startup.sector) {
            alert('Please fill in all required fields');
            return;
        }

        const startupId = document.getElementById('startupId').value;
        const url = startupId ? `http://localhost:3000/api/startups/${startupId}` : 'http://localhost:3000/api/startups';
        const method = startupId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(startup)
        });

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save startup');
        }

        alert('Startup saved successfully!');
        $('#startupModal').modal('hide');
        loadStartups();
    } catch (error) {
        console.error('Error saving startup:', error);
        alert(error.message || 'Error saving startup. Please try again.');
    }
}

// Edit startup
async function editStartup(id) {
    try {
        if (!isAuthenticated()) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`http://localhost:3000/api/startups/${id}`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch startup details');
        }

        const startup = await response.json();
        
        document.getElementById('startupId').value = startup.id;
        document.getElementById('startupName').value = startup.name;
        document.getElementById('industry').value = startup.sector;
        document.getElementById('startupDescription').value = startup.description || '';
        document.getElementById('foundedDate').value = startup.founded_date ? new Date(startup.founded_date).toISOString().split('T')[0] : '';
        
        $('#startupModal').modal('show');
    } catch (error) {
        console.error('Error fetching startup:', error);
        alert(error.message || 'Error fetching startup details. Please try again.');
    }
}

// Delete startup
async function deleteStartup(id) {
    if (confirm('Are you sure you want to delete this startup?')) {
        try {
            if (!isAuthenticated()) {
                window.location.href = '/login.html';
                return;
            }

            const response = await fetch(`http://localhost:3000/api/startups/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (response.status === 401) {
                window.location.href = '/login.html';
                return;
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete startup');
            }

            alert('Startup deleted successfully!');
            loadStartups();
        } catch (error) {
            console.error('Error deleting startup:', error);
            alert(error.message || 'Error deleting startup. Please try again.');
        }
    }
}

// Helper function to get status badge HTML
function getStatusBadge(status) {
    let badgeClass = '';
    
    switch(status) {
        case 'Active':
            badgeClass = 'bg-success';
            break;
        case 'Inactive':
            badgeClass = 'bg-secondary';
            break;
        case 'Acquired':
            badgeClass = 'bg-primary';
            break;
        case 'Closed':
            badgeClass = 'bg-danger';
            break;
        default:
            badgeClass = 'bg-secondary';
    }
    
    return `<span class="badge ${badgeClass}">${status}</span>`;
} 
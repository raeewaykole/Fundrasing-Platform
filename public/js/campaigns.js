document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();

    // Initialize DataTables with proper column configuration
    $('#campaignsTable').DataTable({
        responsive: true,
        order: [[0, 'desc']]
    });

    // Load campaigns and populate dropdown
    loadCampaigns();
    loadStartupDropdown();

    // Add event listener for the save campaign button
    const saveCampaignBtn = document.getElementById('saveCampaign');
    if (saveCampaignBtn) {
        saveCampaignBtn.addEventListener('click', handleSaveCampaign);
    }
});

// Load startup data for dropdown
async function loadStartupDropdown() {
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
        const startupSelect = document.getElementById("startupSelect");
        
        if(startupSelect) {
            // Clear existing options except the first one
            while (startupSelect.options.length > 1) {
                startupSelect.remove(1);
            }
            
            // Add startups to dropdown
            startups.forEach(startup => {
                const option = document.createElement("option");
                option.value = startup.id;
                option.textContent = startup.name;
                startupSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading startups for dropdown:', error);
    }
}

async function loadCampaigns() {
    try {
        const response = await fetch('http://localhost:3000/api/campaigns', {
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
            throw new Error(error.message || 'Failed to load campaigns');
        }

        const campaigns = await response.json();
        const table = $('#campaignsTable').DataTable();
        
        // Clear existing table data
        table.clear();
        
        // Add row data using DataTable API
        campaigns.forEach(campaign => {
            // Get status based on dates and funding
            let status = 'Planned';
            const startDate = new Date(campaign.start_date);
            const endDate = campaign.end_date ? new Date(campaign.end_date) : null;
            const now = new Date();
            
            if (startDate <= now && (!endDate || endDate >= now)) {
                status = 'Active';
            } else if (endDate && endDate < now) {
                status = 'Completed';
            }
            
            if (campaign.current_amount >= campaign.target_amount) {
                status = 'Completed';
            }
            
            table.row.add([
                campaign.id,
                campaign.name,
                campaign.description ? campaign.description.slice(0, 30) + '...' : 'N/A',
                new Date(campaign.start_date).toLocaleDateString(),
                campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing',
                '$' + parseFloat(campaign.target_amount).toLocaleString(),
                '$' + parseFloat(campaign.current_amount || 0).toLocaleString(),
                getStatusBadge(status),
                `<button class="btn btn-sm btn-primary" onclick="editCampaign(${campaign.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCampaign(${campaign.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="viewCampaignStats(${campaign.id})">
                    <i class="fas fa-chart-bar"></i>
                </button>`
            ]).draw(false);
        });
    } catch (error) {
        console.error('Error loading campaigns:', error);
        alert(error.message || 'Error loading campaigns. Please try again.');
    }
}

async function handleSaveCampaign() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }

    const campaign = {
        name: document.getElementById('campaignName').value,
        description: document.getElementById('campaignDescription').value,
        target_amount: parseFloat(document.getElementById('targetAmount').value),
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value || null
    };

    // Validate required fields
    if (!campaign.name || !campaign.target_amount || !campaign.start_date) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const campaignId = document.getElementById('campaignId').value;
        const url = campaignId ? `http://localhost:3000/api/campaigns/${campaignId}` : 'http://localhost:3000/api/campaigns';
        const method = campaignId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(campaign)
        });

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save campaign');
        }

        const data = await response.json();
        alert('Campaign saved successfully!');
        $('#campaignModal').modal('hide');
        loadCampaigns();
    } catch (error) {
        console.error('Error saving campaign:', error);
        alert(error.message || 'Error saving campaign. Please try again.');
    }
}

async function editCampaign(id) {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/campaigns/${id}`, {
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
            throw new Error(error.message || 'Failed to fetch campaign details');
        }

        const campaign = await response.json();
        document.getElementById('campaignId').value = campaign.id;
        document.getElementById('campaignName').value = campaign.name;
        document.getElementById('campaignDescription').value = campaign.description || '';
        document.getElementById('targetAmount').value = campaign.target_amount;
        document.getElementById('startDate').value = new Date(campaign.start_date).toISOString().split('T')[0];
        document.getElementById('endDate').value = campaign.end_date ? new Date(campaign.end_date).toISOString().split('T')[0] : '';
        
        $('#campaignModal').modal('show');
    } catch (error) {
        console.error('Error fetching campaign:', error);
        alert(error.message || 'Error fetching campaign details. Please try again.');
    }
}

async function deleteCampaign(id) {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }

    if (confirm('Are you sure you want to delete this campaign?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/campaigns/${id}`, {
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
                throw new Error(error.message || 'Failed to delete campaign');
            }

            const data = await response.json();
            alert('Campaign deleted successfully!');
            loadCampaigns();
        } catch (error) {
            console.error('Error deleting campaign:', error);
            alert(error.message || 'Error deleting campaign. Please try again.');
        }
    }
}

async function viewCampaignStats(id) {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/campaigns/${id}/donations`, {
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
            throw new Error(error.message || 'Failed to fetch campaign statistics');
        }

        const donations = await response.json();
        
        // Calculate statistics
        const totalDonations = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
        const donationCount = donations.length;
        
        // Display stats in a modal or chart
        alert(`Total Donations: $${totalDonations.toLocaleString()}\nDonation Count: ${donationCount}`);
    } catch (error) {
        console.error('Error fetching campaign statistics:', error);
        alert(error.message || 'Error fetching campaign statistics. Please try again.');
    }
}

// Helper function to get status badge
function getStatusBadge(status) {
    let badgeClass = "";
    
    switch(status) {
        case "Active":
            badgeClass = "bg-success";
            break;
        case "Completed":
            badgeClass = "bg-primary";
            break;
        case "Planned":
            badgeClass = "bg-warning";
            break;
        case "Cancelled":
            badgeClass = "bg-danger";
            break;
        default:
            badgeClass = "bg-secondary";
    }
    
    return `<span class="badge ${badgeClass}">${status}</span>`;
} 
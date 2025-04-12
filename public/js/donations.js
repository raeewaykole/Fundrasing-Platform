// Initialize DataTable and load data when DOM is ready
$(document).ready(function() {
    // Initialize DataTable
    const donationsTable = $('#donationsTable').DataTable();
    
    // Load mock data
    loadDonations(donationsTable);
    loadDonorsAndCampaigns();
    
    // Add event listener for save button
    $('#saveDonation').on('click', function() {
        saveDonation();
    });
    
    // Set current date for donation date input
    setCurrentDate();
});

// Load mock donation data
function loadDonations(table) {
    // Mock donation data
    const donations = [
        { id: 1, donor: "John Doe", campaign: "Tech Startup Fund", amount: 5000, date: "2023-05-15", payment: "Credit Card", status: "Completed" },
        { id: 2, donor: "Jane Smith", campaign: "Healthcare Initiative", amount: 10000, date: "2023-05-20", payment: "Bank Transfer", status: "Completed" },
        { id: 3, donor: "Robert Johnson", campaign: "Education Project", amount: 2500, date: "2023-05-25", payment: "PayPal", status: "Pending" },
        { id: 4, donor: "Sarah Williams", campaign: "Green Energy", amount: 7500, date: "2023-05-30", payment: "Credit Card", status: "Completed" },
        { id: 5, donor: "Michael Brown", campaign: "AI Research", amount: 15000, date: "2023-06-05", payment: "Bank Transfer", status: "Failed" }
    ];
    
    // Clear existing data
    table.clear();
    
    // Add data to table
    donations.forEach(function(donation) {
        table.row.add([
            donation.id,
            donation.donor,
            donation.campaign,
            "$" + donation.amount.toLocaleString(),
            donation.date,
            donation.payment,
            getStatusBadge(donation.status),
            getActionButtons(donation.id)
        ]).draw(false);
    });
    
    // Add event listeners to buttons
    $('.edit-donation').on('click', function() {
        editDonation($(this).data('id'));
    });
    
    $('.delete-donation').on('click', function() {
        deleteDonation($(this).data('id'));
    });
}

// Load donors and campaigns for select dropdowns
function loadDonorsAndCampaigns() {
    // Mock donor data
    const donors = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Robert Johnson" },
        { id: 4, name: "Sarah Williams" },
        { id: 5, name: "Michael Brown" }
    ];
    
    // Mock campaign data
    const campaigns = [
        { id: 1, name: "Tech Startup Fund" },
        { id: 2, name: "Healthcare Initiative" },
        { id: 3, name: "Education Project" },
        { id: 4, name: "Green Energy" },
        { id: 5, name: "AI Research" }
    ];
    
    // Populate donor select
    const donorSelect = $('#donorSelect');
    donorSelect.empty();
    donorSelect.append('<option value="">Select Donor</option>');
    
    donors.forEach(function(donor) {
        donorSelect.append(`<option value="${donor.id}">${donor.name}</option>`);
    });
    
    // Populate campaign select
    const campaignSelect = $('#campaignSelect');
    campaignSelect.empty();
    campaignSelect.append('<option value="">Select Campaign</option>');
    
    campaigns.forEach(function(campaign) {
        campaignSelect.append(`<option value="${campaign.id}">${campaign.name}</option>`);
    });
}

// Set current date for donation date input
function setCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    
    // Add leading zeros if needed
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    
    const dateString = `${year}-${month}-${day}`;
    $('#donationDate').val(dateString);
}

// Save donation
function saveDonation() {
    // Get form values
    const donorId = $('#donorSelect').val();
    const campaignId = $('#campaignSelect').val();
    const amount = $('#donationAmount').val();
    const date = $('#donationDate').val();
    const paymentMethod = $('#paymentMethod').val();
    const status = $('#donationStatus').val();
    
    // Validate form
    if (!donorId || !campaignId || !amount || !date || !paymentMethod || !status) {
        alert('Please fill in all required fields');
        return;
    }
    
    // For demo purposes, just show success message and close modal
    alert('Donation saved successfully!');
    $('#donationModal').modal('hide');
    
    // Reload table data
    loadDonations($('#donationsTable').DataTable());
}

// Edit donation
function editDonation(id) {
    // For demo purposes, populate form with mock data
    $('#donationModalLabel').text('Edit Donation');
    $('#donorSelect').val(1);
    $('#campaignSelect').val(1);
    $('#donationAmount').val(5000);
    $('#donationDate').val('2023-05-15');
    $('#paymentMethod').val('credit_card');
    $('#donationStatus').val('completed');
    
    // Show modal
    $('#donationModal').modal('show');
}

// Delete donation
function deleteDonation(id) {
    if (confirm('Are you sure you want to delete this donation?')) {
        // For demo purposes, just show success message
        alert('Donation deleted successfully!');
        
        // Reload table data
        loadDonations($('#donationsTable').DataTable());
    }
}

// Helper function to get status badge HTML
function getStatusBadge(status) {
    let badgeClass = '';
    
    switch(status) {
        case 'Completed':
            badgeClass = 'bg-success';
            break;
        case 'Pending':
            badgeClass = 'bg-warning';
            break;
        case 'Failed':
            badgeClass = 'bg-danger';
            break;
        default:
            badgeClass = 'bg-secondary';
    }
    
    return `<span class="badge ${badgeClass}">${status}</span>`;
}

// Helper function to get action buttons HTML
function getActionButtons(id) {
    return `
        <button class="btn btn-sm btn-primary edit-donation" data-id="${id}">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger delete-donation" data-id="${id}">
            <i class="fas fa-trash"></i>
        </button>
    `;
} 
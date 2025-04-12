// Initialize DataTable and load data when DOM is ready
$(document).ready(function() {
    // Initialize DataTable
    const investmentsTable = $('#investmentsTable').DataTable();
    
    // Load mock data
    loadInvestments(investmentsTable);
    loadInvestorsAndStartups();
    
    // Add event listener for save button
    $('#saveInvestment').on('click', function() {
        saveInvestment();
    });
    
    // Set current date for investment date input
    setCurrentDate();
});

// Load mock investment data
function loadInvestments(table) {
    // Mock investment data
    const investments = [
        { id: 1, investor: "Venture Capital A", startup: "Tech Innovators", amount: 500000, date: "2023-03-15", round: "Seed", equity: 10, status: "Completed" },
        { id: 2, investor: "Angel Fund B", startup: "Health Analytics", amount: 2000000, date: "2023-04-20", round: "Series A", equity: 15, status: "Completed" },
        { id: 3, investor: "Investment Group C", startup: "Education Tech", amount: 150000, date: "2023-05-10", round: "Seed", equity: 8, status: "Pending" },
        { id: 4, investor: "Private Equity D", startup: "Green Energy", amount: 5000000, date: "2023-05-25", round: "Series B", equity: 12, status: "Completed" },
        { id: 5, investor: "Growth Fund E", startup: "AI Innovations", amount: 10000000, date: "2023-06-05", round: "Series C", equity: 7, status: "Pending" }
    ];
    
    // Clear existing data
    table.clear();
    
    // Add data to table
    investments.forEach(function(investment) {
        table.row.add([
            investment.id,
            investment.investor,
            investment.startup,
            "$" + investment.amount.toLocaleString(),
            investment.date,
            investment.round,
            investment.equity + "%",
            getStatusBadge(investment.status),
            getActionButtons(investment.id)
        ]).draw(false);
    });
    
    // Add event listeners to buttons
    $('.edit-investment').on('click', function() {
        editInvestment($(this).data('id'));
    });
    
    $('.delete-investment').on('click', function() {
        deleteInvestment($(this).data('id'));
    });
}

// Load investors and startups for select dropdowns
function loadInvestorsAndStartups() {
    // Mock investor data
    const investors = [
        { id: 1, name: "Venture Capital A" },
        { id: 2, name: "Angel Fund B" },
        { id: 3, name: "Investment Group C" },
        { id: 4, name: "Private Equity D" },
        { id: 5, name: "Growth Fund E" }
    ];
    
    // Mock startup data
    const startups = [
        { id: 1, name: "Tech Innovators" },
        { id: 2, name: "Health Analytics" },
        { id: 3, name: "Education Tech" },
        { id: 4, name: "Green Energy" },
        { id: 5, name: "AI Innovations" }
    ];
    
    // Populate investor select
    const investorSelect = $('#investorSelect');
    investorSelect.empty();
    investorSelect.append('<option value="">Select Investor</option>');
    
    investors.forEach(function(investor) {
        investorSelect.append(`<option value="${investor.id}">${investor.name}</option>`);
    });
    
    // Populate startup select
    const startupSelect = $('#startupSelect');
    startupSelect.empty();
    startupSelect.append('<option value="">Select Startup</option>');
    
    startups.forEach(function(startup) {
        startupSelect.append(`<option value="${startup.id}">${startup.name}</option>`);
    });
}

// Set current date for investment date input
function setCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    
    // Add leading zeros if needed
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    
    const dateString = `${year}-${month}-${day}`;
    $('#investmentDate').val(dateString);
}

// Save investment
function saveInvestment() {
    // Get form values
    const investorId = $('#investorSelect').val();
    const startupId = $('#startupSelect').val();
    const amount = $('#investmentAmount').val();
    const date = $('#investmentDate').val();
    const round = $('#investmentRound').val();
    const equity = $('#equityPercentage').val();
    const status = $('#investmentStatus').val();
    
    // Validate form
    if (!investorId || !startupId || !amount || !date || !round || !equity || !status) {
        alert('Please fill in all required fields');
        return;
    }
    
    // For demo purposes, just show success message and close modal
    alert('Investment saved successfully!');
    $('#investmentModal').modal('hide');
    
    // Reload table data
    loadInvestments($('#investmentsTable').DataTable());
}

// Edit investment
function editInvestment(id) {
    // For demo purposes, populate form with mock data
    $('#investmentModalLabel').text('Edit Investment');
    $('#investorSelect').val(1);
    $('#startupSelect').val(1);
    $('#investmentAmount').val(500000);
    $('#investmentDate').val('2023-03-15');
    $('#investmentRound').val('seed');
    $('#equityPercentage').val(10);
    $('#investmentStatus').val('completed');
    
    // Show modal
    $('#investmentModal').modal('show');
}

// Delete investment
function deleteInvestment(id) {
    if (confirm('Are you sure you want to delete this investment?')) {
        // For demo purposes, just show success message
        alert('Investment deleted successfully!');
        
        // Reload table data
        loadInvestments($('#investmentsTable').DataTable());
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
        <button class="btn btn-sm btn-primary edit-investment" data-id="${id}">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger delete-investment" data-id="${id}">
            <i class="fas fa-trash"></i>
        </button>
    `;
} 
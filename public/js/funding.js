// Initialize DataTable and load data when DOM is ready
$(document).ready(function() {
    // Initialize DataTable
    const fundingTable = $('#fundingTable').DataTable();
    
    // Load mock data
    loadFundingRounds(fundingTable);
    
    // Add event listener for save button
    $('#saveFunding').on('click', function() {
        saveFundingRound();
    });
});

// Load mock funding round data
function loadFundingRounds(table) {
    // Mock funding rounds data
    const fundingRounds = [
        { 
            id: 1, 
            startupName: "TechNova", 
            roundType: "Series A", 
            amount: "$5M", 
            date: "2023-03-15",
            leadInvestor: "Sequoia Capital",
            valuation: "$25M",
            participants: 3,
            status: "Closed" 
        },
        { 
            id: 2, 
            startupName: "GreenEnergy", 
            roundType: "Seed", 
            amount: "$800K", 
            date: "2023-01-20",
            leadInvestor: "Y Combinator",
            valuation: "$4M",
            participants: 2,
            status: "Closed" 
        },
        { 
            id: 3, 
            startupName: "HealthAI", 
            roundType: "Series B", 
            amount: "$15M", 
            date: "2023-05-10",
            leadInvestor: "Andreessen Horowitz",
            valuation: "$75M",
            participants: 5,
            status: "Closed" 
        },
        { 
            id: 4, 
            startupName: "DataSphere", 
            roundType: "Series C", 
            amount: "$50M", 
            date: "2023-07-25",
            leadInvestor: "Tiger Global",
            valuation: "$250M",
            participants: 7,
            status: "Closed" 
        },
        { 
            id: 5, 
            startupName: "SpaceX", 
            roundType: "Series H", 
            amount: "$750M", 
            date: "2023-12-10",
            leadInvestor: "SoftBank Vision Fund",
            valuation: "$150B",
            participants: 12,
            status: "Closed" 
        }
    ];
    
    // Clear existing data
    table.clear();
    
    // Add data to table
    fundingRounds.forEach(function(round) {
        table.row.add([
            round.id,
            round.startupName,
            round.roundType,
            round.amount,
            round.date,
            round.leadInvestor,
            round.valuation,
            round.participants,
            getStatusBadge(round.status),
            getActionButtons(round.id)
        ]).draw(false);
    });
    
    // Add event listeners to buttons
    $('.edit-round').on('click', function() {
        editFundingRound($(this).data('id'));
    });
    
    $('.delete-round').on('click', function() {
        deleteFundingRound($(this).data('id'));
    });
}

// Save funding round
function saveFundingRound() {
    // Get form values
    const startupName = $('#startupName').val();
    const roundType = $('#roundType').val();
    const amount = $('#amount').val();
    const date = $('#date').val();
    const leadInvestor = $('#leadInvestor').val();
    const valuation = $('#valuation').val();
    const participants = $('#participants').val();
    const status = $('#roundStatus').val();
    
    // Validate form
    if (!startupName || !roundType || !amount || !date || !leadInvestor || !status) {
        alert('Please fill in all required fields');
        return;
    }
    
    // For demo purposes, just show success message and close modal
    alert('Funding round saved successfully!');
    $('#fundingModal').modal('hide');
    
    // Reload table data
    loadFundingRounds($('#fundingTable').DataTable());
}

// Edit funding round
function editFundingRound(id) {
    // For demo purposes, populate form with mock data
    $('#fundingModalLabel').text('Edit Funding Round');
    $('#startupName').val('TechNova');
    $('#roundType').val('Series A');
    $('#amount').val('$5M');
    $('#date').val('2023-03-15');
    $('#leadInvestor').val('Sequoia Capital');
    $('#valuation').val('$25M');
    $('#participants').val('3');
    $('#roundStatus').val('Closed');
    
    // Show modal
    $('#fundingModal').modal('show');
}

// Delete funding round
function deleteFundingRound(id) {
    if (confirm('Are you sure you want to delete this funding round?')) {
        // For demo purposes, just show success message
        alert('Funding round deleted successfully!');
        
        // Reload table data
        loadFundingRounds($('#fundingTable').DataTable());
    }
}

// Helper function to get status badge HTML
function getStatusBadge(status) {
    let badgeClass = '';
    
    switch(status) {
        case 'Ongoing':
            badgeClass = 'bg-primary';
            break;
        case 'Closed':
            badgeClass = 'bg-success';
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
        <button class="btn btn-sm btn-primary edit-round" data-id="${id}">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger delete-round" data-id="${id}">
            <i class="fas fa-trash"></i>
        </button>
    `;
} 
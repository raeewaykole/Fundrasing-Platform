// Initialize DataTable and load data when DOM is ready
$(document).ready(function() {
    // Initialize DataTable
    const investorsTable = $('#investorsTable').DataTable();
    
    // Load mock data
    loadInvestors(investorsTable);
    
    // Add event listener for save button
    $('#saveInvestor').on('click', function() {
        saveInvestor();
    });
});

// Load mock investor data
function loadInvestors(table) {
    // Mock investors data
    const investors = [
        { 
            id: 1, 
            name: "Sequoia Capital", 
            type: "Venture Capital", 
            founded: 1972, 
            location: "Menlo Park, CA",
            aum: "$85B",
            portfolio: 250,
            sectors: "Technology, Healthcare, Consumer",
            status: "Active" 
        },
        { 
            id: 2, 
            name: "Andreessen Horowitz", 
            type: "Venture Capital", 
            founded: 2009, 
            location: "Menlo Park, CA",
            aum: "$35B",
            portfolio: 175,
            sectors: "Technology, Fintech, Crypto",
            status: "Active" 
        },
        { 
            id: 3, 
            name: "Y Combinator", 
            type: "Accelerator", 
            founded: 2005, 
            location: "Mountain View, CA",
            aum: "$7.5B",
            portfolio: 3000,
            sectors: "Technology, B2B, B2C",
            status: "Active" 
        },
        { 
            id: 4, 
            name: "SoftBank Vision Fund", 
            type: "Investment Fund", 
            founded: 2017, 
            location: "Tokyo, Japan",
            aum: "$100B",
            portfolio: 90,
            sectors: "Technology, AI, Mobility",
            status: "Active" 
        },
        { 
            id: 5, 
            name: "Tiger Global", 
            type: "Hedge Fund", 
            founded: 2001, 
            location: "New York, NY",
            aum: "$95B",
            portfolio: 275,
            sectors: "Technology, E-commerce, B2B",
            status: "Active" 
        }
    ];
    
    // Clear existing data
    table.clear();
    
    // Add data to table
    investors.forEach(function(investor) {
        table.row.add([
            investor.id,
            investor.name,
            investor.type,
            investor.founded,
            investor.location,
            investor.aum,
            investor.portfolio,
            investor.sectors,
            getStatusBadge(investor.status),
            getActionButtons(investor.id)
        ]).draw(false);
    });
    
    // Add event listeners to buttons
    $('.edit-investor').on('click', function() {
        editInvestor($(this).data('id'));
    });
    
    $('.delete-investor').on('click', function() {
        deleteInvestor($(this).data('id'));
    });
}

// Save investor
function saveInvestor() {
    // Get form values
    const name = $('#investorName').val();
    const type = $('#investorType').val();
    const founded = $('#investorFounded').val();
    const location = $('#investorLocation').val();
    const aum = $('#investorAUM').val();
    const portfolio = $('#portfolioSize').val();
    const sectors = $('#investorSectors').val();
    const status = $('#investorStatus').val();
    
    // Validate form
    if (!name || !type || !founded || !location || !status) {
        alert('Please fill in all required fields');
        return;
    }
    
    // For demo purposes, just show success message and close modal
    alert('Investor saved successfully!');
    $('#investorModal').modal('hide');
    
    // Reload table data
    loadInvestors($('#investorsTable').DataTable());
}

// Edit investor
function editInvestor(id) {
    // For demo purposes, populate form with mock data
    $('#investorModalLabel').text('Edit Investor');
    $('#investorName').val('Sequoia Capital');
    $('#investorType').val('Venture Capital');
    $('#investorFounded').val('1972');
    $('#investorLocation').val('Menlo Park, CA');
    $('#investorAUM').val('$85B');
    $('#portfolioSize').val('250');
    $('#investorSectors').val('Technology, Healthcare, Consumer');
    $('#investorStatus').val('Active');
    
    // Show modal
    $('#investorModal').modal('show');
}

// Delete investor
function deleteInvestor(id) {
    if (confirm('Are you sure you want to delete this investor?')) {
        // For demo purposes, just show success message
        alert('Investor deleted successfully!');
        
        // Reload table data
        loadInvestors($('#investorsTable').DataTable());
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
            badgeClass = 'bg-warning';
            break;
        case 'Closed':
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
        <button class="btn btn-sm btn-primary edit-investor" data-id="${id}">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger delete-investor" data-id="${id}">
            <i class="fas fa-trash"></i>
        </button>
    `;
} 
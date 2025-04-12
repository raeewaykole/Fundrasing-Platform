// Sample data for investors and startups (in a real application, this would come from the database)
const investors = [
    { id: 1, name: 'Venture Capital Fund A' },
    { id: 2, name: 'Angel Investor Group B' },
    { id: 3, name: 'Corporate Investment C' }
];

const startups = [
    { id: 1, name: 'Tech Startup X' },
    { id: 2, name: 'HealthTech Y' },
    { id: 3, name: 'FinTech Z' }
];

// Sample investment data
let investments = [
    {
        id: 1,
        investor_id: 1,
        startup_id: 1,
        amount: 1000000.00,
        date: '2024-03-15',
        round: 'series_a',
        equity_percentage: 20.00,
        status: 'completed'
    },
    {
        id: 2,
        investor_id: 2,
        startup_id: 2,
        amount: 500000.00,
        date: '2024-03-16',
        round: 'seed',
        equity_percentage: 15.00,
        status: 'pending'
    }
];

// Initialize DataTable
$(document).ready(function() {
    const investmentsTable = $('#investmentsTable').DataTable({
        data: investments.map(investment => {
            const investor = investors.find(i => i.id === investment.investor_id);
            const startup = startups.find(s => s.id === investment.startup_id);
            return [
                investment.id,
                investor ? investor.name : 'Unknown',
                startup ? startup.name : 'Unknown',
                `$${investment.amount.toLocaleString()}`,
                investment.date,
                investment.round.replace('_', ' ').toUpperCase(),
                `${investment.equity_percentage}%`,
                investment.status.charAt(0).toUpperCase() + investment.status.slice(1),
                `
                    <button class="btn btn-sm btn-primary edit-investment" data-id="${investment.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-investment" data-id="${investment.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `
            ];
        }),
        columns: [
            { title: 'Investment ID' },
            { title: 'Investor' },
            { title: 'Startup' },
            { title: 'Amount' },
            { title: 'Date' },
            { title: 'Round' },
            { title: 'Equity (%)' },
            { title: 'Status' },
            { title: 'Actions' }
        ]
    });

    // Populate investor and startup select options
    function populateSelectOptions() {
        const investorSelect = $('#investorSelect');
        const startupSelect = $('#startupSelect');

        investorSelect.empty().append('<option value="">Select Investor</option>');
        startupSelect.empty().append('<option value="">Select Startup</option>');

        investors.forEach(investor => {
            investorSelect.append(`<option value="${investor.id}">${investor.name}</option>`);
        });

        startups.forEach(startup => {
            startupSelect.append(`<option value="${startup.id}">${startup.name}</option>`);
        });
    }

    // Reset form
    function resetForm() {
        $('#investmentId').val('');
        $('#investorSelect').val('');
        $('#startupSelect').val('');
        $('#investmentAmount').val('');
        $('#investmentDate').val('');
        $('#investmentRound').val('');
        $('#equityPercentage').val('');
        $('#investmentStatus').val('pending');
        $('#investmentModalLabel').text('Add New Investment');
    }

    // Handle save investment
    $('#saveInvestment').click(function() {
        const investmentId = $('#investmentId').val();
        const investmentData = {
            investor_id: parseInt($('#investorSelect').val()),
            startup_id: parseInt($('#startupSelect').val()),
            amount: parseFloat($('#investmentAmount').val()),
            date: $('#investmentDate').val(),
            round: $('#investmentRound').val(),
            equity_percentage: parseFloat($('#equityPercentage').val()),
            status: $('#investmentStatus').val()
        };

        if (investmentId) {
            // Update existing investment
            const index = investments.findIndex(i => i.id === parseInt(investmentId));
            if (index !== -1) {
                investments[index] = { ...investments[index], ...investmentData };
            }
        } else {
            // Add new investment
            const newId = investments.length > 0 ? Math.max(...investments.map(i => i.id)) + 1 : 1;
            investments.push({ id: newId, ...investmentData });
        }

        // Refresh table
        investmentsTable.clear().rows.add(investments.map(investment => {
            const investor = investors.find(i => i.id === investment.investor_id);
            const startup = startups.find(s => s.id === investment.startup_id);
            return [
                investment.id,
                investor ? investor.name : 'Unknown',
                startup ? startup.name : 'Unknown',
                `$${investment.amount.toLocaleString()}`,
                investment.date,
                investment.round.replace('_', ' ').toUpperCase(),
                `${investment.equity_percentage}%`,
                investment.status.charAt(0).toUpperCase() + investment.status.slice(1),
                `
                    <button class="btn btn-sm btn-primary edit-investment" data-id="${investment.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-investment" data-id="${investment.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `
            ];
        })).draw();

        // Close modal and reset form
        $('#investmentModal').modal('hide');
        resetForm();
    });

    // Handle edit investment
    $(document).on('click', '.edit-investment', function() {
        const investmentId = $(this).data('id');
        const investment = investments.find(i => i.id === investmentId);

        if (investment) {
            $('#investmentId').val(investment.id);
            $('#investorSelect').val(investment.investor_id);
            $('#startupSelect').val(investment.startup_id);
            $('#investmentAmount').val(investment.amount);
            $('#investmentDate').val(investment.date);
            $('#investmentRound').val(investment.round);
            $('#equityPercentage').val(investment.equity_percentage);
            $('#investmentStatus').val(investment.status);
            $('#investmentModalLabel').text('Edit Investment');
            $('#investmentModal').modal('show');
        }
    });

    // Handle delete investment
    $(document).on('click', '.delete-investment', function() {
        const investmentId = $(this).data('id');
        if (confirm('Are you sure you want to delete this investment?')) {
            investments = investments.filter(i => i.id !== investmentId);
            investmentsTable.clear().rows.add(investments.map(investment => {
                const investor = investors.find(i => i.id === investment.investor_id);
                const startup = startups.find(s => s.id === investment.startup_id);
                return [
                    investment.id,
                    investor ? investor.name : 'Unknown',
                    startup ? startup.name : 'Unknown',
                    `$${investment.amount.toLocaleString()}`,
                    investment.date,
                    investment.round.replace('_', ' ').toUpperCase(),
                    `${investment.equity_percentage}%`,
                    investment.status.charAt(0).toUpperCase() + investment.status.slice(1),
                    `
                        <button class="btn btn-sm btn-primary edit-investment" data-id="${investment.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-investment" data-id="${investment.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `
                ];
            })).draw();
        }
    });

    // Reset form when modal is closed
    $('#investmentModal').on('hidden.bs.modal', function() {
        resetForm();
    });

    // Initialize select options
    populateSelectOptions();
}); 
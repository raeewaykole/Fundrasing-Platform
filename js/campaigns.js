// Sample data for startups (in a real application, this would come from the database)
const startups = [
    { id: 1, name: 'Tech Startup X' },
    { id: 2, name: 'HealthTech Y' },
    { id: 3, name: 'FinTech Z' }
];

// Sample campaign data
let campaigns = [
    {
        id: 1,
        name: 'Seed Round Funding',
        startup_id: 1,
        start_date: '2024-03-01',
        end_date: '2024-06-30',
        target_amount: 500000.00,
        raised_amount: 250000.00,
        status: 'active',
        description: 'Initial seed funding round to develop MVP'
    },
    {
        id: 2,
        name: 'Series A Expansion',
        startup_id: 2,
        start_date: '2024-04-01',
        end_date: '2024-09-30',
        target_amount: 2000000.00,
        raised_amount: 0.00,
        status: 'planned',
        description: 'Series A funding for market expansion'
    }
];

// Initialize DataTable
$(document).ready(function() {
    const campaignsTable = $('#campaignsTable').DataTable({
        data: campaigns.map(campaign => {
            const startup = startups.find(s => s.id === campaign.startup_id);
            return [
                campaign.id,
                campaign.name,
                startup ? startup.name : 'Unknown',
                campaign.start_date,
                campaign.end_date,
                `$${campaign.target_amount.toLocaleString()}`,
                `$${campaign.raised_amount.toLocaleString()}`,
                campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1),
                `
                    <button class="btn btn-sm btn-primary edit-campaign" data-id="${campaign.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-campaign" data-id="${campaign.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `
            ];
        }),
        columns: [
            { title: 'Campaign ID' },
            { title: 'Name' },
            { title: 'Startup' },
            { title: 'Start Date' },
            { title: 'End Date' },
            { title: 'Target Amount' },
            { title: 'Raised Amount' },
            { title: 'Status' },
            { title: 'Actions' }
        ]
    });

    // Populate startup select options
    function populateStartupOptions() {
        const startupSelect = $('#startupSelect');
        startupSelect.empty().append('<option value="">Select Startup</option>');
        startups.forEach(startup => {
            startupSelect.append(`<option value="${startup.id}">${startup.name}</option>`);
        });
    }

    // Reset form
    function resetForm() {
        $('#campaignId').val('');
        $('#campaignName').val('');
        $('#startupSelect').val('');
        $('#startDate').val('');
        $('#endDate').val('');
        $('#targetAmount').val('');
        $('#campaignStatus').val('planned');
        $('#campaignDescription').val('');
        $('#campaignModalLabel').text('Add New Campaign');
    }

    // Handle save campaign
    $('#saveCampaign').click(function() {
        const campaignId = $('#campaignId').val();
        const campaignData = {
            name: $('#campaignName').val(),
            startup_id: parseInt($('#startupSelect').val()),
            start_date: $('#startDate').val(),
            end_date: $('#endDate').val(),
            target_amount: parseFloat($('#targetAmount').val()),
            raised_amount: 0.00, // This would be calculated from donations in a real app
            status: $('#campaignStatus').val(),
            description: $('#campaignDescription').val()
        };

        if (campaignId) {
            // Update existing campaign
            const index = campaigns.findIndex(c => c.id === parseInt(campaignId));
            if (index !== -1) {
                campaigns[index] = { ...campaigns[index], ...campaignData };
            }
        } else {
            // Add new campaign
            const newId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1;
            campaigns.push({ id: newId, ...campaignData });
        }

        // Refresh table
        campaignsTable.clear().rows.add(campaigns.map(campaign => {
            const startup = startups.find(s => s.id === campaign.startup_id);
            return [
                campaign.id,
                campaign.name,
                startup ? startup.name : 'Unknown',
                campaign.start_date,
                campaign.end_date,
                `$${campaign.target_amount.toLocaleString()}`,
                `$${campaign.raised_amount.toLocaleString()}`,
                campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1),
                `
                    <button class="btn btn-sm btn-primary edit-campaign" data-id="${campaign.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-campaign" data-id="${campaign.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `
            ];
        })).draw();

        // Close modal and reset form
        $('#campaignModal').modal('hide');
        resetForm();
    });

    // Handle edit campaign
    $(document).on('click', '.edit-campaign', function() {
        const campaignId = $(this).data('id');
        const campaign = campaigns.find(c => c.id === campaignId);

        if (campaign) {
            $('#campaignId').val(campaign.id);
            $('#campaignName').val(campaign.name);
            $('#startupSelect').val(campaign.startup_id);
            $('#startDate').val(campaign.start_date);
            $('#endDate').val(campaign.end_date);
            $('#targetAmount').val(campaign.target_amount);
            $('#campaignStatus').val(campaign.status);
            $('#campaignDescription').val(campaign.description);
            $('#campaignModalLabel').text('Edit Campaign');
            $('#campaignModal').modal('show');
        }
    });

    // Handle delete campaign
    $(document).on('click', '.delete-campaign', function() {
        const campaignId = $(this).data('id');
        if (confirm('Are you sure you want to delete this campaign?')) {
            campaigns = campaigns.filter(c => c.id !== campaignId);
            campaignsTable.clear().rows.add(campaigns.map(campaign => {
                const startup = startups.find(s => s.id === campaign.startup_id);
                return [
                    campaign.id,
                    campaign.name,
                    startup ? startup.name : 'Unknown',
                    campaign.start_date,
                    campaign.end_date,
                    `$${campaign.target_amount.toLocaleString()}`,
                    `$${campaign.raised_amount.toLocaleString()}`,
                    campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1),
                    `
                        <button class="btn btn-sm btn-primary edit-campaign" data-id="${campaign.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-campaign" data-id="${campaign.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `
                ];
            })).draw();
        }
    });

    // Reset form when modal is closed
    $('#campaignModal').on('hidden.bs.modal', function() {
        resetForm();
    });

    // Initialize startup options
    populateStartupOptions();
}); 
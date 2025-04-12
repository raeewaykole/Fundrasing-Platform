// Sample startup data
let startups = [
    {
        id: 1,
        name: 'Tech Startup X',
        industry: 'technology',
        founded_date: '2023-01-15',
        location: 'San Francisco, CA',
        total_funding: 1000000.00,
        status: 'active',
        description: 'A cutting-edge technology company focused on AI solutions'
    },
    {
        id: 2,
        name: 'HealthTech Y',
        industry: 'healthcare',
        founded_date: '2022-06-20',
        location: 'Boston, MA',
        total_funding: 2500000.00,
        status: 'active',
        description: 'Revolutionizing healthcare through innovative technology'
    },
    {
        id: 3,
        name: 'FinTech Z',
        industry: 'finance',
        founded_date: '2023-03-10',
        location: 'New York, NY',
        total_funding: 500000.00,
        status: 'active',
        description: 'Modern financial solutions for the digital age'
    }
];

// Initialize DataTable
$(document).ready(function() {
    const startupsTable = $('#startupsTable').DataTable({
        data: startups.map(startup => [
            startup.id,
            startup.name,
            startup.industry.charAt(0).toUpperCase() + startup.industry.slice(1),
            startup.founded_date,
            startup.location,
            `$${startup.total_funding.toLocaleString()}`,
            startup.status.charAt(0).toUpperCase() + startup.status.slice(1),
            `
                <button class="btn btn-sm btn-primary edit-startup" data-id="${startup.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-startup" data-id="${startup.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `
        ]),
        columns: [
            { title: 'Startup ID' },
            { title: 'Name' },
            { title: 'Industry' },
            { title: 'Founded Date' },
            { title: 'Location' },
            { title: 'Total Funding' },
            { title: 'Status' },
            { title: 'Actions' }
        ]
    });

    // Reset form
    function resetForm() {
        $('#startupId').val('');
        $('#startupName').val('');
        $('#industry').val('');
        $('#foundedDate').val('');
        $('#location').val('');
        $('#totalFunding').val('');
        $('#startupStatus').val('active');
        $('#startupDescription').val('');
        $('#startupModalLabel').text('Add New Startup');
    }

    // Handle save startup
    $('#saveStartup').click(function() {
        const startupId = $('#startupId').val();
        const startupData = {
            name: $('#startupName').val(),
            industry: $('#industry').val(),
            founded_date: $('#foundedDate').val(),
            location: $('#location').val(),
            total_funding: parseFloat($('#totalFunding').val()),
            status: $('#startupStatus').val(),
            description: $('#startupDescription').val()
        };

        if (startupId) {
            // Update existing startup
            const index = startups.findIndex(s => s.id === parseInt(startupId));
            if (index !== -1) {
                startups[index] = { ...startups[index], ...startupData };
            }
        } else {
            // Add new startup
            const newId = startups.length > 0 ? Math.max(...startups.map(s => s.id)) + 1 : 1;
            startups.push({ id: newId, ...startupData });
        }

        // Refresh table
        startupsTable.clear().rows.add(startups.map(startup => [
            startup.id,
            startup.name,
            startup.industry.charAt(0).toUpperCase() + startup.industry.slice(1),
            startup.founded_date,
            startup.location,
            `$${startup.total_funding.toLocaleString()}`,
            startup.status.charAt(0).toUpperCase() + startup.status.slice(1),
            `
                <button class="btn btn-sm btn-primary edit-startup" data-id="${startup.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-startup" data-id="${startup.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `
        ])).draw();

        // Close modal and reset form
        $('#startupModal').modal('hide');
        resetForm();
    });

    // Handle edit startup
    $(document).on('click', '.edit-startup', function() {
        const startupId = $(this).data('id');
        const startup = startups.find(s => s.id === startupId);

        if (startup) {
            $('#startupId').val(startup.id);
            $('#startupName').val(startup.name);
            $('#industry').val(startup.industry);
            $('#foundedDate').val(startup.founded_date);
            $('#location').val(startup.location);
            $('#totalFunding').val(startup.total_funding);
            $('#startupStatus').val(startup.status);
            $('#startupDescription').val(startup.description);
            $('#startupModalLabel').text('Edit Startup');
            $('#startupModal').modal('show');
        }
    });

    // Handle delete startup
    $(document).on('click', '.delete-startup', function() {
        const startupId = $(this).data('id');
        if (confirm('Are you sure you want to delete this startup?')) {
            startups = startups.filter(s => s.id !== startupId);
            startupsTable.clear().rows.add(startups.map(startup => [
                startup.id,
                startup.name,
                startup.industry.charAt(0).toUpperCase() + startup.industry.slice(1),
                startup.founded_date,
                startup.location,
                `$${startup.total_funding.toLocaleString()}`,
                startup.status.charAt(0).toUpperCase() + startup.status.slice(1),
                `
                    <button class="btn btn-sm btn-primary edit-startup" data-id="${startup.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-startup" data-id="${startup.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `
            ])).draw();
        }
    });

    // Reset form when modal is closed
    $('#startupModal').on('hidden.bs.modal', function() {
        resetForm();
    });
}); 
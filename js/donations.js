// Sample data for donors and campaigns (in a real application, this would come from the database)
const donors = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
];

const campaigns = [
    { id: 1, name: 'Seed Round' },
    { id: 2, name: 'Series A' },
    { id: 3, name: 'Series B' }
];

// Sample donation data
let donations = [
    {
        id: 1,
        donor_id: 1,
        campaign_id: 1,
        amount: 1000.00,
        date: '2024-03-15',
        payment_method: 'credit_card',
        status: 'completed'
    },
    {
        id: 2,
        donor_id: 2,
        campaign_id: 2,
        amount: 5000.00,
        date: '2024-03-16',
        payment_method: 'bank_transfer',
        status: 'pending'
    }
];

// Initialize DataTable
$(document).ready(function() {
    const donationsTable = $('#donationsTable').DataTable({
        data: donations.map(donation => {
            const donor = donors.find(d => d.id === donation.donor_id);
            const campaign = campaigns.find(c => c.id === donation.campaign_id);
            return [
                donation.id,
                donor ? donor.name : 'Unknown',
                campaign ? campaign.name : 'Unknown',
                `$${donation.amount.toFixed(2)}`,
                donation.date,
                donation.payment_method.replace('_', ' ').toUpperCase(),
                donation.status.charAt(0).toUpperCase() + donation.status.slice(1),
                `
                    <button class="btn btn-sm btn-primary edit-donation" data-id="${donation.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-donation" data-id="${donation.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `
            ];
        }),
        columns: [
            { title: 'Donation ID' },
            { title: 'Donor' },
            { title: 'Campaign' },
            { title: 'Amount' },
            { title: 'Date' },
            { title: 'Payment Method' },
            { title: 'Status' },
            { title: 'Actions' }
        ]
    });

    // Populate donor and campaign select options
    function populateSelectOptions() {
        const donorSelect = $('#donorSelect');
        const campaignSelect = $('#campaignSelect');

        donorSelect.empty().append('<option value="">Select Donor</option>');
        campaignSelect.empty().append('<option value="">Select Campaign</option>');

        donors.forEach(donor => {
            donorSelect.append(`<option value="${donor.id}">${donor.name}</option>`);
        });

        campaigns.forEach(campaign => {
            campaignSelect.append(`<option value="${campaign.id}">${campaign.name}</option>`);
        });
    }

    // Reset form
    function resetForm() {
        $('#donationId').val('');
        $('#donorSelect').val('');
        $('#campaignSelect').val('');
        $('#donationAmount').val('');
        $('#donationDate').val('');
        $('#paymentMethod').val('');
        $('#donationStatus').val('pending');
        $('#donationModalLabel').text('Add New Donation');
    }

    // Handle save donation
    $('#saveDonation').click(function() {
        const donationId = $('#donationId').val();
        const donationData = {
            donor_id: parseInt($('#donorSelect').val()),
            campaign_id: parseInt($('#campaignSelect').val()),
            amount: parseFloat($('#donationAmount').val()),
            date: $('#donationDate').val(),
            payment_method: $('#paymentMethod').val(),
            status: $('#donationStatus').val()
        };

        if (donationId) {
            // Update existing donation
            const index = donations.findIndex(d => d.id === parseInt(donationId));
            if (index !== -1) {
                donations[index] = { ...donations[index], ...donationData };
            }
        } else {
            // Add new donation
            const newId = donations.length > 0 ? Math.max(...donations.map(d => d.id)) + 1 : 1;
            donations.push({ id: newId, ...donationData });
        }

        // Refresh table
        donationsTable.clear().rows.add(donations.map(donation => {
            const donor = donors.find(d => d.id === donation.donor_id);
            const campaign = campaigns.find(c => c.id === donation.campaign_id);
            return [
                donation.id,
                donor ? donor.name : 'Unknown',
                campaign ? campaign.name : 'Unknown',
                `$${donation.amount.toFixed(2)}`,
                donation.date,
                donation.payment_method.replace('_', ' ').toUpperCase(),
                donation.status.charAt(0).toUpperCase() + donation.status.slice(1),
                `
                    <button class="btn btn-sm btn-primary edit-donation" data-id="${donation.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-donation" data-id="${donation.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `
            ];
        })).draw();

        // Close modal and reset form
        $('#donationModal').modal('hide');
        resetForm();
    });

    // Handle edit donation
    $(document).on('click', '.edit-donation', function() {
        const donationId = $(this).data('id');
        const donation = donations.find(d => d.id === donationId);

        if (donation) {
            $('#donationId').val(donation.id);
            $('#donorSelect').val(donation.donor_id);
            $('#campaignSelect').val(donation.campaign_id);
            $('#donationAmount').val(donation.amount);
            $('#donationDate').val(donation.date);
            $('#paymentMethod').val(donation.payment_method);
            $('#donationStatus').val(donation.status);
            $('#donationModalLabel').text('Edit Donation');
            $('#donationModal').modal('show');
        }
    });

    // Handle delete donation
    $(document).on('click', '.delete-donation', function() {
        const donationId = $(this).data('id');
        if (confirm('Are you sure you want to delete this donation?')) {
            donations = donations.filter(d => d.id !== donationId);
            donationsTable.clear().rows.add(donations.map(donation => {
                const donor = donors.find(d => d.id === donation.donor_id);
                const campaign = campaigns.find(c => c.id === donation.campaign_id);
                return [
                    donation.id,
                    donor ? donor.name : 'Unknown',
                    campaign ? campaign.name : 'Unknown',
                    `$${donation.amount.toFixed(2)}`,
                    donation.date,
                    donation.payment_method.replace('_', ' ').toUpperCase(),
                    donation.status.charAt(0).toUpperCase() + donation.status.slice(1),
                    `
                        <button class="btn btn-sm btn-primary edit-donation" data-id="${donation.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-donation" data-id="${donation.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `
                ];
            })).draw();
        }
    });

    // Reset form when modal is closed
    $('#donationModal').on('hidden.bs.modal', function() {
        resetForm();
    });

    // Initialize select options
    populateSelectOptions();
}); 
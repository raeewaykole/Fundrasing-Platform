// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize DataTable
$(document).ready(function() {
    const donorsTable = $('#donorsTable').DataTable({
        columns: [
            { title: 'ID' },
            { title: 'Name' },
            { title: 'Email' },
            { title: 'Phone' },
            { title: 'Address' },
            { title: 'Actions' }
        ]
    });

    // Load donors from API
    async function loadDonors() {
        try {
            const response = await fetch(`${API_BASE_URL}/donors`);
            const donors = await response.json();
            
            donorsTable.clear().rows.add(donors.map(donor => [
                donor.id,
                donor.name,
                donor.email,
                donor.phone,
                donor.address,
                `
                    <button class="btn btn-sm btn-primary edit-donor" data-id="${donor.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-donor" data-id="${donor.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `
            ])).draw();
        } catch (error) {
            console.error('Error loading donors:', error);
            alert('Failed to load donors. Please try again.');
        }
    }

    // Reset form
    function resetForm() {
        $('#donorId').val('');
        $('#donorName').val('');
        $('#email').val('');
        $('#phone').val('');
        $('#address').val('');
        $('#donorModalLabel').text('Add New Donor');
    }

    // Handle save donor
    $('#saveDonor').click(async function() {
        const donorId = $('#donorId').val();
        const donorData = {
            name: $('#donorName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val()
        };

        try {
            if (donorId) {
                // Update existing donor
                const response = await fetch(`${API_BASE_URL}/donors/${donorId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(donorData)
                });
                
                if (!response.ok) throw new Error('Failed to update donor');
            } else {
                // Add new donor
                const response = await fetch(`${API_BASE_URL}/donors`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: `DON-${Date.now()}`,
                        ...donorData
                    })
                });
                
                if (!response.ok) throw new Error('Failed to add donor');
            }

            // Refresh table
            await loadDonors();
            
            // Close modal and reset form
            $('#donorModal').modal('hide');
            resetForm();
        } catch (error) {
            console.error('Error saving donor:', error);
            alert('Failed to save donor. Please try again.');
        }
    });

    // Handle edit donor
    $(document).on('click', '.edit-donor', async function() {
        const donorId = $(this).data('id');
        
        try {
            const response = await fetch(`${API_BASE_URL}/donors/${donorId}`);
            if (!response.ok) throw new Error('Failed to fetch donor');
            
            const donor = await response.json();
            
            $('#donorId').val(donor.id);
            $('#donorName').val(donor.name);
            $('#email').val(donor.email);
            $('#phone').val(donor.phone);
            $('#address').val(donor.address);
            $('#donorModalLabel').text('Edit Donor');
            $('#donorModal').modal('show');
        } catch (error) {
            console.error('Error loading donor:', error);
            alert('Failed to load donor details. Please try again.');
        }
    });

    // Handle delete donor
    $(document).on('click', '.delete-donor', async function() {
        const donorId = $(this).data('id');
        
        if (confirm('Are you sure you want to delete this donor?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/donors/${donorId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) throw new Error('Failed to delete donor');
                
                // Refresh table
                await loadDonors();
            } catch (error) {
                console.error('Error deleting donor:', error);
                alert('Failed to delete donor. Please try again.');
            }
        }
    });

    // Reset form when modal is closed
    $('#donorModal').on('hidden.bs.modal', function() {
        resetForm();
    });

    // Initial load
    loadDonors();
}); 
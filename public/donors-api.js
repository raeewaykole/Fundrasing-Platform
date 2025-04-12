document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const donorsTableBody = document.getElementById('donorsTableBody');
    const addDonorBtn = document.getElementById('addDonorBtn');
    const donorModal = document.getElementById('donorModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const donorForm = document.getElementById('donorForm');
    const searchInput = document.getElementById('searchDonors');
    
    // API URL (change this to your actual backend URL)
    const API_URL = 'http://localhost:3000/api';
    
    // Fetch all donors from the API
    async function fetchDonors() {
        try {
            const response = await fetch(`${API_URL}/donors`);
            if (!response.ok) {
                throw new Error('Failed to fetch donors');
            }
            const donors = await response.json();
            displayDonors(donors);
        } catch (error) {
            console.error('Error fetching donors:', error);
            alert('Error fetching donors. Please try again later.');
        }
    }
    
    // Display donors in the table
    function displayDonors(donors) {
        donorsTableBody.innerHTML = '';
        
        donors.forEach(donor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donor.id}</td>
                <td>${donor.name}</td>
                <td>${donor.phone}</td>
                <td>${donor.address}</td>
                <td>$0</td> <!-- In a real app, you would calculate this from donations -->
                <td>
                    <button class="edit-btn" data-id="${donor.id}">Edit</button>
                    <button class="delete-btn" data-id="${donor.id}">Delete</button>
                </td>
            `;
            donorsTableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const donorId = this.getAttribute('data-id');
                editDonor(donorId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const donorId = this.getAttribute('data-id');
                deleteDonor(donorId);
            });
        });
    }

    // Show modal for adding a new donor
    function showAddDonorModal() {
        document.getElementById('modalTitle').textContent = 'Add New Donor';
        document.getElementById('donorId').value = '';
        donorForm.reset();
        donorModal.style.display = 'block';
    }

    // Show modal for editing a donor
    async function editDonor(donorId) {
        try {
            const response = await fetch(`${API_URL}/donors/${donorId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch donor');
            }
            const donor = await response.json();
            
            document.getElementById('modalTitle').textContent = 'Edit Donor';
            document.getElementById('donorId').value = donor.id;
            document.getElementById('name').value = donor.name;
            document.getElementById('phone').value = donor.phone;
            document.getElementById('address').value = donor.address;
            document.getElementById('email').value = donor.email;
            donorModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching donor:', error);
            alert('Error fetching donor details. Please try again later.');
        }
    }

    // Delete a donor
    async function deleteDonor(donorId) {
        if (confirm('Are you sure you want to delete this donor?')) {
            try {
                const response = await fetch(`${API_URL}/donors/${donorId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to delete donor');
                }
                
                alert('Donor deleted successfully');
                fetchDonors(); // Refresh the list
            } catch (error) {
                console.error('Error deleting donor:', error);
                alert('Error deleting donor. Please try again later.');
            }
        }
    }

    // Save donor (add or update)
    async function saveDonor(event) {
        event.preventDefault();
        
        const donorId = document.getElementById('donorId').value;
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;
        
        const donorData = { name, phone, address, email };
        
        try {
            let response;
            
            if (donorId) {
                // Update existing donor
                response = await fetch(`${API_URL}/donors/${donorId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(donorData)
                });
            } else {
                // Add new donor
                donorData.id = 'DONOR-' + (Math.floor(Math.random() * 900) + 100);
                response = await fetch(`${API_URL}/donors`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(donorData)
                });
            }
            
            if (!response.ok) {
                throw new Error('Failed to save donor');
            }
            
            alert(donorId ? 'Donor updated successfully' : 'Donor added successfully');
            donorModal.style.display = 'none';
            fetchDonors(); // Refresh the list
        } catch (error) {
            console.error('Error saving donor:', error);
            alert('Error saving donor. Please try again later.');
        }
    }

    // Event listeners
    addDonorBtn.addEventListener('click', showAddDonorModal);
    
    closeBtn.addEventListener('click', function() {
        donorModal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        donorModal.style.display = 'none';
    });
    
    donorForm.addEventListener('submit', saveDonor);
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        // In a real app, you might want to implement server-side search
        // For simplicity, we'll just filter the current table rows
        const rows = donorsTableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === donorModal) {
            donorModal.style.display = 'none';
        }
    });

    // Initial fetch
    fetchDonors();
});
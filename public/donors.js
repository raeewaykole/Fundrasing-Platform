document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const donorsTableBody = document.getElementById('donorsTableBody');
    const addDonorBtn = document.getElementById('addDonorBtn');
    const donorModal = document.getElementById('donorModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const donorForm = document.getElementById('donorForm');
    const searchInput = document.getElementById('searchDonors');
    
    // Sample donor data (in a real app, this would come from the backend)
    let donors = [
        { id: 'DONOR-001', name: 'John Smith', phone: '+1 (555) 123-4567', address: '123 Main St, New York, NY 10001', email: 'john@example.com', totalDonated: '$25,000' },
        { id: 'DONOR-002', name: 'Emily Johnson', phone: '+1 (555) 234-5678', address: '456 Park Ave, Boston, MA 02108', email: 'emily@example.com', totalDonated: '$15,750' },
        { id: 'DONOR-003', name: 'Michael Brown', phone: '+1 (555) 345-6789', address: '789 Oak St, San Francisco, CA 94102', email: 'michael@example.com', totalDonated: '$42,300' },
        { id: 'DONOR-004', name: 'Sarah Davis', phone: '+1 (555) 456-7890', address: '101 Pine St, Seattle, WA 98101', email: 'sarah@example.com', totalDonated: '$8,500' },
        { id: 'DONOR-005', name: 'Robert Wilson', phone: '+1 (555) 567-8901', address: '202 Maple Ave, Chicago, IL 60601', email: 'robert@example.com', totalDonated: '$31,200' }
    ];

    // Display donors in the table
    function displayDonors(donorsToDisplay = donors) {
        donorsTableBody.innerHTML = '';
        
        donorsToDisplay.forEach(donor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donor.id}</td>
                <td>${donor.name}</td>
                <td>${donor.phone}</td>
                <td>${donor.address}</td>
                <td>${donor.totalDonated}</td>
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
    function editDonor(donorId) {
        const donor = donors.find(d => d.id === donorId);
        if (donor) {
            document.getElementById('modalTitle').textContent = 'Edit Donor';
            document.getElementById('donorId').value = donor.id;
            document.getElementById('name').value = donor.name;
            document.getElementById('phone').value = donor.phone;
            document.getElementById('address').value = donor.address;
            document.getElementById('email').value = donor.email;
            donorModal.style.display = 'block';
        }
    }

    // Delete a donor
    function deleteDonor(donorId) {
        if (confirm('Are you sure you want to delete this donor?')) {
            donors = donors.filter(d => d.id !== donorId);
            displayDonors();
        }
    }

    // Save donor (add or update)
    function saveDonor(event) {
        event.preventDefault();
        
        const donorId = document.getElementById('donorId').value;
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;
        
        if (donorId) {
            // Update existing donor
            const index = donors.findIndex(d => d.id === donorId);
            if (index !== -1) {
                donors[index] = {
                    ...donors[index],
                    name,
                    phone,
                    address,
                    email
                };
            }
        } else {
            // Add new donor
            const newId = 'DONOR-' + (Math.floor(Math.random() * 900) + 100);
            donors.push({
                id: newId,
                name,
                phone,
                address,
                email,
                totalDonated: '$0'
            });
        }
        
        displayDonors();
        donorModal.style.display = 'none';
    }

    // Search donors
    function searchDonors(query) {
        query = query.toLowerCase();
        const filteredDonors = donors.filter(donor => 
            donor.name.toLowerCase().includes(query) ||
            donor.id.toLowerCase().includes(query) ||
            donor.phone.toLowerCase().includes(query) ||
            donor.address.toLowerCase().includes(query)
        );
        displayDonors(filteredDonors);
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
        searchDonors(this.value);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === donorModal) {
            donorModal.style.display = 'none';
        }
    });

    // Auth buttons event listeners
    document.getElementById('signInBtn').addEventListener('click', function() {
        alert('Sign In functionality would be implemented here');
    });

    document.getElementById('signUpBtn').addEventListener('click', function() {
        alert('Sign Up functionality would be implemented here');
    });

    // Initial display
    displayDonors();
});
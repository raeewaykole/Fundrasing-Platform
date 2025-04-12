// Sample data - In a real application, this would come from an API
const sampleData = {
    totalFundraising: 45231890,
    activeCampaigns: 234,
    totalDonors: 12543,
    topStartups: 573,
    sectorDistribution: {
        labels: ['Technology', 'Healthcare', 'Education', 'Finance', 'Energy'],
        data: [35, 25, 15, 15, 10]
    },
    fundraisingTrends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [5000000, 7500000, 6000000, 9000000, 8500000, 9500000]
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateDashboardStats();
    initializeCharts();
});

// Update dashboard statistics
function updateDashboardStats() {
    document.getElementById('total-fundraising').textContent = formatCurrency(sampleData.totalFundraising);
    document.getElementById('active-campaigns').textContent = sampleData.activeCampaigns;
    document.getElementById('total-donors').textContent = sampleData.totalDonors;
    document.getElementById('top-startups').textContent = sampleData.topStartups;
}

// Initialize charts
function initializeCharts() {
    // Sector Distribution Chart
    const sectorCtx = document.getElementById('sectorChart').getContext('2d');
    new Chart(sectorCtx, {
        type: 'doughnut',
        data: {
            labels: sampleData.sectorDistribution.labels,
            datasets: [{
                data: sampleData.sectorDistribution.data,
                backgroundColor: [
                    '#4e73df',
                    '#1cc88a',
                    '#36b9cc',
                    '#f6c23e',
                    '#e74a3b'
                ],
                hoverBackgroundColor: [
                    '#2e59d9',
                    '#17a673',
                    '#2c9faf',
                    '#dda20a',
                    '#be2617'
                ],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '80%',
        },
    });

    // Fundraising Trends Chart
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: sampleData.fundraisingTrends.labels,
            datasets: [{
                label: "Fundraising Amount",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: sampleData.fundraisingTrends.data,
            }],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        },
    });
}

// Helper function to format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Export functionality
document.querySelector('.btn-outline-secondary').addEventListener('click', function() {
    // In a real application, this would trigger a download of the dashboard data
    alert('Export functionality will be implemented in the next version.');
}); 
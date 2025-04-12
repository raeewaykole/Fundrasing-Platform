document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "/api";
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Fetch dashboard data
  async function fetchDashboardData() {
    try {
      // Fetch overall statistics
      const overallResponse = await fetch(`${API_URL}/stats/overall`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!overallResponse.ok) throw new Error('Failed to fetch overall statistics');
      const overallData = await overallResponse.json();
      
      // Update dashboard stats
      document.getElementById("total-funding").textContent = `$${overallData.donors.total_donations.toLocaleString()}`;
      document.getElementById("donor-count").textContent = overallData.donors.total_donors.toLocaleString();
      document.getElementById("campaign-count").textContent = overallData.campaigns.total_campaigns.toLocaleString();
      document.getElementById("avg-donation").textContent = `$${Math.round(overallData.donors.total_donations / overallData.donors.total_donors).toLocaleString()}`;

      // Fetch funding by campaign data for chart
      const fundingByCampaignResponse = await fetch(`${API_URL}/stats/funding-by-campaign`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!fundingByCampaignResponse.ok) throw new Error('Failed to fetch funding by campaign');
      const fundingByCampaignData = await fundingByCampaignResponse.json();
      renderCampaignChart(fundingByCampaignData);

      // Fetch donations over time data for chart
      const donationsOverTimeResponse = await fetch(`${API_URL}/stats/donations-over-time`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!donationsOverTimeResponse.ok) throw new Error('Failed to fetch donations over time');
      const donationsOverTimeData = await donationsOverTimeResponse.json();
      renderTimeSeriesChart(donationsOverTimeData);

      // Fetch recent donations
      const recentDonationsResponse = await fetch(`${API_URL}/stats/donations/recent`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!recentDonationsResponse.ok) throw new Error('Failed to fetch recent donations');
      const recentDonationsData = await recentDonationsResponse.json();
      renderRecentDonations(recentDonationsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Error loading dashboard data. Please try again later.");
    }
  }

  // Render campaign funding chart
  function renderCampaignChart(data) {
    const ctx = document.getElementById("campaign-chart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: data.map((item) => item.campaign_name),
        datasets: [
          {
            data: data.map((item) => item.total_amount),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Funding by Campaign",
          },
        },
      },
    });
  }

  // Render time series chart
  function renderTimeSeriesChart(data) {
    const ctx = document.getElementById("time-series-chart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.date),
        datasets: [
          {
            label: "Donations Over Time",
            data: data.map((item) => item.amount),
            borderColor: "#36A2EB",
            tension: 0.1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Donations Over Time",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Amount ($)",
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Render recent donations
  function renderRecentDonations(donations) {
    const container = document.getElementById("recent-donations");
    const table = document.createElement("table");
    table.className = "table table-striped";
    
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Date</th>
            <th>Donor</th>
            <th>Campaign</th>
            <th>Amount</th>
        </tr>
    `;
    
    const tbody = document.createElement("tbody");
    donations.forEach(donation => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${new Date(donation.date).toLocaleDateString()}</td>
          <td>${donation.donor_name}</td>
          <td>${donation.campaign_name}</td>
          <td>$${donation.amount.toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
  }

  // Initialize dashboard
  fetchDashboardData();

  // Refresh data every 5 minutes
  setInterval(fetchDashboardData, 5 * 60 * 1000);
});


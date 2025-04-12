-- Fundraising Platform Database Setup
-- This file contains all SQL commands to create and initialize the database

-- Drop views if they exist
DROP VIEW IF EXISTS monthly_funding_trends;
DROP VIEW IF EXISTS sector_funding;
DROP VIEW IF EXISTS donor_statistics;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS investments;
DROP TABLE IF EXISTS startups;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS donors;
DROP TABLE IF EXISTS users;

-- Create Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a test user (password: password123)
INSERT INTO users (name, email, password) VALUES
('Test User', 'test@example.com', '$2a$10$gCBt9sVQHj9wUX7QsMvqTORYN0gLI5DF45kVlH9vzWjbkP/2yiN1y');

-- Create Donors table
CREATE TABLE donors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Campaigns table
CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP
);

-- Create Donations table
CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    campaign_id INT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors (id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
);

-- Create Startups table
CREATE TABLE startups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    description TEXT,
    funding_amount DECIMAL(15,2) DEFAULT 0,
    founded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Investments table
CREATE TABLE investments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    startup_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    investor_name VARCHAR(100) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups (id)
);

-- Create indexes for better query performance
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX idx_investments_startup_id ON investments(startup_id);
CREATE INDEX idx_startups_sector ON startups(sector);

-- Insert sample data

-- Sample Donors
INSERT INTO donors (id, name, phone, address, email) VALUES
('DONOR-001', 'Amit Sharma', '+91 9876543210', 'MG Road, Bangalore', 'amit@example.com'),
('DONOR-002', 'Priya Singh', '+91 8765432109', 'Connaught Place, Delhi', 'priya@example.com'),
('DONOR-003', 'Rohan Verma', '+91 7654321098', 'Bandra West, Mumbai', 'rohan@example.com'),
('DONOR-004', 'Neha Gupta', '+91 6543210987', 'Park Street, Kolkata', 'neha@example.com'),
('DONOR-005', 'Rahul Mehta', '+91 5432109876', 'Gachibowli, Hyderabad', 'rahul@example.com'),
('DONOR-006', 'Sneha Rao', '+91 4321098765', 'T Nagar, Chennai', 'sneha@example.com'),
('DONOR-007', 'Vikram Choudhary', '+91 3210987654', 'Sector 62, Noida', 'vikram@example.com'),
('DONOR-008', 'Ananya Bose', '+91 2109876543', 'Viman Nagar, Pune', 'ananya@example.com');

-- Sample Campaigns
INSERT INTO campaigns (name, description, target_amount, current_amount) VALUES
('Startup India', 'Supporting Indian startups', 10000000, 7500000),
('Ayushman Bharat', 'Healthcare funding for poor', 5000000, 3200000),
('Swachh Bharat', 'Clean India Initiative', 8000000, 4100000),
('Education for All', 'Improving rural education', 3000000, 1800000),
('Green India', 'Environmental projects', 2000000, 950000),
('Women Empowerment', 'Entrepreneurship for women', 7000000, 5200000),
('Smart Cities', 'Developing smart infrastructure', 15000000, 10200000),
('Digital India', 'Enhancing digital transformation', 12000000, 8900000);

-- Sample Startups
INSERT INTO startups (name, sector, description, funding_amount) VALUES
('ZyloTech', 'Technology', 'AI & Automation solutions', 12500000),
('SolarGreen', 'Clean Energy', 'Renewable solar energy solutions', 8200000),
('MediHealth', 'Healthcare', 'Affordable medical tech', 7800000),
('FinSafe', 'Finance', 'Financial security solutions', 6500000),
('EduSmart', 'Education', 'EdTech solutions for students', 5900000),
('AgroTech India', 'Agriculture', 'Smart farming innovations', 4200000),
('EcomGo', 'Retail', 'E-commerce platform', 3800000),
('TransPortX', 'Transportation', 'Smart logistics', 3100000);

-- Sample Donations
INSERT INTO donations (donor_id, amount, campaign_id, date) VALUES
('DONOR-001', 25000, 1, '2024-01-15'),
('DONOR-002', 15750, 2, '2024-02-10'),
('DONOR-003', 42300, 1, '2024-03-05'),
('DONOR-004', 8500, 3, '2024-03-22'),
('DONOR-005', 31200, 2, '2024-04-18'),
('DONOR-006', 18000, 3, '2024-05-07'),
('DONOR-007', 12500, 4, '2024-06-12'),
('DONOR-008', 27500, 5, '2024-07-03');

-- Sample Investments
INSERT INTO investments (startup_id, amount, investor_name, date) VALUES
(1, 5000000, 'Sequoia India', '2024-02-15'),
(2, 3500000, 'Blume Ventures', '2024-03-10'),
(3, 4200000, 'Kalaari Capital', '2024-04-22'),
(4, 2800000, 'Accel Partners', '2024-05-18'),
(5, 3100000, 'Nexus Venture Partners', '2024-06-07'),
(6, 7500000, 'Elevation Capital', '2024-07-12'),
(7, 4700000, 'Lightspeed India', '2024-08-03'),
(8, 3600000, 'Matrix Partners', '2024-09-21');


# Fundraising Platform

A comprehensive web-based platform for managing fundraising campaigns, donations, and startup investments.

## Features

- **User Management**

  - Secure authentication system
  - User profiles and roles
  - Session management

- **Campaign Management**

  - Create and manage fundraising campaigns
  - Set funding targets and track progress
  - Campaign analytics and statistics

- **Donation System**

  - Secure donation processing
  - Donor management
  - Donation history and tracking
  - Receipt generation

- **Startup Management**

  - Startup profiles and information
  - Investment tracking
  - Sector-based categorization
  - Funding progress monitoring

- **Analytics & Reporting**
  - Real-time statistics
  - Funding trends
  - Donor analytics
  - Campaign performance metrics

## Tech Stack

- **Backend**

  - Node.js
  - Express.js
  - MySQL Database
  - RESTful API

- **Frontend**
  - HTML5
  - CSS3
  - JavaScript
  - jQuery
  - DataTables

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/raeewaykole/Fundrasing-Platform.git
   cd Fundrasing-Platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Create a MySQL database named `fundraising_platform`
   - Import the database schema from `database-setup.sql`

4. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Update the database credentials and other settings

5. Start the server:

   ```bash
   npm start
   ```

6. Access the application:
   - Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
Fundrasing-Platform/
├── config/             # Configuration files
├── public/            # Frontend assets
├── routes/            # API routes
├── database-setup.sql # Database schema
├── server.js         # Main application file
└── package.json      # Project dependencies
```

## API Documentation

The application provides RESTful APIs for:

- Authentication (`/api/auth`)
- Campaigns (`/api/campaigns`)
- Donations (`/api/donations`)
- Donors (`/api/donors`)
- Startups (`/api/startups`)
- Statistics (`/api/statistics`)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please open an issue in the GitHub repository.

Backend..

This is the backend side for the ProStruct Engineering Contact Map(Internship assignment), a web application that fetches contact data from HubSpot, manages access token refreshing, and serves it to a frontend map interface. Built with Node.js, Express, and the HubSpot API client.
Features

Fetches contact data (firstname, lastname, email, phone, address, project_role) from HubSpot.
Automatically refreshes HubSpot access tokens every 6 hours using a refresh token.
Serves contact data via a REST API endpoint (/api/contacts).
Deployed on Vercel for scalability.

Prerequisites

Node.js: v18 or higher.
npm: v9 or higher.
HubSpot Developer Account: For API credentials (Client ID, Client Secret, Refresh Token).
Git: For cloning the repository.

Installation

Clone the Repository:git clone https://github.com/username/prostruct.git
cd prostruct


Install Dependencies:npm install


Set Up Environment Variables:
Create a .env file in the root directory:HUBSPOT_CLIENT_ID=your-client-id
HUBSPOT_CLIENT_SECRET=your-client-secret
HUBSPOT_REFRESH_TOKEN=your-refresh-token
PORT=3000


Obtain credentials from your HubSpot app (https://app.hubspot.com/developer).
Run hubspot-oauth-test.js to get a refresh token:node hubspot-oauth-test.js




Initialize Tokens:
Create tokens.json:{
  "accessToken": "your-initial-access-token",
  "refreshToken": "your-refresh-token",
  "expiresAt": 0
}





Running Locally

Start the Server:npm start


Test the API:
Access http://localhost:3000/api/contacts.
Expected response:[
  {
    "id": "114108302047",
    "firstname": "James",
    "lastname": "Walker",
    "email": "james.walker@example.com",
    "phone": "N/A",
    "address": "123 Main St, Boston, MA",
    "project_role": ["contractor", "referral_partner"]
  },
  // ...
]



API Errors:
Test: curl https://prostruct-engineering-assignment.vercel.app/api/contacts.


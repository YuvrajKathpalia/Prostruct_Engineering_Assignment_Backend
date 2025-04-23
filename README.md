
This is the backend side for the ProStruct Engineering Contact Map(Internship assignment), a web application that fetches contact data from HubSpot, manages access token refreshing, and serves it to a frontend map interface. Built with Node.js, Express, and the HubSpot API client.


Features

Fetches contact data (firstname, lastname, email, phone, address, project_role) from HubSpot.
Automatically refreshes HubSpot access tokens every 6 hours using a refresh token.
Serves contact data via a REST API endpoint (/api/contacts).
Deployed on Vercel for scalability.

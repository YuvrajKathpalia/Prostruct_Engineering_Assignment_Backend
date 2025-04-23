const express = require('express');
const axios = require('axios');
const hubspot = require('@hubspot/api-client');

const app = express();
const PORT = 3000;

const CLIENT_ID = '30ebaa17-e873-4266-95a5-9630948bb1e9';
const CLIENT_SECRET = '78b9a5d8-9780-411a-bb05-a2a98ba32d16';
const APP_ID = '11436798';
const REDIRECT_URI = 'http://localhost:3000/oauth-callback';
const SCOPES = 'crm.objects.appointments.write crm.objects.carts.write crm.objects.companies.write crm.objects.courses.write crm.objects.custom.write crm.objects.deals.write crm.objects.invoices.write crm.objects.subscriptions.write crm.objects.listings.write crm.objects.orders.write crm.objects.users.write crm.pipelines.orders.write crm.schemas.appointments.write crm.schemas.carts.write crm.schemas.companies.write crm.schemas.contacts.write crm.schemas.courses.write crm.schemas.deals.write crm.schemas.invoices.write crm.schemas.listings.write crm.schemas.orders.write crm.schemas.services.write crm.schemas.subscriptions.write e-commerce oauth tickets crm.objects.contacts.read crm.schemas.custom.read crm.objects.contacts.write';


// Generatingg OAuth authorization URL

app.get('/auth', (req, res) => {
  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${encodeURIComponent(CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
  console.log('Authorization URL:', authUrl);
  res.redirect(authUrl);
});


app.get('/oauth-callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    console.error('No authorization code provided');
    return res.status(400).send('No authorization code provided');
  }

  try {

    console.log('Exchanging code for token');
    const tokenResponse = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token } = tokenResponse.data;
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);

    const hubspotClient = new hubspot.Client({ accessToken: access_token });

    // Testing...

    console.log('Fetching contacts here');
    try {
      const apiResponse = await hubspotClient.crm.contacts.getAll();
      console.log('Successfully connected to HubSpot Test Account!');
      console.log('Fetched contacts:', JSON.stringify(apiResponse, null, 2));
      res.send('OAuth successful! Check console for contact data.');
    } 
    catch (error) {
      console.error('Error fetching contacts:', error.message);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Full error:', JSON.stringify(error, null, 2));
      res.status(500).send('Error fetching contacts. Check console for details.');
    }
  } catch (error) {
    console.error('Error exchanging code for token:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
    res.status(500).send('OAuth token exchange failed. Check console for details.');
  }
});

// Start server.

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Open http://localhost:3000/auth in your browser to start OAuth flow');
});


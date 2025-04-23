const express = require('express');
const hubspotClient = require('@hubspot/api-client');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const hubspot = new hubspotClient.Client();
const TOKEN_FILE = path.join(__dirname, 'tokens.json');

app.use(cors());
app.use(express.json());

const getTokens = async () => {
  try {
    const data = await fs.readFile(TOKEN_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading tokens:', err.message);
    return { accessToken: null, refreshToken: process.env.HUBSPOT_REFRESH_TOKEN, expiresAt: null };
  }
};

const saveTokens = async (tokens) => {
  try {
    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2));
  } catch (err) {
    console.error('Error saving tokens:', err.message);
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('https://api.hubapi.com/oauth/v1/token', new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.HUBSPOT_CLIENT_ID,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET,
      refresh_token: refreshToken
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const newTokens = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token || refreshToken,
      expiresAt: Date.now() + (response.data.expires_in * 1000)
    };
    await saveTokens(newTokens);
    console.log('Access token refreshed successfully');
    return newTokens.accessToken;
  } catch (err) {
    console.error('Error refreshing token:', err.response?.data?.message || err.message);
    throw new Error('Failed to refresh access token');
  }
};

const getValidAccessToken = async () => {
  const tokens = await getTokens();
  if (!tokens.accessToken || !tokens.expiresAt || Date.now() >= tokens.expiresAt - 60000) {
    console.log('Access token expired or missing, refreshing...');
    return await refreshAccessToken(tokens.refreshToken);
  }
  return tokens.accessToken;
};

app.get('/api/contacts', async (req, res) => {
  try {
    const accessToken = await getValidAccessToken();
    hubspot.setAccessToken(accessToken);

    const properties = ['firstname', 'lastname', 'email', 'phone', 'address', 'project_role'];
    const response = await hubspot.crm.contacts.basicApi.getPage(100, undefined, properties);

    const contacts = response.results.map(contact => ({
      id: contact.id,
      firstname: contact.properties.firstname || 'N/A',
      lastname: contact.properties.lastname || 'N/A',
      email: contact.properties.email || 'N/A',
      phone: contact.properties.phone || 'N/A',
      address: contact.properties.address || 'N/A',
      project_role: contact.properties.project_role ? contact.properties.project_role.split(';') : ['other']
    }));

    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
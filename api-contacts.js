
//step 5...

const express = require('express');
const hubspot = require('@hubspot/api-client');

const app = express();
const PORT = 3000;
const ACCESS_TOKEN = 'CP-6_pXmMhIhAAEDQAAAoQIAAACgBQAAAAAAAAAAAAEgqQAAAAAoItUDGNuk13MguI34JSj-hboFMhQTJt-XUaKePBdBDKv0gQCrMbALATppAAAAQQAAAADA_wMAAAAAAACAAAAAAAAAAAwAIACGAC4A4AEAAAAAAAAA5xkAANACAAAAAAAAAAAAAAAAAAAACAAAAPADAAAAAAAAYA4DBwMAAAAAAAAAAAAAAAAAAADw8ADwAMDhmfljQhQr_CzziTr9VsxS9Bvd9FgFXHT4r0oDbmEyUgBaAGAAaLiN-CVwAA'; 

const hubspotClient = new hubspot.Client({ accessToken: ACCESS_TOKEN });

app.get('/api/contacts', async (req, res) => {
  try {
    console.log('Fetching contacts with non-null project_role...');
    const filter = {
      propertyName: 'project_role',
      operator: 'HAS_PROPERTY', 
    };
    const filterGroup = { filters: [filter] };
    const properties = ['firstname', 'lastname', 'email', 'project_role', 'address','phone'];
    const apiResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
      filterGroups: [filterGroup],
      properties,
      limit: 100,
      after: 0,
    });

    const contacts = apiResponse.results.map(contact => ({
      id: contact.id,
      firstname: contact.properties.firstname,
      lastname: contact.properties.lastname,
      email: contact.properties.email,
      project_role: contact.properties.project_role ? contact.properties.project_role.split(';') : [], // Split multiple roles into array
      address: contact.properties.address,
      phone:contact.properties.phone,
    }));

    console.log('Fetched contacts:', JSON.stringify(contacts, null, 2));
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
    res.status(500).json({ error: 'Failed to fetch contacts', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log('Access the endpoint at http://localhost:3000/api/contacts');
});
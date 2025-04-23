const hubspot = require('@hubspot/api-client');

const ACCESS_TOKEN= 'CPSA8P3lMhIHAAEAQAAAIRjbpNdzILiN-CUo_oW6BTIUxC2-z8ebgPE00B7_lGDMHOT4at46MAAAAEEAAAAAAAAAAAAAAAAAgAAAAAAAAAAAACAABgAAAOABAAAAAAAAAAAAAAAQAkIUVSmGBmktp3Bl5my9Fb_WV6v2bcBKA25hMlIAWgBgAGi4jfglcAA'; 

const hubspotClient = new hubspot.Client({ accessToken: ACCESS_TOKEN });


//random contacts 

async function createContacts() {
  const contacts = [
    { firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', phone: '555-0101', address: '123 Main St, Boston, MA' },
    { firstname: 'Jane', lastname: 'Smith', email: 'jane.smith@example.com', phone: '555-0102', address: '456 Elm St, Boston, MA' },
    { firstname: 'Alice', lastname: 'Brown', email: 'alice.brown@example.com', phone: '555-0103', address: '789 Oak St, Boston, MA' },
    { firstname: 'Bob', lastname: 'Johnson', email: 'bob.johnson@example.com', phone: '555-0104', address: '101 Pine St, Boston, MA' },
    { firstname: 'Emma', lastname: 'Davis', email: 'emma.davis@example.com', phone: '555-0105', address: '202 Cedar St, Boston, MA' },
    { firstname: 'Michael', lastname: 'Wilson', email: 'michael.wilson@example.com', phone: '555-0106', address: '303 Birch St, Boston, MA' },
    { firstname: 'Sarah', lastname: 'Taylor', email: 'sarah.taylor@example.com', phone: '555-0107', address: '404 Maple St, Boston, MA' },
    { firstname: 'David', lastname: 'Clark', email: 'david.clark@example.com', phone: '555-0108', address: '505 Walnut St, Boston, MA' },
    { firstname: 'Laura', lastname: 'Lewis', email: 'laura.lewis@example.com', phone: '555-0109', address: '606 Chestnut St, Boston, MA' },
    { firstname: 'James', lastname: 'Walker', email: 'james.walker@example.com', phone: '555-0110', address: '707 Spruce St, Boston, MA' },
  ];

  console.log('Creating 10 contacts...');
  for (const contact of contacts) {
    try {
      const apiResponse = await hubspotClient.crm.contacts.basicApi.create({
        properties: {
          firstname: contact.firstname,
          lastname: contact.lastname,
          email: contact.email,
          phone: contact.phone,
          address: contact.address,
        },
      });
      console.log(`Created contact: ${contact.firstname} ${contact.lastname} (ID: ${apiResponse.id})`);
    } catch (error) {
      console.error(`Error creating contact ${contact.firstname} ${contact.lastname}:`, error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
    }
  }

  // verify.

  console.log('Fetching all contacts to verify...');
  try {
    const allContacts = await hubspotClient.crm.contacts.getAll();
    console.log('All contacts:', JSON.stringify(allContacts, null, 2));
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
}

createContacts();
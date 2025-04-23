const hubspot = require('@hubspot/api-client');

const ACCESS_TOKEN = 'CP-6_pXmMhIhAAEDQAAAoQIAAACgBQAAAAAAAAAAAAEgqQAAAAAoItUDGNuk13MguI34JSj-hboFMhQTJt-XUaKePBdBDKv0gQCrMbALATppAAAAQQAAAADA_wMAAAAAAACAAAAAAAAAAAwAIACGAC4A4AEAAAAAAAAA5xkAANACAAAAAAAAAAAAAAAAAAAACAAAAPADAAAAAAAAYA4DBwMAAAAAAAAAAAAAAAAAAADw8ADwAMDhmfljQhQr_CzziTr9VsxS9Bvd9FgFXHT4r0oDbmEyUgBaAGAAaLiN-CVwAA'; 

const hubspotClient = new hubspot.Client({ accessToken: ACCESS_TOKEN });


async function assignProjectRoles() {
    const contactRoles = [
      { id: '114108302047', project_role: 'contractor;home_owner' }, 
      { id: '114117511868', project_role: 'home_owner' }, 
      { id: '113897784043', project_role: 'affiliate;referral_partner' }, 
      { id: '113777006322', project_role: 'referral_partner' },
      { id: '114115672783', project_role: 'community_partner;geo_tech' }, 
      { id: '114112058049', project_role: 'geo_tech' }, 
      { id: '114034958025', project_role: 'contractor' }, 
      { id: '113791410908', project_role: 'affiliate' }, 
      { id: '113897784047', project_role: 'community_partner' }, 
      { id: '114093176541', project_role: 'contractor;referral_partner' }, 
    ];
  
    console.log('Assigning project roles to contacts');
    for (const contact of contactRoles) {
      try {
        const apiResponse = await hubspotClient.crm.contacts.basicApi.update(contact.id, {
          properties: {
            project_role: contact.project_role, 
          },
        });
        console.log(`Updated contact ID ${contact.id} with project_role: ${contact.project_role}`);
      } catch (error) {
        console.error(`Error updating contact ID ${contact.id}:`, error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
      }
    }
  
    console.log('Fetching all contacts to verify my api');
    try {
      const allContacts = await hubspotClient.crm.contacts.getAll(undefined, undefined, ['project_role']);
      console.log('All contacts with project_role:', JSON.stringify(allContacts, null, 2));
    } catch (error) {
      console.error('Error fetching contacts:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
    }
  }
  
  assignProjectRoles();
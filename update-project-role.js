const hubspot = require('@hubspot/api-client');

const ACCESS_TOKEN = 'CP-6_pXmMhIhAAEDQAAAoQIAAACgBQAAAAAAAAAAAAEgqQAAAAAoItUDGNuk13MguI34JSj-hboFMhQTJt-XUaKePBdBDKv0gQCrMbALATppAAAAQQAAAADA_wMAAAAAAACAAAAAAAAAAAwAIACGAC4A4AEAAAAAAAAA5xkAANACAAAAAAAAAAAAAAAAAAAACAAAAPADAAAAAAAAYA4DBwMAAAAAAAAAAAAAAAAAAADw8ADwAMDhmfljQhQr_CzziTr9VsxS9Bvd9FgFXHT4r0oDbmEyUgBaAGAAaLiN-CVwAA'; 

const hubspotClient = new hubspot.Client({ accessToken: ACCESS_TOKEN });

async function updateProjectRoleProperty() {
  try {
    
   
    const properties = await hubspotClient.crm.properties.coreApi.getAll('CONTACT');
    const projectRoleProperty = properties.results.find(prop => prop.name === 'project_role');

    // Delete existing one..

    if (projectRoleProperty) {
      console.log('Deleting existing "Project Role" property...');
      await hubspotClient.crm.properties.coreApi.archive('CONTACT', 'project_role');
      console.log('Existing property deleted.');
    } else {
      console.log('No existing "Project Role" property found.');
    }

    // Create new multiple select property
    console.log('Creating new "Project Role" multiple select property...');
    const newProperty = {
      name: 'project_role',
      label: 'Project Role',
      type: 'enumeration',
      fieldType: 'checkbox',      // **
      groupName: 'contactinformation',
      options: [
        { label: 'Contractor', value: 'contractor', displayOrder: 1 },
        { label: 'Home Owner', value: 'home_owner', displayOrder: 2 },
        { label: 'Affiliate', value: 'affiliate', displayOrder: 3 },
        { label: 'Referral Partner', value: 'referral_partner', displayOrder: 4 },
        { label: 'Community Partner', value: 'community_partner', displayOrder: 5 },
        { label: 'Geo Tech', value: 'geo_tech', displayOrder: 6 },
      ],
      formField: true,
      description: 'Roles associated with the contact in projects.',
    };

    const createResponse = await hubspotClient.crm.properties.coreApi.create('CONTACT', newProperty);
    console.log('Created property:', JSON.stringify(createResponse, null, 2));

    // Verify..
    console.log('Fetching all contact properties to verify now.....');
    
    const updatedProperties = await hubspotClient.crm.properties.coreApi.getAll('CONTACT');
    const verifiedProperty = updatedProperties.results.find(prop => prop.name === 'project_role');
    if (verifiedProperty) {
      console.log('Verified: Project Role property exists:', JSON.stringify(verifiedProperty, null, 2));
    } else {
      console.error('Verification failed: Project Role property not found.');
    }
  } catch (error) {
    console.error('Error updating/creating property:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
}

updateProjectRoleProperty();
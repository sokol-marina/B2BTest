
const fetch = require('node-fetch'); // Node.js

function fetchDataLayer() {
    const dataLayerUrl = 'https://np.a.nytimes.com/svc/nyt-secure/testing/set-cookie';
    const key = 'x-jkidd-auth';
    const value = 'hvs.CAESIHkPvrEBdWRi5KbFp3PkuHrnQvLr44H8I1Z6584kOOuhGiQKHGh2cy5wWHlKYkRmZWVzSzZ4MGxVSHAzeGxERlAQ1Pj87gE';
  
    const headers = new Headers();
    headers.append(key, value);
  
    const requestOptions = {
      method: 'GET',
      headers: headers
    };
  
    try {
      const response =  fetch(dataLayerUrl, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch data layer');
      }
  
      const data =  response.json();
      return data;
    } catch (error) {
      console.error('An error occurred:', error);
      return null; // You can handle the error as needed
    }
  }

  module.exports = new fetchDataLayer;
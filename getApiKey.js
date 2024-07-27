import axios from 'axios';

export const getApiKey = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api-key');
    return response.data.apiKey;
  } catch (error) {
    console.error('Error fetching API key:', error);
    return null;
  }
};

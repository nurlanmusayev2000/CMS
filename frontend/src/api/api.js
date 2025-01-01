import axios from 'axios';
const API_URL = "http://localhost:5000/api/words"

export const getWords = async () =>
{
	try
	{
		const response = await axios.get( API_URL );
		return response.data;
	} catch ( error )
	{
		console.error( 'error fetch data', error );
		return [];

	}
};
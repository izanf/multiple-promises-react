const API_URL = (endpoint) => `https://gateway.marvel.com:443/v1/public/${endpoint}?apikey=${process.env.REACT_APP_API_KEY}`

export const getCharacters = async () => {
  const response = await fetch(API_URL('characters'))

  return response.json()
}

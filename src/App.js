import { useCallback, useEffect, useState } from 'react'
import { getCharacters } from './services'

function App() {
  const [characters, setCharacters] = useState([])

  const fetchComics = async (comicUrl) => {
    const response = await fetch(comicUrl)

    return response.json()
  }

  const fetchCharacters = useCallback(async () => {
    const { data: { results } } = await getCharacters()
    const toFetch = [results[1]]

    const charactersWithComics = toFetch.map(async (character) => {
      const comicsPromise = character.comics.items.map(async (comic) => {
        const res = await fetchComics(`${comic.resourceURI}?apikey=${process.env.REACT_APP_API_KEY}`)

        return res
      })

      const comics = await Promise.all(comicsPromise)
      return ({ ...character, comics: comics.map((comic) => comic.data.results[0]) })
    })

    
    Promise.all(charactersWithComics).then(values => {
      setCharacters(values)
    })
  }, [])

  useEffect(() => {
    fetchCharacters()
  }, [fetchCharacters])

  return (
    <div className="App">
      {characters?.map((character) => (
        <article key={`character-${character.id}`}>
          <header>
            <h2>Name: {character.name}</h2> 
          </header>
          <h3>Comics: </h3>
          <ul>
            {character.comics.map(({ id, title, urls }) => (
              <li key={`comic-${id}`}><a href={urls.find(url => url.type === 'detail').url}>{title}</a></li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export default App;

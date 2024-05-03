"use strict"

// max number of pokemon list
const MAX_POKEMON = 151;

const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

// Initialisiere ein leeres Array, um die abgerufenen Pokémon-Daten zu speichern.
let allPokemons = [];

// Verwende die Fetch-API, um Daten asynchron von der PokeAPI abzurufen.
// Ersetzt `MAX_POKEMON` durch die gewünschte Anzahl an Pokémon-Einträgen, die man erhalten möchte.
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => { // Die Fetch-API gibt ein Promise zurück, das hier verarbeitet wird.
    // Konvertiere die HTTP-Antwort in ein JSON-Objekt.
    return response.json();
  })
  .then((data) => { // Ein weiteres Promise, das die JSON-Daten verarbeitet, sobald sie verfügbar sind.
    // Speichere die Pokémon-Daten, die sich im `results`-Array des JSON-Objekts befinden, in `allPokemons`.
    allPokemons = data.results;
    displayPokemons(allPokemons); // Aufruf displayPokemons um alle anzuzeigen
  })
  // Füge einen Fehler-Handler hinzu, um Probleme wie Netzwerkfehler oder fehlende Berechtigungen zu behandeln.
  .catch((error) => {
    // Logge Fehlermeldungen, falls beim Abrufen der Daten Probleme auftreten.
    console.error('Error fetching data:', error);
  });



/**
 * Asynchronously fetches data about a specific Pokémon and its species from the PokeAPI before performing a redirect.
 * This function is designed to ensure that all necessary Pokémon data is loaded before the application proceeds.
 * 
 * @param {*} id 
 * @returns {Promises<boolean>} 
 */
async function fetchPokemonDataBeforeRedirect(id) {
    try{
        const [pokemon, pokemonSpecies] = await Promise
            .all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                .then((res) => 
                    res.json()
                ),
                fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
                .then((res) => 
                    res.json()
                    ),
    ])
    return true // Return true if both fetch operations were successful
    } catch (error){
        console.log("Failed to Fetch Pokemon data before redirect")
    }
  }

/**
 * 
 * Displays a list of Pokémons on the webpage by dynamically creating HTML elements for each Pokémon.
 * Each Pokémon is represented by a div that includes its image, ID number, and name. Clicking on a Pokémon's div triggers
 * a fetch operation to load detailed data and redirects to a detail page if successful.
 *
 * @param {Array} pokemon 
 */
function displayPokemons(pokemon){
    listWrapper.innerHTML = "";

    pokemon.forEach((pokemon) => {
        const pokemonId = pokemon.url.split("/")[6]; 
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">${pokemonId}</p>
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt=${pokemonId.name} />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">${pokemon.name}</p>
            </div>
        
        `;
        //takes us to the detail page
        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonId);
            if (success) {
                window.location.href = `./detail.html?id=${pokemonId}`;
            }
        })

        listWrapper.appendChild(listItem);
    });
}

// call event listener for the search bar
searchInput.addEventListener("keyup", handleSearch);


/**
 * Handles real-time search functionality in the Pokedex application.
 * This function triggers whenever the user types in the search input field, 
 * filtering the displayed list of Pokémon either by their names or numbers based on the user's input.
 *
 * @param {none} - This function does not take parameters.
 * @returns {void} - It does not return anything.
 *
 */
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;
  
    if (numberFilter.checked) {
      filteredPokemons = allPokemons.filter((pokemon) => {
        const pokemonId = pokemon.url.split("/")[6];
        return pokemonId.startsWith(searchTerm);
      });
    } else if (nameFilter.checked) {
      filteredPokemons = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().startsWith(searchTerm)
      );
    } else {
      filteredPokemons = allPokemons;
    }
  
    displayPokemons(filteredPokemons);
  
    if (filteredPokemons.length === 0) {
      notFoundMessage.style.display = "block";
    } else {
      notFoundMessage.style.display = "none";
    }
  }

  
  // clear search input, when click on search-close-button
  const closeButton = document.querySelector(".search-close-icon");

  closeButton.addEventListener("click", clearSearch => {
    searchInput.value = "";
    displayPokemons(allPokemons);
    notFoundMessage.style.display = "none";
  });





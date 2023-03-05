let url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=40";
let lastCard;
let intersectionScrollInfinite;

const getPokemons = async () => {
    const requiredPokes = await fetch(url);
    const result = await requiredPokes.json();

    url = result.next;

    const pokes = result.results

    
    const pokemons = await Promise.all(pokes.map(async poke => {
        const resp = await fetch(poke.url);
        return resp.json();
    }));
    

    return pokemons;
}

const pokesContainer = document.querySelector("#pokes-container");

const showPokeCards = async () => {
    const loadEl = document.querySelector("#loading-poke-container");
    loadEl.classList.remove("hidden");
    const pokemons = await getPokemons();
    loadEl.classList.add("hidden");

    pokemons.forEach(pokemon => {
        const types = pokemon.types.map(({type}) => type.name);

        const pokeCardView = `
            <a href="pages/pokemon/?id=${pokemon.id}" class="card ${types[0]}" >
                <header class="card-header">
                    <img src="${pokemon.sprites.other.home.front_default}" alt="">
                    <p class="poke-name">${pokemon.id} - ${pokemon.name}</p>
                </header>
                <div class="types">
                    ${types.reduce((acc, cur) => {
                        return acc + `<p>${cur}</p>`
                    }, "")}
                </div>
            </a>
        `;
        pokesContainer.innerHTML += pokeCardView;
    })

    addEventToShowMorePokemons();
}


const addEventToShowMorePokemons = () => {
    lastCard = document.querySelector("#pokes-container > a:last-child");
    
    if ( intersectionScrollInfinite != undefined ) {
        intersectionScrollInfinite.disconnect();
    }
    
    intersectionScrollInfinite = new IntersectionObserver((entries) => {
        if (entries.some(entrie => entrie.isIntersecting)) {
            showPokeCards();;
        }
    });

    intersectionScrollInfinite.observe(lastCard);

}

showPokeCards();
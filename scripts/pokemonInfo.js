const url = new URL(location.href);
console.log(url.searchParams.get("id"));
const id = url.searchParams.get("id");

if (!id) {
    location.href = "/";
}

const container = document.querySelector("#container");

const getPokeInfo = async () => {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const dataJson = await data.json();
    console.log(dataJson);
    
    return dataJson;
}

const setView = () => {
    getPokeInfo()
    .then(pokeInfo => {
        console.log(pokeInfo)
        const view = `
            <div>
                <img src="${pokeInfo.sprites.other.home.front_default}" class="poke-image">
                <p>${pokeInfo.name}</p>
            </div>
            <div class="stats" >
                ${pokeInfo.stats.reduce((acc, cur) => {
                    const stat = `
                        <div class="stat"  >
                            ${cur.stat.name}
                            <div style="width: ${cur.base_stat}px"></div>
                        </div>`
                    return acc + stat;
                }, "")}
            </div>
        `;
        container.innerHTML = view
    })
}

setView();
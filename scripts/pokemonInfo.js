const url = new URL(location.href);
const id = url.searchParams.get("id");

if (!id) {
    location.href = "/";
}

const container = document.querySelector("#container");

const teams = JSON.parse(localStorage.getItem("@pokebag:team")) || [{teamId: "default", pokemons: []}];

const getPokeInfo = async () => {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const dataJson = await data.json();
    
    return dataJson;
}

const addPokemonToTeam = () => {
    const teamId = document.querySelector("#teamId").value;
    const teams = JSON.parse(localStorage.getItem("@pokebag:team")) || [];

    if (!teams.some(team => team.teamId == teamId)) {

        localStorage.setItem("@pokebag:team", JSON.stringify([...teams, {
            teamId,
            pokemons: [id]
        }]))

        return;
    }

    localStorage.setItem("@pokebag:team", JSON.stringify(teams.map(team => {
        if (team.teamId == teamId) {
            const pokemons = team.pokemons.some(pokeId => pokeId == id) ? [...team.pokemons] : [...team.pokemons, id]
            return {
                teamId: team.teamId,
                pokemons
            }
        }
        return team
    })))
    
}

const setView = () => {
    getPokeInfo()
    .then(pokeInfo => {
        const view = `
            <div class="${pokeInfo.types[0].type.name}">
                <div class="pokeInfo">
                    <div>
                        <h1 class="pokeName">${pokeInfo.name}<span>#${pokeInfo.id}</span></h1>
                        <div class="pokeTypes">
                            ${pokeInfo.types.reduce((acc, cur) => {
                                const type = `<p>${cur.type.name}</p>`;

                                return acc + type;
                            }, "")}
                        </div>
                    </div>
                    <div class="pokeStats" >
                        <h2>Stats</h2>

                        ${pokeInfo.stats.reduce((acc, cur) => {
                            const stat = `
                                <div class="stat" >
                                    ${cur.stat.name}
                                    <div
                                        class="${cur.stat.name}"
                                        style="width: ${cur.base_stat*3}px"
                                        data-stat="${cur.base_stat}"
                                    ></div>
                                </div>`
                            return acc + stat;
                        }, "")}
                    </div>
                    <div class="pokeAbility" >
                        <h2>Abilities</h2>

                        ${pokeInfo.abilities.reduce((acc, cur) => {
                            const abilities = `
                                <div>
                                    ${cur.ability.name}
                                </div>
                            `;
                            return acc + abilities;
                        }, "")}
                    </div>
                </div>
                <div class="pokeImageContainer">
                    <img src="${pokeInfo.sprites.other.home.front_default}" class="pokeImage">
                </div>
            </div>

            <div class="addPokeToTeam">
                <select id="teamId">
                    ${teams.reduce((acc, cur) => {
                        const el = `<option value="${cur.teamId}">${cur.teamId}</option>`;
                        return acc + el
                    }, "")}
                </select>
                <button onclick="addPokemonToTeam()">Add pokemon to team<button>
            </div>
        `;
        container.innerHTML = view
    })
}

setView();
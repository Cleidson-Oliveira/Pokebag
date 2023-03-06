const container = document.querySelector("#container");

const teams = JSON.parse(localStorage.getItem("@pokebag:team")) || [];

teams.forEach(team => {
    const teamEl = document.createElement("div");
    teamEl.setAttribute("id", "team" + team.teamId);
    teamEl.setAttribute("class", "team");
    container.appendChild(teamEl);

    Promise.all(team.pokemons.map( async poke => {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`);
        return resp.json();
    }))
    .then(pokemons => {
        teamEl.innerHTML += `<h2>${team.teamId}</h2>`
        pokemons.forEach(pokemon => {
            const types = pokemon.types.map(({type}) => type.name);
    
            const pokeCardView = `
                <a href="../pokemon/?id=${pokemon.id}" class="card-team ${types[0]}" >
                    <img src="${pokemon.sprites.other.home.front_default}" alt="">
                    <p class="poke-name">${pokemon.id} - ${pokemon.name}</p>
                </a>
            `;
            teamEl.innerHTML += pokeCardView;
        })
    })

});

const createNewTeam = () => {
    const newTeamText = document.querySelector("#newTeam").value;

    if (!newTeamText) return;

    console.log(newTeamText);

    if (teams.some(team => team.id == newTeamText)) return;

    const newTeam = {
        teamId: newTeamText,
        pokemons: []
    }

    localStorage.setItem("@pokebag:team", JSON.stringify([...teams, newTeam]))

}
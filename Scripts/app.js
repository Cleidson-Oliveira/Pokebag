let url = nextUrl = "https://pokeapi.co/api/v2/pokemon";

let qual = "";

const acessarApi = async url => {
    let require = await fetch(url);
    require = await require.json();
    if(require){
        return require;
    }
}

const montarCarrocel = async () => {
    let carrocel = document.getElementById("carrocel");
    let dadosApi = await acessarApi(nextUrl);
    
    nextUrl = dadosApi.next

    for(let e of dadosApi.results){
        let pokeInfo = await acessarApi(e.url)
        createItem(carrocel, pokeInfo, "carrocel-item")
    };
}

const search = async () => {
    let searchResult = document.getElementById("search-result");
    let textSearched = document.getElementById("textSearched").value;
    let pokeInfo = await acessarApi(`${url}/${textSearched}`);
    clear(searchResult);
    createItem(searchResult, pokeInfo, "poke-finded-conteiner")

}

const showDetail = pokeInfo => {
    let detailConteiner = document.getElementById("detail-poke");
    let switchConteiner = document.getElementById("switch-poke-detail");
    switchConteiner.click();
    clear(detailConteiner);
    createItem(detailConteiner, pokeInfo, "detail-poke-conteiner");
    console.log(pokeInfo)
}

const createItem = (conteiner, pokeInfo, classe) => {
    let elementos = [
        getImage(pokeInfo.sprites.other.home.front_default),
        getNameId(pokeInfo.name, pokeInfo.id),
        getType(pokeInfo.types),
        getAbilities(pokeInfo.abilities),
        getStats(pokeInfo.stats)
    ]

    if(pokeInfo){
        let item = document.createElement("div");

        item.classList.add(classe);
        item.classList.add(pokeInfo.types[0].type.name);

        item.addEventListener("click", async e => {
            targetClass = e.target.classList;
            switch (targetClass[0]) {
                case "ability":
                    let abilityInfo = await acessarApi(`https://pokeapi.co/api/v2/ability/${e.target.innerHTML}`)
                    if (abilityInfo) {
                        showDetailAbility(abilityInfo);
                    }
                    break;
            
                default:
                    showDetail(pokeInfo);
                    break;
            }
        })

        for(let el of elementos){
            item.appendChild(el);
        }

        conteiner.appendChild(item);
    }
}

const getImage = urlImage => {
    let image = document.createElement("div");

    image.classList.add("poke-image");
    image.innerHTML = `<img src='${urlImage}'>`;

    return image;
}

const getNameId = (name, id) => {
    let nome = document.createElement("div");

    nome.classList.add("poke-name-id");
    nome.innerHTML = `<p>N° ${id} ${name.toUpperCase()}</p>`;

    return nome;
}

const getType = types => {
    let type = document.createElement("div");

    type.classList.add("poke-types");
    types.forEach(tipo => {
        type.innerHTML += `<div><p class='type captalise'>${tipo.type.name}</p></div>`;
    })

    return type;
}

const getAbilities = abilities => {
    let habilidades = document.createElement("div");

    habilidades.classList.add("poke-abilities");
    abilities.forEach(habilidade => {
        habilidades.innerHTML += `<div><p class='ability captalise'>${habilidade.ability.name}</p></div>`;
    })

    return habilidades;
}

const getStats = stats => {
    let statsPoke = document.createElement("div");

    statsPoke.classList.add("poke-stats");
    statsPoke.innerHTML = "<div><p>Stats</p></div>";

    stats.forEach(stat=>{
        let x = document.createElement("div");
        
        x.classList.add(stat.stat.name);
        x.innerHTML = `<p>${stat.base_stat}</p>`;
        x.style.height = stat.base_stat + "px";

        statsPoke.appendChild(x);
    })
    return statsPoke;
}

const showDetailAbility = abilityInfo => {
    let detailConteiner = document.getElementById("detail-ability");
    let switchConteiner = document.getElementById("switch-ability-detail");
    switchConteiner.click();
    clear(detailConteiner);
    
    let nome = document.createElement("div");
    nome.innerHTML = `<p>${abilityInfo.name.toUpperCase()}</p>`;

    let description = document.createElement("div");
    abilityInfo.effect_entries.forEach(textDescription => {
        if(textDescription.language.name == "en"){
            description.innerHTML = `<p>${textDescription.short_effect}</p>`;
        }
    })

    let pokes = document.createElement("div");

    abilityInfo.pokemon.forEach(poke => {
        pokes.innerHTML += `<div><p>${poke.pokemon.name.toUpperCase()}</p></div>`;
    })

    detailConteiner.appendChild(nome);
    detailConteiner.appendChild(description);
    detailConteiner.appendChild(pokes);

}

const carrocelScroll = () => {
    let carrocel = document.getElementById("carrocel");
    if(Math.round(carrocel.scrollLeft) >= carrocel.scrollWidth - carrocel.offsetWidth){
        montarCarrocel();
    }
}

const clear = element => {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

montarCarrocel()
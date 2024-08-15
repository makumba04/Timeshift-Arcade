// -- Data-fetching functions: Call the index.js route to send the request and fetch the data to send it to the Data-showing functions
function searchUserGames(user_id) {
    fetch(`http://localhost:3000/user_linked_games/${user_id}`)
    .then(response => response.json())
    .then(data => {
        showUserGames(data);
    })
    .catch(error => console.error('Error:', error));
}

function searchGamesByName() {

    var gameName = document.getElementById('input_name').value;

    if (gameName == '') {
        window.location.href = '/allGames';
    } else {

        fetch(`http://localhost:3000/gameByName/${gameName}`)
        .then(response => response.json())
        .then(data => {
            showGamesByName(data);
        })
        .catch(error => console.error('Error:', error));
    }
}

// Data-showing functions: Receive all data from the Data-fetching functions and elaborate tables to show the resulting data

function showUserGames(games) {

    var linked_games = document.getElementById('profile-linked-games');

    if (games.length > 0) {
        
        games.forEach(game => {

            var section_game_block = document.createElement('section');
            var div_game_desc = document.createElement('div');
            var img_game_image = document.createElement('img');
            var div_game_desc_txt = document.createElement('div');
            var h3 = document.createElement('h3');
            var p = document.createElement('p');
            var a = document.createElement('a');
            var button = document.createElement('button');

            section_game_block.classList.add('game-block');
            div_game_desc.classList.add('game-desc');
            img_game_image.classList.add('game-image');
            div_game_desc_txt.classList.add('game-desc-txt');

            h3.text = `${game.game_name}`;
            p.text = `${game.game_description}`;
            a.href = `/games/${game.game_id}`;
            button.text = 'Play';

            a.append(button);

            div_game_desc_txt.append(h3);
            div_game_desc_txt.append(p);
            div_game_desc_txt.append(a);

            div_game_desc.append(img_game_image);
            div_game_desc.append(div_game_desc_txt);

            section_game_block.append(div_game_desc_txt);

            linked_games.appendChild(section_game_block);
        })
    } else {

        const p_no_games = document.createElement('p');
        const text = "No games were found...";
        p_no_games.append(text);

        linked_games.style.display = 'flex';
        linked_games.style.justifyContent = 'center';
        linked_games.style.alignItems = 'center';
        linked_games.append(p_no_games);
    }
}

function showGamesByName(games) {

    var gamesContainer = document.getElementById('games-container');

    gamesContainer.innerHTML = '';

    if(games.length > 0) {
        
        games.forEach(game => {

            var section_game_block = document.createElement('section');
            var div_game_desc = document.createElement('div');
            var img_game_image = document.createElement('img');
            var div_game_desc_txt = document.createElement('div');
            var h3 = document.createElement('h3');
            var p = document.createElement('p');
            var a = document.createElement('a');
            var button = document.createElement('button');

            section_game_block.classList.add('game-block');
            div_game_desc.classList.add('game-desc');
            img_game_image.classList.add('game-image');
            div_game_desc_txt.classList.add('game-desc-txt');

            img_game_image.src = `${game.cover_path}`;
            h3.innerHTML = `${game.game_name}`;
            p.innerHTML = `${game.game_description}`;
            a.href = `/games/${game.game_id}`;
            button.innerHTML = 'Play';

            a.appendChild(button);

            div_game_desc_txt.append(h3);
            div_game_desc_txt.append(p);
            div_game_desc_txt.append(a);

            div_game_desc.append(img_game_image);
            div_game_desc.appendChild(div_game_desc_txt);

            section_game_block.appendChild(div_game_desc);
            gamesContainer.appendChild(section_game_block);
        })
    } else {
        
        gamesContainer.innerHTML = '';

        const p_no_games = document.createElement('p');
        const text = "No games were found...";
        p_no_games.append(text);

        gamesContainer.style.display = 'flex';
        gamesContainer.style.justifyContent = 'center';
        gamesContainer.style.alignItems = 'center';
        gamesContainer.appendChild(p_no_games);
    }
}

function showAllGamesList(games) {

    var gamesContainer = document.getElementById('games-container');

    gamesContainer.innerHTML = '';

    if(games.length > 0) {
        
        games.forEach(game => {

            var section_game_block = document.createElement('section');
            var div_game_desc = document.createElement('div');
            var img_game_image = document.createElement('img');
            var div_game_desc_txt = document.createElement('div');
            var h3 = document.createElement('h3');
            var p = document.createElement('p');
            var a = document.createElement('a');
            var button = document.createElement('button');

            section_game_block.classList.add('game-block');
            div_game_desc.classList.add('game-desc');
            img_game_image.classList.add('game-image');
            div_game_desc_txt.classList.add('game-desc-txt');

            img_game_image.src = `${game.cover_path}`;
            h3.innerHTML = `${game.game_name}`;
            p.innerHTML = `${game.game_description}`;
            a.href = `/games/${game.game_id}`;
            button.innerHTML = 'Play';

            a.appendChild(button);

            div_game_desc_txt.append(h3);
            div_game_desc_txt.append(p);
            div_game_desc_txt.append(a);

            div_game_desc.append(img_game_image);
            div_game_desc.appendChild(div_game_desc_txt);

            section_game_block.appendChild(div_game_desc);
            gamesContainer.appendChild(section_game_block);
        })
    } else {
        
        gamesContainer.innerHTML = '';

        const p_no_games = document.createElement('p');
        const text = "No games were found...";
        p_no_games.append(text);

        gamesContainer.style.display = 'flex';
        gamesContainer.style.justifyContent = 'center';
        gamesContainer.style.alignItems = 'center';
        gamesContainer.appendChild(p_no_games);
    }
}
// -- Data-fetching functions: Call the index.js route to send the request and fetch the data to send it to the Data-showing functions
function searchAllCategories() {
    fetch(`http://localhost:3000/admin_panel_categories`)
    .then(response => response.json())
    .then(data => {
        showAllCategories(data);
    })
    .catch(error => console.error('Error:', error));
}

function searchAllGames() {
    fetch(`http://localhost:3000/admin_panel_games`)
    .then(response => response.json())
    .then(data => {
        showAllGames(data);
    })
    .catch(error => console.error('Error:', error));
}

function searchAllUsers() {
    fetch(`http://localhost:3000/admin_panel_users`)
    .then(response => response.json())
    .then(data => {
        showAllUsers(data);
    })
    .catch(error => console.error('Error:', error));
}

function searchUserGames(user_id) {
    fetch(`http://localhost:3000/user_linked_games/${user_id}`)
    .then(response => response.json())
    .then(data => {
        showUserGames(data);
    })
    .catch(error => console.error('Error:', error));
}

function searchGamesByName(gameName) {

    var gameName = document.getElementById('input_name').value;

    if (gameName == '') {

        fetch(`http://localhost:3000/getAllGames`)
        .then(response => response.json())
        .then(data => {
            showAllGamesList(data);
        })
        .catch(error => console.error('Error:', error));
    } else {

        fetch(`http://localhost:3000/gameByName/${gameName}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showGamesByName(data);
        })
        .catch(error => console.error('Error:', error));
    }
}

// Data-showing functions: Receive all data from the Data-fetching functions and elaborate tables to show the resulting data

function showAllCategories(categories) { // SOLO ADMIN PANEL
    
    const headers = [
        "ID", "Name", "Description", "Actions"
    ]

    var container = document.getElementById('content-table');
    container.innerHTML = '';

    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tr_thead = document.createElement('tr');
    var tbody = document.createElement('tbody');
    var a_create_btn = document.createElement('a');

    headers.forEach(header => {
        var th = document.createElement('th');
        th.textContent = header;
        tr_thead.appendChild(th);
    });

    thead.appendChild(tr_thead);
    table.appendChild(thead);

    categories.forEach(category => {
        
        var tr_body = document.createElement('tr');

        tr_body.innerHTML = `<td>${category.category_id}</td><td>${category.category_name}</td><td>${category.category_description}</td><td class="admin-panel-actions"><a href='/admin_panel_categories/edit/${category.category_id}'><button id="edit-btn">Edit</button></a><a href='/admin_panel_category/delete/confirm/${category.category_id}'><button id="delete-btn">Delete</button></a></td>`;
        tbody.appendChild(tr_body);
    })

    table.appendChild(tbody);
    table.style.marginBottom = '45px';
    
    a_create_btn.innerHTML = `<button class="create-btn">Add new category</button>`;
    a_create_btn.href = `/admin_panel_category/create`;
    a_create_btn.classList.add('create-btn');

    container.appendChild(table);
    container.appendChild(a_create_btn)
}

function showAllGames(games) { // SOLO ADMIN PANEL

    const headers = [
        "ID", "Category Type", "Name", "Actions"
    ]

    var container = document.getElementById('content-table');
    container.innerHTML = '';
    
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tr_thead = document.createElement('tr');
    var tbody = document.createElement('tbody');
    var a_create_btn = document.createElement('a');

    headers.forEach(header => {
        var th = document.createElement('th');
        th.textContent = header;
        tr_thead.appendChild(th);
    });

    thead.appendChild(tr_thead);
    table.appendChild(thead);

    games.forEach(game => {
        
        var tr_body = document.createElement('tr');

        tr_body.innerHTML = `<td>${game.game_id}</td><td>${game.category_name}</td><td>${game.game_name}</td><td class="admin-panel-actions"><a href='/admin_panel_games/edit/${game.game_id}'><button id="edit-btn">Edit</button></a><a href='/admin_panel_games/delete/confirm/${game.game_id}'><button id="delete-btn">Delete</button></a></td>`;
        tbody.appendChild(tr_body);
    })

    table.appendChild(tbody);
    table.style.marginBottom = '45px';

    a_create_btn.innerHTML = `<button class="create-btn">Add new game</button>`;
    a_create_btn.href = `/admin_panel_games/create`;
    a_create_btn.classList.add('create-btn');

    container.appendChild(table);
    container.appendChild(a_create_btn);
}

function showAllUsers(users) { // SOLO ADMIN PANEL

    const headers = [
        "ID", "Name", "Role Level", "Actions"
    ]

    var container = document.getElementById('content-table');
    container.innerHTML = '';
    
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tr_thead = document.createElement('tr');
    var tbody = document.createElement('tbody');
    var a_create_btn = document.createElement('a');

    headers.forEach(header => {
        var th = document.createElement('th');
        th.textContent = header;
        tr_thead.appendChild(th);
    });

    thead.appendChild(tr_thead);
    table.appendChild(thead);

    users.forEach(user => {
        
        var tr_body = document.createElement('tr');

        if(user.user_id == 1) {

            tr_body.innerHTML = `<td>${user.user_id}</td><td>${user.username}</td><td>${user.user_role}</td><td></td>`;
        } else {
            tr_body.innerHTML = `<td>${user.user_id}</td><td>${user.username}</td><td>${user.user_role}</td><td class="admin-panel-actions"><a href='/admin_panel_users/edit/${user.user_id}'><button id="edit-btn">Edit</button></a></form><a href="/admin_panel_users/delete/confirm/${user.user_id}"><button id="delete-btn">Delete</button></a></form></td>`;
        }

        tbody.appendChild(tr_body);
    })

    table.appendChild(tbody);
    table.style.marginBottom = '45px';

    a_create_btn.innerHTML = `<button class="create-btn">Add new user</button>`;
    a_create_btn.href = `/admin_panel_users/create`;
    a_create_btn.classList.add('create-btn');

    container.appendChild(table);
    container.appendChild(a_create_btn);
}

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
        const text = "There are no linked games";
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
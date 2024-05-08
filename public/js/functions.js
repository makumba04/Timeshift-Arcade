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

// Data-showing functions: Receive all data from the Data-fetching functions and elaborate tables to show the resulting data

function showAllCategories(categories) {
    
    const headers = [
        "ID", "Name", "Description", "Actions"
    ]

    var container = document.getElementById('content-table');
    container.innerHTML = '';

    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tr_thead = document.createElement('tr');
    var tbody = document.createElement('tbody');

    headers.forEach(header => {
        var th = document.createElement('th');
        th.textContent = header;
        tr_thead.appendChild(th);
    });

    thead.appendChild(tr_thead);
    table.appendChild(thead);

    categories.forEach(category => {
        
        var tr_body = document.createElement('tr');

        tr_body.innerHTML = `<td>${category.category_id}</td><td>${category.category_name}</td><td>${category.category_description}</td><td><button onclick="editCategory()">Edit</button><button onclick="deleteCategory()">Delete</button></td>`;
        tbody.appendChild(tr_body);
    })

    table.appendChild(tbody);
    container.appendChild(table);
}

function showAllGames(games) {

    const headers = [
        "ID", "Category Type", "Name", "Actions"
    ]

    var container = document.getElementById('content-table');
    container.innerHTML = '';
    
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tr_thead = document.createElement('tr');
    var tbody = document.createElement('tbody');

    headers.forEach(header => {
        var th = document.createElement('th');
        th.textContent = header;
        tr_thead.appendChild(th);
    });

    thead.appendChild(tr_thead);
    table.appendChild(thead);

    games.forEach(game => {
        
        var tr_body = document.createElement('tr');

        tr_body.innerHTML = `<td>${game.game_id}</td><td>${game.category_type}</td><td>${game.game_name}</td><td><button onclick="editCategory()">Edit</button><button onclick="deleteCategory()">Delete</button></td>`;
        tbody.appendChild(tr_body);
    })

    table.appendChild(tbody);
    container.appendChild(table);
}

function showAllUsers(users) {
    let content_table = document.getElementById('content_table');

    //Add here all the code to generate the tables with the fetched data
}
var userFormEL = document.querySelector("#user-form");
var nameInputEL = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm  = document.querySelector("#repo-search-term");
var languageButtonsEL = document.querySelector("#language-buttons");

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    // console.log(language);
    getFeaturedRepos(language);

    // clear old content
    repoContainerEl.textContent = "";
}

languageButtonsEL.addEventListener("click", buttonClickHandler);

var formSubmitHander = function(event) {
    event.preventDefault();
    /*
    event.preventDefault() stops the browser from performing the default action the event wants it to do. 
    In the case of submitting a form, it prevents the browser from sending the form's input data to a URL, 
    as we'll handle what happens with the form input data ourselves in JavaScript.
    */
    var username = nameInputEL.value.trim();
    if (username) {
        getUserRepos(username);
        nameInputEL.value = '';
    }
    else {
        alert("Please enter a GitHub username");
    }
}

userFormEL.addEventListener("submit", formSubmitHander);

var getUserRepos = function(user) {
    // format the github url
    var apiURL = "https://api.github.com/users/" + user + "/repos";
    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                // The json() method returns another Promise, 
                // hence the extra then() method, whose callback function captures the actual data.
                response.json().then(function(data) {
                    displayRepos(data, user);
                });
            }
            else {
                // 404 error returned as reponse
                alert("Error: GitHub User Not Found");
            }
        })
        .catch(function(error) {
            // Notice this catch is getting chained to the end of the .then
            alert("Unable to connect to GitHub");
        });
};

var displayRepos = function(repos, searchTerm) {
    // console.log(repos);
    // console.log(searchTerm);

    repoSearchTerm.textContent = searchTerm;
    repoContainerEl.textContent = "";

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEL = document.createElement("a");
        repoEL.classList = "list-item flex-row justify-space-between align-center";
        repoEL.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repo name
        var titleEL = document.createElement("span");
        titleEL.textContent = repoName;

        // append to container
        repoEL.appendChild(titleEL);

        // create a status element
        var statusEL = document.createElement("span");
        statusEL.classList = "flex-row align-center";

        // check if current repo has issues or not
        /*
            The font icons used here come from a service called Font Awesome. 
            They offer a large selection of free font icons, including icons for social networks, 
            ike the GitHub logo at the top of the page!
        */
        if (repos[i].open_issues_count > 0) {
            statusEL.innerHTML = 
             "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEL.innerHTML = 
            "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEL.appendChild(statusEL);

        // append container to the DOM
        repoContainerEl.appendChild(repoEL);

    }
}

var getFeaturedRepos = function(language) {
    var apiURL = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiURL)
    .then(function(response) {
        if (response.ok) {
            // console.log(response);
            response.json().then(function(data) {
                // console.log(data);
                displayRepos(data.items, language);
            });
        }
        else {
            alert("Error: GitHub User Not Found");
        }
    });
};
var issueContainerEL = document.querySelector("#issues-container");

var getRepoIssues = function(repo) {
    console.log(repo);
    var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiURL).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayIssues(data);
            });
        }
        else {
            alert("There was a problem with your request!");
        }

    })
}

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEL.textContent = "This repo has no open issues";
        return;
    }
    // loop through issues
    for (var i = 0; i < issues.length; i++) {
        // create link element to take users to the issue on GitHub
        var issueEL = document.createElement("a");
        issueEL.classList = "list-item flex-row justify-space-between align-center";
        issueEL.setAttribute("href", issues[i].html_url);
        issueEL.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEL = document.createElement("span");
        titleEL.textContent = issues[i].title;

        // append to container
        issueEL.appendChild(titleEL);

        // create a type element
        var typeEL = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEL.textContent = "(Pull request";
        }
        else {
            typeEL.textContent = "(Issue)";
        };

        // append to container
        issueEL.appendChild(typeEL);

        // append to page
        issueContainerEL.appendChild(issueEL);
    }
};

getRepoIssues("facebook/react");
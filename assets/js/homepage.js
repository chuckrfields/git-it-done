var getUserRepos = function(user) {
    // format the github url
    var apiURL = "https://api.github.com/users/" + user + "/repos";
    fetch(apiURL).then(function(response) {
        // The json() method returns another Promise, 
        // hence the extra then() method, whose callback function captures the actual data.
        response.json().then(function(data) {
            console.log(data);
        })
      });
};

getUserRepos();
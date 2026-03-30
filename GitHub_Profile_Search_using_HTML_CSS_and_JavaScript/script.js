const API_URL = "https://api.github.com/users/";

// Load axios library
const axiosScript = document.createElement("script");
axiosScript.src = "https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js";
axiosScript.integrity = "sha512-DZqqY3PiOvTP9HkjIWgjO6ouCbq+dxqWoJZ/Q+zPYNHmlnI2dQnbJ5bxAHpAMw+LXRm4D72EIRXzvcHQtE8/VQ==";
axiosScript.crossOrigin = "anonymous";
document.head.appendChild(axiosScript);

const main = document.getElementById("main");
const inputForm = document.getElementById("userInput");
const inputBox = document.getElementById("inputBox");

const userGetFunction = (name) => {
    main.innerHTML = '<div class="loading">Loading...</div>';
    
    axios(API_URL + name)
        .then((response) => {
            userCard(response.data);
            repoGetFunction(name);
        })
        .catch((err) => {
            if (err.response && err.response.status === 404) {
                errorFunction("No profile found with this username");
            } else {
                errorFunction("Error fetching user profile. Please try again.");
            }
        });
};

const repoGetFunction = (name) => {
    axios(API_URL + name + "/repos?sort=created&per_page=5")
        .then((response) => {
            repoCardFunction(response.data);
        })
        .catch((err) => {
            console.error("Error fetching repos:", err);
            errorFunction("Unable to fetch repositories");
        });
};

const userCard = (user) => {
    const userName = user.name || user.login;
    const userBio = user.bio ? `<p class="bio">${user.bio}</p>` : "";
    const userLocation = user.location ? `<p class="location"><strong>📍 Location:</strong> ${user.location}</p>` : "";
    const userCompany = user.company ? `<p class="company"><strong>🏢 Company:</strong> ${user.company}</p>` : "";

    const cardElement = `
        <div class="card">
            <div class="avatar-container">
                <img src="${user.avatar_url}" alt="${userName}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${userName}</h2>
                <p class="login">@${user.login}</p>
                ${userBio}
                ${userLocation}
                ${userCompany}
                <ul class="stats">
                    <li><strong>${user.followers}</strong><span>Followers</span></li>
                    <li><strong>${user.following}</strong><span>Following</span></li>
                    <li><strong>${user.public_repos}</strong><span>Repos</span></li>
                </ul>
                <a href="${user.html_url}" target="_blank" class="github-link">View on GitHub</a>
                <div id="repos"></div>
            </div>
        </div>
    `;
    main.innerHTML = cardElement;
};

const errorFunction = (error) => {
    const errorHTML = `
        <div class="card error-card">
            <h2 class="error-message">❌ ${error}</h2>
        </div>
    `;
    main.innerHTML = errorHTML;
};

const repoCardFunction = (repos) => {
    const reposElement = document.getElementById("repos");
    
    if (!repos || repos.length === 0) {
        reposElement.innerHTML = '<p class="no-repos">No public repositories found</p>';
        return;
    }

    const reposTitle = document.createElement("h3");
    reposTitle.textContent = "Top Repositories";
    reposTitle.className = "repos-title";
    reposElement.appendChild(reposTitle);

    const reposContainer = document.createElement("div");
    reposContainer.className = "repos-container";

    for (let i = 0; i < 5 && i < repos.length; i++) {
        const repo = repos[i];
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.rel = "noopener noreferrer";
        repoEl.title = repo.description || repo.name;
        repoEl.innerHTML = `<span>⭐</span> ${repo.name}`;
        reposContainer.appendChild(repoEl);
    }

    reposElement.appendChild(reposContainer);
};

inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = inputBox.value.trim();
    
    if (user) {
        userGetFunction(user);
        inputBox.value = "";
    }
});
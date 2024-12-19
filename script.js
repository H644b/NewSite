document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });

  // Fetch GitHub pinned projects
  fetchGitHubPinnedProjects();
});

function fetchGitHubPinnedProjects() {
  const username = "H644b"; // Replace with your GitHub username
  const url = "https://api.github.com/graphql";
  const query = `
    {
      user(login: "${username}") {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
  `;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`, // Replace with your GitHub personal access token
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .then((data) => {
      const projectsContainer = document.getElementById("projects-container");
      const repos = data.data.user.pinnedItems.nodes;
      repos.forEach((repo) => {
        const projectCard = document.createElement("div");
        projectCard.className = "project-card";
        projectCard.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description || "No description available."}</p>
          <p>⭐ ${repo.stargazerCount} | 🍴 ${repo.forkCount}</p>
          <p>Language: <span style="color: ${repo.primaryLanguage.color}">${
          repo.primaryLanguage.name
        }</span></p>
          <a href="${repo.url}" target="_blank">View on GitHub</a>
        `;
        projectsContainer.appendChild(projectCard);
      });
    })
    .catch((error) =>
      console.error("Error fetching GitHub pinned projects:", error)
    );
}
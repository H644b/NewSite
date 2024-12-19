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
  fetch("/pinned-repos.json")
    .then((response) => response.json())
    .then((repos) => {
      const projectsContainer = document.getElementById("projects-container");
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

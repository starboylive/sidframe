let allPosts = [];

fetch("posts.json")
.then(res => res.json())
.then(posts => {
  allPosts = posts;
  renderPosts(posts);
});

function renderPosts(posts) {
  const container = document.querySelector(".blog-container");
  container.innerHTML = "";

  posts.forEach(post => {
    const card = document.createElement("div");
    card.classList.add("post-card");

    card.onclick = () => {
      window.location.href = `post.html?id=${post.id}`;
    };


    card.innerHTML = `
      ${post.image ? `<img src="${post.image}" class="post-thumb">` : ""}  
      <h2>${post.title}</h2>
      <p class="date">${post.date}</p>
      <p>${post.excerpt}</p>
      <a class="read-btn" href="post.html?id=${post.id}">Read More</a>
    `;

    container.appendChild(card);
  });
}

// Search Function
document.getElementById("searchInput").addEventListener("input", function() {
  const value = this.value.toLowerCase();
  const filtered = allPosts.filter(post =>
    post.title.toLowerCase().includes(value) ||
    post.excerpt.toLowerCase().includes(value)
  );
  renderPosts(filtered);
});

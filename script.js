let allPosts = [];

function sortPostsById(posts) {
  return [...posts].sort((a, b) => {
    const idA = Number(a.id);
    const idB = Number(b.id);
    if (!Number.isNaN(idA) && !Number.isNaN(idB)) return idB - idA;
    return String(b.id).localeCompare(String(a.id));
  });
}

fetch("posts.json")
.then(res => res.json())
.then(posts => {
  allPosts = sortPostsById(posts);
  renderPosts(allPosts);
});

function renderPosts(posts) {
  const container = document.querySelector(".blog-container");
  container.innerHTML = "";

  const sortedPosts = sortPostsById(posts || []);
  sortedPosts.forEach(post => {
    const card = document.createElement("article");
    card.classList.add("post-card");

    const thumb = post.image ? `<img src="${post.image}" class="post-thumb" alt="${post.title}">` : "";
    const tagsHtml = (post.tags || []).map(t => `<span class=\"tag\">${t}</span>`).join(' ');

    card.innerHTML = `
      <div class="post-row">
        ${thumb}
        <div class="post-body">
          <h2>${post.title}</h2>
          <div class="post-meta">${post.date} · ${post.Author ? post.Author : ''}</div>
          <p class="excerpt">${truncate(post.excerpt || '', 180)}</p>
          <div class="tags">${tagsHtml}</div>
          <a class="read-btn" href="post.html?id=${post.id}">Read More</a>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      const target = e.target;
      if(target && (target.tagName === 'A' || target.closest('a'))) return; // let links work
      window.location.href = `post.html?id=${post.id}`;
    });

    container.appendChild(card);
  });

  // observe cards for reveal animation
  observeCards();
}

function truncate(text, max) {
  if(!text) return '';
  return text.length > max ? text.slice(0, max).trim() + '…' : text;
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

const searchInput = document.getElementById("searchInput"); // your existing search bar
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  // filter posts where any tag matches the search query
  const filteredPosts = allPosts.filter(post =>
    post.tags.some(tag => tag.toLowerCase().includes(query))
  );

  renderPosts(filteredPosts);
});

// clicking on a tag filters posts by that tag
document.addEventListener('click', (e) => {
  const tagEl = e.target.closest('.tag');
  if(!tagEl) return;
  const tag = tagEl.textContent.trim().toLowerCase();
  searchInput.value = tag;
  const filtered = allPosts.filter(p => (p.tags||[]).some(t => t.toLowerCase() === tag));
  renderPosts(filtered);
});

function observeCards(){
  const items = document.querySelectorAll('.post-card');
  if(!('IntersectionObserver' in window)){
    items.forEach(i => i.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent => {
      if(ent.isIntersecting){
        ent.target.classList.add('in-view');
        io.unobserve(ent.target);
      }
    });
  },{threshold:0.12});
  items.forEach(i => io.observe(i));
}

// Mobile nav toggle behavior
document.addEventListener('DOMContentLoaded', ()=>{
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  if(!toggle || !navList) return;

  function setOpen(open){
    toggle.setAttribute('aria-expanded', String(!!open));
    if(open) navList.classList.add('open'); else navList.classList.remove('open');
  }

  toggle.addEventListener('click', (e)=>{
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  // close when clicking outside
  document.addEventListener('click', (e)=>{
    if(!navList.classList.contains('open')) return;
    if(e.target.closest('.navbar')) return;
    setOpen(false);
  });

  // close on Escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') setOpen(false);
  });
});

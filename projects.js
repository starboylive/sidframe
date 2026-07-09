// projects.js - moved from inline script in projects.html
const projectsContainer = document.querySelector('.blog-container');
let allProjects = [];

function loadProjects(){
    console.log('projects.js: loading posts.json');
    if(projectsContainer) projectsContainer.innerHTML = `<p class="no-posts">Loading projects…</p>`;
    fetch('./posts.json')
        .then(r => {
            if(!r.ok) throw new Error('posts.json fetch failed: ' + r.status);
            return r.json();
        })
        .then(posts => {
            // match tags that include 'project' (case-insensitive) to be more flexible
            const projects = posts.filter(p => (p.tags||[]).some(t => t && t.toString().toLowerCase().trim().includes('project')));
            console.log('projects.js: found', projects.length, 'project posts');
            allProjects = projects;
            if(!projects.length){
                // fallback: show all posts so page isn't empty
                console.info('projects.js: no project-tagged posts, showing all posts as fallback');
                if(projectsContainer){
                    const note = document.createElement('p');
                    note.className = 'no-posts';
                    note.textContent = "No project-tagged posts found — showing all posts as fallback.";
                    projectsContainer.innerHTML = '';
                    projectsContainer.appendChild(note);
                }
                allProjects = posts;
                renderProjects(posts);
            } else {
                renderProjects(projects);
            }
        })
        .catch(e => {
            console.error('Could not load posts.json', e);
            if(projectsContainer) projectsContainer.innerHTML = `<div style="padding:1rem; background:#2b2b2b; border-radius:8px; color:#fff;">Error loading posts.json: ${e.message}</div>`;
        });
}

// Global error handler to show any runtime exceptions on the page for debugging
window.addEventListener('error', (ev) => {
    console.error('Runtime error', ev.error || ev.message);
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;left:8px;bottom:8px;background:#ff4d4d;color:#fff;padding:8px;border-radius:6px;z-index:9999;font-size:13px;';
    el.textContent = 'JS error: ' + (ev.error ? ev.error.message : ev.message);
    document.body.appendChild(el);
});

function renderProjects(news){
    if(!projectsContainer) return;
    projectsContainer.innerHTML = '';
    if(!news || news.length === 0){
        projectsContainer.innerHTML = `<p class="no-posts">No projects found.</p>`;
        return;
    }

    news.forEach(article => {
        const img = article.image || 'images/main.png';
        const title = article.title || 'Untitled';
        const desc = article.excerpt || (Array.isArray(article.content) ? (article.content[0].text || '') : '');
        const link = `post.html?id=${article.id || ''}`;

        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <a class="news-media" href="${link}">
              <img src="${img}" class="post-thumb" alt="${title}">
            </a>
            <div class="post-content">
                <h2><a class="news-link" href="${link}">${title}</a></h2>
                <p>${desc}</p>
                <div class="post-meta"><span>${article.Author || ''}</span><span>${article.date || ''}</span></div>
            </div>
        `;
        projectsContainer.appendChild(card);
    });
}

// Search handler
document.addEventListener('input', (e) => {
    if(e.target && e.target.id === 'searchInput'){
        const q = e.target.value.toLowerCase();
        const filtered = allProjects.filter(a => (a.title||'').toLowerCase().includes(q) || (a.excerpt||'').toLowerCase().includes(q) || (a.tags||[]).join(' ').toLowerCase().includes(q));
        renderProjects(filtered);
    }
});

// Initialize
loadProjects();

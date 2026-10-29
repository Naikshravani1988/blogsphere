const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('posts');
const postCount = document.getElementById('postCount');
const formMessage = document.getElementById('formMessage');
const publishBtn = document.getElementById('publishBtn');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function formatDate(value) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

async function loadPosts() {
  postsContainer.innerHTML = '<p class="text-secondary">Loading posts…</p>';
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Could not load posts.');
    const posts = await response.json();
    postCount.textContent = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;
    if (!posts.length) {
      postsContainer.innerHTML = '<div class="empty-state"><h3 class="h5">No stories yet</h3><p class="mb-0">Be the first to publish a post.</p></div>';
      return;
    }
    postsContainer.innerHTML = posts.map(post => `
      <article class="card post-card"><div class="card-body">
        <div class="d-flex justify-content-between gap-3 align-items-start"><h3 class="h5 fw-bold mb-2">${escapeHtml(post.title)}</h3><button class="btn btn-sm delete-btn flex-shrink-0" data-delete="${post.id}" aria-label="Delete ${escapeHtml(post.title)}">Delete</button></div>
        <p class="post-meta mb-3">By <strong>${escapeHtml(post.author)}</strong> · ${escapeHtml(formatDate(post.createdAt))}</p>
        <p class="post-content mb-0">${escapeHtml(post.content)}</p>
      </div></article>`).join('');
  } catch (error) {
    postsContainer.innerHTML = '<div class="alert alert-danger">Unable to load posts. Please refresh the page.</div>';
  }
}

postForm.addEventListener('submit', async event => {
  event.preventDefault();
  formMessage.textContent = '';
  publishBtn.disabled = true;
  publishBtn.textContent = 'Publishing…';
  const post = {
    title: document.getElementById('title').value.trim(),
    author: document.getElementById('author').value.trim(),
    content: document.getElementById('content').value.trim()
  };
  try {
    const response = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(post) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not publish post.');
    postForm.reset();
    formMessage.className = 'small mt-3 text-success';
    formMessage.textContent = 'Your post was published successfully!';
    await loadPosts();
  } catch (error) {
    formMessage.className = 'small mt-3 text-danger';
    formMessage.textContent = error.message;
  } finally {
    publishBtn.disabled = false;
    publishBtn.textContent = 'Publish post';
  }
});

postsContainer.addEventListener('click', async event => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  if (!window.confirm('Are you sure you want to delete this post?')) return;
  button.disabled = true;
  try {
    const response = await fetch(`/api/posts/${button.dataset.delete}`, { method: 'DELETE' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not delete post.');
    await loadPosts();
  } catch (error) {
    alert(error.message);
    button.disabled = false;
  }
});

loadPosts();

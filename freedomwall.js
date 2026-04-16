// ========== SUPABASE CONFIGURATION ==========
const SUPABASE_URL = "https://vcxynradvnlpgnzulrqz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeHlucmFkdm5scGduenVscnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDQ5NjAsImV4cCI6MjA5MTkyMDk2MH0.mlUht7tEIZ0a6mVLpBu3ipoBXpnK82yLnX7ESpK2-a8";

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========== HARDCODED CREDENTIALS (localStorage-based) ==========
const VALID_ACCOUNTS = {
  'xenith0611@gmail.com': 'P@ssw0rd123!',
  'shanti.garlitos@gmail.com': 'P@ssw0rd123!'
};

// ========== DOM ELEMENTS ==========
const authSection = document.getElementById('authSection');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const authError = document.getElementById('authError');
const authLoading = document.getElementById('authLoading');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplayName = document.getElementById('userDisplayName');

const postForm = document.getElementById('postForm');
const postContent = document.getElementById('postContent');
const imageUpload = document.getElementById('imageUpload');
const imageUploadBtn = document.getElementById('imageUploadBtn');
const imageCount = document.getElementById('imageCount');
const imagePreview = document.getElementById('imagePreview');
const submitPostBtn = document.getElementById('submitPostBtn');
const clearFormBtn = document.getElementById('clearFormBtn');
const postError = document.getElementById('postError');
const postLoading = document.getElementById('postLoading');
const charCount = document.getElementById('charCount');

const postsContainer = document.getElementById('postsContainer');
const postCount = document.getElementById('postCount');
const emptyState = document.getElementById('emptyState');

// ========== STATE ==========
let currentUser = null;
let currentUserEmail = null;
let selectedImages = [];

// Pagination
const POSTS_PER_PAGE = 10;
let currentPage = 1;
let totalPostsCount = 0;

// Image Carousel
let carouselStates = {}; // { postId: currentImageIndex }

// Reactions & Comments
const EMOJI_OPTIONS = ['❤️', '😂', '😮', '😢', '🔥', '👏', '💜', '✨'];
let expandedComments = {}; // { postId: true/false }

// ========== AUTHENTICATION (localStorage-based) ==========
async function handleLogin(e) {
  e.preventDefault();
  authError.classList.add('hidden');
  authLoading.classList.remove('hidden');

  try {
    const email = loginEmail.value;
    const password = loginPassword.value;

    // Simple validation
    if (!VALID_ACCOUNTS[email] || VALID_ACCOUNTS[email] !== password) {
      throw new Error('Invalid email or password');
    }

    // Store login in localStorage
    localStorage.setItem('freedomwall_user', JSON.stringify({
      email: email,
      username: email.includes('xenith') ? 'Drae' : 'Ari',
      loginTime: new Date().toISOString()
    }));

    currentUserEmail = email;
    currentUser = {
      email: email,
      username: email.includes('xenith') ? 'Drae' : 'Ari'
    };

    showMainContent();
    loadPosts();
  } catch (error) {
    showError(authError, error.message);
  } finally {
    authLoading.classList.add('hidden');
  }
}

async function handleLogout() {
  try {
    if (autoReloadInterval) clearInterval(autoReloadInterval);
    localStorage.removeItem('freedomwall_user');
    currentUser = null;
    currentUserEmail = null;
    selectedImages = [];
    loginForm.reset();
    postForm.reset();
    imagePreview.innerHTML = '';
    postsContainer.innerHTML = '';
    showAuthSection();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

function checkAuthStatus() {
  try {
    const stored = localStorage.getItem('freedomwall_user');
    if (stored) {
      const user = JSON.parse(stored);
      currentUserEmail = user.email;
      currentUser = user;
      showMainContent();
      loadPosts();
    } else {
      showAuthSection();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    showAuthSection();
  }
}

function showMainContent() {
  authSection.classList.add('hidden');
  mainContent.classList.remove('hidden');
  
  // Display user name
  userDisplayName.textContent = currentUser.username;
}

function showAuthSection() {
  authSection.classList.remove('hidden');
  mainContent.classList.add('hidden');
}

function showError(container, message) {
  container.textContent = message;
  container.classList.remove('hidden');
  setTimeout(() => container.classList.add('hidden'), 5000);
}

// ========== IMAGE HANDLING ==========
imageUploadBtn.addEventListener('click', () => imageUpload.click());

imageUpload.addEventListener('change', (e) => {
  selectedImages = Array.from(e.target.files);
  updateImagePreview();
});

function updateImagePreview() {
  imagePreview.innerHTML = '';
  
  if (selectedImages.length === 0) {
    imageCount.textContent = 'No images selected';
    return;
  }

  imageCount.textContent = `${selectedImages.length} image(s) selected`;

  selectedImages.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.createElement('div');
      preview.className = 'relative group';
      preview.innerHTML = `
        <img src="${e.target.result}" alt="preview" class="w-full h-24 object-cover rounded-lg border border-purple-500/50">
        <button 
          type="button"
          onclick="removeImage(${index})"
          class="absolute top-1 right-1 bg-red-600 hover:bg-red-700 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition"
        >
          ✕
        </button>
      `;
      imagePreview.appendChild(preview);
    };
    reader.readAsDataURL(file);
  });
}

function removeImage(index) {
  selectedImages.splice(index, 1);
  imageUpload.value = '';
  updateImagePreview();
}

// ========== POST HANDLING ==========
postContent.addEventListener('input', (e) => {
  charCount.textContent = e.target.value.length;
});

async function uploadImages() {
  if (selectedImages.length === 0) return [];

  const imageUrls = [];

  for (let i = 0; i < selectedImages.length; i++) {
    const file = selectedImages[i];
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `${currentUserEmail}/${timestamp}-${random}-${file.name}`;

    try {
      const { error } = await supabase.storage
        .from('images')
        .upload(filename, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filename);

      imageUrls.push(data.publicUrl);
    } catch (error) {
      showError(postError, `Failed to upload image: ${file.name}`);
    }
  }

  return imageUrls;
}

async function handlePostSubmit(e) {
  e.preventDefault();
  
  if (!postContent.value.trim()) {
    showError(postError, 'Please write something!');
    return;
  }

  postError.classList.add('hidden');
  postLoading.classList.remove('hidden');
  submitPostBtn.disabled = true;

  try {
    // Upload images first
    const imageUrls = await uploadImages();

    // Create post
    const { error } = await supabase
      .from('posts')
      .insert({
        user_email: currentUserEmail,
        username: currentUser.username,
        content: postContent.value.trim(),
        image_urls: imageUrls
      });

    if (error) throw error;

    // Clear form immediately
    postForm.reset();
    selectedImages = [];
    imagePreview.innerHTML = '';
    imageCount.textContent = 'No images selected';
    charCount.textContent = '0';

    // Reload posts immediately to show new post
    await loadPosts();

  } catch (error) {
    showError(postError, error.message);
  } finally {
    postLoading.classList.add('hidden');
    submitPostBtn.disabled = false;
  }
}

clearFormBtn.addEventListener('click', () => {
  postForm.reset();
  selectedImages = [];
  imagePreview.innerHTML = '';
  imageCount.textContent = 'No images selected';
  charCount.textContent = '0';
});

// ========== LOAD & DISPLAY POSTS ==========
let postSubscription = null;
let autoReloadInterval = null;

async function loadPosts(page = 1) {
  try {
    currentPage = page;
    postsContainer.innerHTML = '<div class="text-center text-purple-300 py-8"><i class="fas fa-spinner fa-spin text-2xl mb-2"></i><p>Loading posts...</p></div>';
    emptyState.classList.add('hidden');

    // Get total count first
    const { count, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false);

    if (countError) throw countError;
    totalPostsCount = count || 0;

    // Calculate offset for pagination
    const offset = (page - 1) * POSTS_PER_PAGE;

    // Get paginated posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + POSTS_PER_PAGE - 1);

    if (error) throw error;

    postCount.textContent = totalPostsCount;

    if (posts.length === 0 && page === 1) {
      postsContainer.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    postsContainer.innerHTML = '';
    emptyState.classList.add('hidden');
    
    posts.forEach(post => {
      const postEl = createPostElement(post);
      postsContainer.appendChild(postEl);
    });

    // Add pagination controls
    addPaginationControls();

    // Start auto-reload for real-time effect
    startAutoReload();
  } catch (error) {
    showError(postError, `Failed to load posts: ${error.message}`);
  }
}

function addPaginationControls() {
  const totalPages = Math.ceil(totalPostsCount / POSTS_PER_PAGE);
  
  if (totalPages <= 1) return; // No pagination needed

  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'flex justify-center items-center gap-3 mt-6 mb-4';
  paginationDiv.innerHTML = `
    <button 
      id="prevPageBtn"
      onclick="loadPosts(${currentPage - 1})"
      class="px-4 py-2 bg-purple-600/60 hover:bg-purple-600 text-white rounded-lg transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
      ${currentPage === 1 ? 'disabled' : ''}
    >
      <i class="fas fa-chevron-left mr-2"></i> Previous
    </button>
    
    <span class="text-purple-200 text-sm">
      Page <span class="font-bold">${currentPage}</span> of <span class="font-bold">${totalPages}</span>
    </span>
    
    <button 
      id="nextPageBtn"
      onclick="loadPosts(${currentPage + 1})"
      class="px-4 py-2 bg-purple-600/60 hover:bg-purple-600 text-white rounded-lg transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
      ${currentPage === totalPages ? 'disabled' : ''}
    >
      Next <i class="fas fa-chevron-right ml-2"></i>
    </button>
  `;
  
  postsContainer.appendChild(paginationDiv);
}

// Auto-reload posts every 3 seconds for real-time effect
function startAutoReload() {
  if (autoReloadInterval) clearInterval(autoReloadInterval);
  
  autoReloadInterval = setInterval(async () => {
    try {
      // Just check if count changed on the first page
      if (currentPage === 1) {
        const { count, error: countError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('is_deleted', false);

        if (countError) throw countError;

        // Only reload if count actually changed
        if (count !== totalPostsCount) {
          loadPosts(1);
        }
      }
    } catch (error) {
      console.error('Auto-reload error:', error);
    }
  }, 2500); // Check every 2.5 seconds
}

function createPostElement(post) {
  const isOwnPost = currentUserEmail === post.user_email;
  
  // Format date in Manila timezone (GMT+8)
  const createdDate = new Date(post.created_at).toLocaleString('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  
  const isEdited = post.updated_at && new Date(post.updated_at) > new Date(post.created_at);
  const updatedDate = new Date(post.updated_at).toLocaleString('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const postDiv = document.createElement('div');
  postDiv.id = `post-${post.id}`;
  postDiv.className = 'bg-black/30 border border-purple-500/50 rounded-xl p-4 md:p-5';

  // Header
  const header = document.createElement('div');
  header.className = 'flex justify-between items-start mb-3 flex-wrap gap-2';
  header.innerHTML = `
    <div>
      <span class="font-bold text-purple-200">${post.username}</span>
      <span class="text-xs text-purple-400 ml-2">${createdDate}</span>
      ${isEdited ? `<span class="text-xs text-yellow-400 ml-2"><i class="fas fa-pen"></i> edited ${updatedDate}</span>` : ''}
    </div>
    ${isOwnPost ? `
      <div class="flex gap-2">
        <button 
          onclick="editPost(${post.id}, '${post.content.replace(/'/g, "\\'")}', '${post.username}')"
          class="text-xs bg-blue-600/60 hover:bg-blue-600 px-2 py-1 rounded transition text-blue-100"
        >
          <i class="fas fa-edit mr-1"></i> Edit
        </button>
        <button 
          onclick="deletePost(${post.id})"
          class="text-xs bg-red-600/60 hover:bg-red-600 px-2 py-1 rounded transition text-red-100"
        >
          <i class="fas fa-trash mr-1"></i> Delete
        </button>
      </div>
    ` : ''}
  `;
  postDiv.appendChild(header);

  // Content
  const contentDiv = document.createElement('p');
  contentDiv.className = 'text-purple-100 mb-3 whitespace-pre-wrap break-words';
  contentDiv.textContent = post.content;
  postDiv.appendChild(contentDiv);

  // Images with Carousel
  if (post.image_urls && post.image_urls.length > 0) {
    const carouselDiv = document.createElement('div');
    carouselDiv.className = 'mb-3';
    carouselDiv.id = `carousel-${post.id}`;
    
    // Initialize carousel state
    if (!carouselStates[post.id]) {
      carouselStates[post.id] = 0;
    }
    
    if (post.image_urls.length === 1) {
      // Single image - no carousel needed
      carouselDiv.innerHTML = `
        <div class="relative group cursor-pointer">
          <img 
            src="${post.image_urls[0]}" 
            alt="Memory" 
            class="w-full h-64 object-cover rounded-lg border border-purple-500/50 hover:border-pink-400 transition"
            onclick="openImageModal('${post.image_urls[0]}')"
          >
        </div>
      `;
    } else {
      // Multiple images - show carousel
      carouselDiv.innerHTML = `
        <div class="relative group">
          <img 
            id="carousel-img-${post.id}"
            src="${post.image_urls[0]}" 
            alt="Memory" 
            class="w-full h-64 object-cover rounded-lg border border-purple-500/50 cursor-pointer hover:border-pink-400 transition"
            data-post-id="${post.id}"
            onclick="openImageModal(this.src)"
          >
          
          <div class="absolute inset-0 flex items-center justify-between px-3 rounded-lg opacity-0 group-hover:opacity-100 transition">
            <button 
              onclick="changeCarouselImage('${post.id}', -1, ${post.image_urls.length})"
              class="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              onclick="changeCarouselImage('${post.id}', 1, ${post.image_urls.length})"
              class="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            ${post.image_urls.map((_, idx) => `
              <div 
                class="w-2 h-2 rounded-full transition ${idx === 0 ? 'bg-pink-400' : 'bg-purple-300/50'}"
                data-dot-${post.id}-${idx}
              ></div>
            `).join('')}
          </div>
          
          <div class="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
            <span id="counter-${post.id}">1</span> / ${post.image_urls.length}
          </div>
        </div>
        
        <!-- Image Grid Thumbnails -->
        <div class="grid grid-cols-5 gap-2 mt-2">
          ${post.image_urls.map((url, idx) => `
            <img 
              src="${url}" 
              alt="Thumbnail ${idx + 1}"
              class="w-full h-16 object-cover rounded border border-purple-500/50 cursor-pointer hover:border-pink-400 transition"
              onclick="setCarouselImage('${post.id}', ${idx}, ${post.image_urls.length})"
            >
          `).join('')}
        </div>
      `;
      
      // Store image URLs in data attribute for the carousel
      carouselDiv.dataset.imageUrls = JSON.stringify(post.image_urls);
    }
    
    postDiv.appendChild(carouselDiv);
  }

  // Reactions Section
  const reactionsDiv = document.createElement('div');
  reactionsDiv.id = `reactions-${post.id}`;
  reactionsDiv.className = 'flex gap-2 flex-wrap mb-3 pb-3 border-b border-purple-500/30';
  reactionsDiv.innerHTML = '<div class="text-xs text-purple-300/60">Loading reactions...</div>';
  postDiv.appendChild(reactionsDiv);

  // Comments Section
  const commentsDiv = document.createElement('div');
  commentsDiv.id = `comments-${post.id}`;
  commentsDiv.className = 'text-sm mb-3';
  commentsDiv.innerHTML = '<div class="text-xs text-purple-300/60">Loading comments...</div>';
  postDiv.appendChild(commentsDiv);

  // Delete indicator
  if (post.is_deleted && post.deleted_at) {
    const deletedDiv = document.createElement('div');
    deletedDiv.className = 'text-xs text-gray-400 italic border-t border-purple-500/30 pt-2 mt-2';
    const deletedDate = new Date(post.deleted_at).toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    deletedDiv.textContent = `🗑️ This post was deleted on ${deletedDate}`;
    postDiv.appendChild(deletedDiv);
  }

  // Load reactions and comments asynchronously with error handling
  setTimeout(async () => {
    try {
      await updateReactionsDisplay(post.id);
      await updateCommentsDisplay(post.id);
    } catch (error) {
      console.error('Error loading reactions/comments for post', post.id, ':', error);
    }
  }, 50);

  return postDiv;
}

function openImageModal(imageUrl) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="relative max-w-2xl w-full">
      <img src="${imageUrl}" alt="Full view" class="w-full rounded-lg">
      <button 
        onclick="this.closest('.fixed').remove()"
        class="absolute top-2 right-2 bg-black/50 hover:bg-black/70 w-8 h-8 rounded-full flex items-center justify-center text-white transition"
      >
        ✕
      </button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function changeCarouselImage(postId, direction, totalImages) {
  // Update index
  carouselStates[postId] = carouselStates[postId] || 0;
  carouselStates[postId] += direction;
  
  if (carouselStates[postId] < 0) {
    carouselStates[postId] = totalImages - 1;
  } else if (carouselStates[postId] >= totalImages) {
    carouselStates[postId] = 0;
  }

  updateCarouselDisplay(postId);
}

function setCarouselImage(postId, index, totalImages) {
  carouselStates[postId] = index;
  updateCarouselDisplay(postId);
}

function updateCarouselDisplay(postId) {
  const carouselDiv = document.getElementById(`carousel-${postId}`);
  if (!carouselDiv) return;

  const imageUrls = JSON.parse(carouselDiv.dataset.imageUrls || '[]');
  const currentIndex = carouselStates[postId];

  // Update main image
  const imgEl = document.getElementById(`carousel-img-${postId}`);
  if (imgEl) {
    imgEl.src = imageUrls[currentIndex];
  }

  // Update counter
  const counter = document.getElementById(`counter-${postId}`);
  if (counter) {
    counter.textContent = currentIndex + 1;
  }

  // Update dots
  carouselDiv.querySelectorAll('[data-dot-' + postId + '-]')?.forEach((dot, idx) => {
    if (idx === currentIndex) {
      dot.className = 'w-2 h-2 rounded-full transition bg-pink-400';
    } else {
      dot.className = 'w-2 h-2 rounded-full transition bg-purple-300/50';
    }
  });
}

// ========== REACTIONS ==========
async function loadReactions(postId) {
  try {
    const { data: reactions, error } = await supabase
      .from('reactions')
      .select('*')
      .eq('post_id', postId);

    if (error) throw error;

    // Group reactions by emoji
    const reactionCounts = {};
    reactions.forEach(reaction => {
      if (!reactionCounts[reaction.emoji]) {
        reactionCounts[reaction.emoji] = [];
      }
      reactionCounts[reaction.emoji].push(reaction.user_email);
    });

    return reactionCounts;
  } catch (error) {
    console.error('Failed to load reactions:', error);
    return {};
  }
}

async function addReaction(postId, emoji) {
  try {
    const { error } = await supabase
      .from('reactions')
      .insert({
        post_id: postId,
        user_email: currentUserEmail,
        username: currentUser.username,
        emoji: emoji
      });

    if (error && !error.message.includes('duplicate')) throw error;

    // Reload reactions display
    const post = document.getElementById(`post-${postId}`);
    if (post) {
      await updateReactionsDisplay(postId);
    }
  } catch (error) {
    console.error('Failed to add reaction:', error);
  }
}

async function removeReaction(postId, emoji) {
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_email', currentUserEmail)
      .eq('emoji', emoji);

    if (error) throw error;

    // Reload reactions display
    await updateReactionsDisplay(postId);
  } catch (error) {
    console.error('Failed to remove reaction:', error);
  }
}

async function updateReactionsDisplay(postId) {
  const reactionsContainer = document.getElementById(`reactions-${postId}`);
  if (!reactionsContainer) return;

  const reactionCounts = await loadReactions(postId);
  
  reactionsContainer.innerHTML = '';

  // Show each reaction as a button
  Object.entries(reactionCounts).forEach(([emoji, userEmails]) => {
    const userReacted = userEmails.includes(currentUserEmail);
    const btn = document.createElement('button');
    btn.className = `reaction-btn px-2 py-1 rounded text-sm transition ${
      userReacted 
        ? 'bg-pink-600/60 text-pink-100' 
        : 'bg-purple-700/40 hover:bg-purple-600 text-purple-200'
    }`;
    btn.innerHTML = `${emoji} ${userEmails.length}`;
    btn.onclick = () => {
      if (userReacted) {
        removeReaction(postId, emoji);
      } else {
        addReaction(postId, emoji);
      }
    };
    reactionsContainer.appendChild(btn);
  });

  // Always add reaction picker button
  const addBtn = document.createElement('button');
  addBtn.className = 'px-2 py-1 rounded text-sm bg-purple-700/40 hover:bg-purple-600 text-purple-200 transition';
  addBtn.innerHTML = '<i class="fas fa-plus"></i>';
  addBtn.onclick = (e) => showEmojiPicker(postId, e);
  reactionsContainer.appendChild(addBtn);
}

function showEmojiPicker(postId, event) {
  event.stopPropagation();
  event.preventDefault();
  
  // Remove existing picker if any
  const existingPicker = document.querySelector('[data-emoji-picker]');
  if (existingPicker) {
    existingPicker.remove();
  }
  
  const picker = document.createElement('div');
  picker.setAttribute('data-emoji-picker', 'true');
  picker.className = 'fixed bg-black/95 border border-pink-500/70 rounded-lg p-3 flex gap-2 z-50 shadow-lg';
  
  // Position picker above the button
  const buttonRect = event.target.getBoundingClientRect();
  picker.style.left = buttonRect.left + 'px';
  picker.style.top = (buttonRect.top - 60) + 'px';
  
  EMOJI_OPTIONS.forEach(emoji => {
    const btn = document.createElement('button');
    btn.textContent = emoji;
    btn.className = 'text-2xl hover:scale-150 hover:text-pink-300 transition cursor-pointer p-1';
    btn.type = 'button';
    btn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      addReaction(postId, emoji);
      picker.remove();
    };
    btn.onmousedown = (e) => e.preventDefault();
    picker.appendChild(btn);
  });

  document.body.appendChild(picker);
  
  // Close picker when clicking outside
  const handleClickOutside = (e) => {
    if (!picker.contains(e.target) && !e.target.closest('[onclick*="showEmojiPicker"]')) {
      picker.remove();
      document.removeEventListener('click', handleClickOutside);
    }
  };
  
  document.addEventListener('click', handleClickOutside);
}

// ========== COMMENTS ==========
async function loadComments(postId) {
  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return comments || [];
  } catch (error) {
    console.error('Failed to load comments:', error);
    return [];
  }
}

async function addComment(postId, content) {
  try {
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_email: currentUserEmail,
        username: currentUser.username,
        content: content
      });

    if (error) throw error;

    // Reload comments display
    await updateCommentsDisplay(postId, true);
  } catch (error) {
    showError(postError, `Failed to add comment: ${error.message}`);
  }
}

async function deleteComment(commentId, postId) {
  if (!confirm('Delete this comment?')) return;

  try {
    const { error } = await supabase
      .from('comments')
      .update({ is_deleted: true })
      .eq('id', commentId);

    if (error) throw error;

    // Reload comments
    await updateCommentsDisplay(postId);
  } catch (error) {
    showError(postError, `Failed to delete comment: ${error.message}`);
  }
}

async function updateCommentsDisplay(postId, expand = false) {
  const commentsContainer = document.getElementById(`comments-${postId}`);
  if (!commentsContainer) return;

  const comments = await loadComments(postId);
  const isExpanded = expandedComments[postId] || expand;

  commentsContainer.innerHTML = '';

  // Show comment count + expand button
  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-2';
  header.innerHTML = `
    <span class="text-xs text-purple-300">${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}</span>
    <button 
      onclick="toggleComments(${postId})"
      class="text-xs text-purple-400 hover:text-purple-300 transition"
    >
      ${isExpanded ? '▼ Hide' : '▶ Show'}
    </button>
  `;
  commentsContainer.appendChild(header);

  if (isExpanded) {
    // Show all comments
    comments.forEach(comment => {
      const commentEl = document.createElement('div');
      commentEl.className = 'bg-black/40 border border-purple-500/30 rounded p-2 mb-2 text-sm';
      commentEl.innerHTML = `
        <div class="flex justify-between items-start mb-1">
          <span class="font-semibold text-purple-200">${comment.username}</span>
          ${comment.user_email === currentUserEmail ? `
            <button 
              onclick="deleteComment(${comment.id}, ${postId})"
              class="text-xs text-red-400 hover:text-red-300 transition"
            >
              ✕
            </button>
          ` : ''}
        </div>
        <p class="text-purple-100">${comment.content}</p>
        <span class="text-xs text-purple-400">${new Date(comment.created_at).toLocaleString('en-US', {
          timeZone: 'Asia/Manila',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}</span>
      `;
      commentsContainer.appendChild(commentEl);
    });

    // Comment input
    const inputDiv = document.createElement('div');
    inputDiv.className = 'mt-2 flex gap-2';
    inputDiv.innerHTML = `
      <input 
        type="text"
        placeholder="Add a comment..."
        class="flex-1 bg-black/30 border border-purple-500/50 rounded px-2 py-1 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-300"
        id="comment-input-${postId}"
        onkeypress="if(event.key==='Enter') addCommentFromInput(${postId})"
      >
      <button 
        onclick="addCommentFromInput(${postId})"
        class="bg-pink-600/60 hover:bg-pink-600 px-2 py-1 rounded text-xs transition text-white"
      >
        Post
      </button>
    `;
    commentsContainer.appendChild(inputDiv);
  } else if (comments.length === 0) {
    // Show "no comments" with easy way to add one
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'text-xs text-purple-300/60 py-2';
    emptyMsg.textContent = 'Be the first to comment!';
    commentsContainer.appendChild(emptyMsg);
  }
}

function toggleComments(postId) {
  expandedComments[postId] = !expandedComments[postId];
  updateCommentsDisplay(postId);
}

function addCommentFromInput(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  if (!input || !input.value.trim()) return;

  addComment(postId, input.value);
  input.value = '';
}

async function editPost(postId, originalContent, username) {
  const newContent = prompt(`Edit your thought:\n\n`, originalContent);
  
  if (newContent === null || newContent.trim() === '') return;
  if (newContent.trim() === originalContent) return;

  try {
    const { error } = await supabase
      .from('posts')
      .update({
        content: newContent.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .eq('user_email', currentUserEmail);

    if (error) throw error;
  } catch (error) {
    showError(postError, `Failed to edit post: ${error.message}`);
  }
}

async function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post? This action is permanent.')) return;

  try {
    const { error } = await supabase
      .from('posts')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', postId)
      .eq('user_email', currentUserEmail);

    if (error) throw error;
  } catch (error) {
    showError(postError, `Failed to delete post: ${error.message}`);
  }
}



// ========== INITIALIZATION ==========
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
postForm.addEventListener('submit', handlePostSubmit);

// Check if user is already logged in
checkAuthStatus();

// ========== PETAL SYSTEM (Copied from app.js) ==========
const petalField = document.getElementById('petal-field');
let activePetals = [];
const petalIcons = ['fas fa-flower', 'fas fa-fan', 'fas fa-seedling', 'fas fa-feather-alt', 'fas fa-heart', 'fas fa-crown', 'fas fa-gem', 'fas fa-moon', 'fas fa-star'];

function createPetal(x = null, y = null) {
  const randIcon = petalIcons[Math.floor(Math.random() * petalIcons.length)];
  const petal = document.createElement('i');
  petal.className = `${randIcon} petal`;
  const size = Math.floor(Math.random() * 22) + 18;
  petal.style.fontSize = size + 'px';
  const hue = 260 + Math.random() * 35;
  petal.style.color = `hsl(${hue}, 75%, 68%)`;
  petal.style.opacity = 0.5 + Math.random() * 0.3;
  petal.style.position = 'fixed';
  petal.style.pointerEvents = 'none';
  petal.style.zIndex = 5;
  petal.style.willChange = 'transform';

  const posX = (x !== null) ? x : Math.random() * window.innerWidth;
  const posY = (y !== null) ? y : Math.random() * window.innerHeight;
  petal.style.left = posX + 'px';
  petal.style.top = posY + 'px';

  const duration = 15 + Math.random() * 10;
  petal.style.animation = `floatPetals ${duration}s ease-in-out infinite`;
  petal.style.transform = `rotate(${Math.random() * 360}deg)`;

  petalField.appendChild(petal);
  activePetals.push(petal);

  setTimeout(() => {
    if (petal && petal.parentNode) {
      petal.remove();
      const idx = activePetals.indexOf(petal);
      if (idx !== -1) activePetals.splice(idx, 1);
    }
  }, (duration + 1) * 1000);
}

// Create petals occasionally
setInterval(() => {
  if (Math.random() > 0.7) createPetal();
}, 800);

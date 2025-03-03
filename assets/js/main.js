// Define base path for GitHub Pages compatibility
const basePath = "https://raw.githubusercontent.com/zdev2/blog/main/";
const repoAPI = "https://api.github.com/repos/zdev2/blog/contents/posts"; // API GitHub untuk folder posts

// Load post metadata and render posts list or individual post
async function loadPosts() {
  const postsContainer = document.getElementById("posts");
  const urlParams = new URLSearchParams(window.location.search);
  const postParam = urlParams.get("post");
  const tagParam = urlParams.get("tag");

  if (postParam) {
    // Load individual post content
    const postContent = await loadPostContent(postParam);
    const postContentContainer = document.getElementById("post-content");
    if (postContentContainer) {
      postContentContainer.innerHTML = postContent;
    } else {
      console.error("Element with id 'post-content' not found.");
    }
  } else {
    // Fetch file list from GitHub
    const postFiles = await fetchPostFiles();
    const posts = await fetchAllPostsMetadata(postFiles);
    const filteredPosts = tagParam ? filterPostsByTag(posts, tagParam) : posts;
    displayPostsList(filteredPosts, postsContainer);
  }
}

// Fetch list of Markdown files from GitHub repo
async function fetchPostFiles() {
  try {
    const response = await fetch(repoAPI);
    if (!response.ok) throw new Error("Failed to fetch post file list");
    const files = await response.json();

    // Filter hanya file .md
    return files
      .filter((file) => file.name.endsWith(".md"))
      .map((file) => file.name);
  } catch (error) {
    console.error("Error fetching post files:", error);
    return []; // Return empty array jika gagal
  }
}

function parseFrontMatter(text) {
  return window["gray-matter"](text); // Akses gray-matter dari window
}

function filterPostsByTag(posts, tag) {
  return posts.filter((post) => post.data.tags && post.data.tags.includes(tag));
}

// Fetch metadata of all posts
async function fetchAllPostsMetadata(postFiles) {
  const posts = [];
  for (const file of postFiles) {
    try {
      const response = await fetch(`${basePath}posts/${file}`);
      if (!response.ok) throw new Error(`Failed to fetch ${file}`);
      const text = await response.text();
      const { content, data } = parseFrontMatter(text);
      data.id = file.split(".")[0]; // Generate ID dari filename
      posts.push({ content, data });
    } catch (error) {
      console.error(`Error fetching post file '${file}':`, error);
    }
  }
  return posts;
}

// Function lainnya tetap sama...

document.addEventListener("DOMContentLoaded", loadPosts);

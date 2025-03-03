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

function parseFrontMatter(markdown) {
  const match = markdown.match(/---\s*([\s\S]*?)\s*---/); // Capture front matter reliably
  const metadata = {};

  if (match) {
    const metaLines = match[1].trim().split("\n");
    metaLines.forEach((line) => {
      const [key, ...value] = line.split(":");
      metadata[key.trim()] = value.join(":").trim();
    });
    // Remove the front matter from the content
    const content = markdown.replace(/---[\s\S]*?---/, "").trim();
    return { content, data: metadata };
  }

  console.log("No front matter found in file."); // Log if no front matter is found
  return { content: markdown, data: metadata }; // Return full content if no front matter
}


function filterPostsByTag(posts, tagParam) {
  const tags = tagParam.split(",").map((tag) => tag.trim().toLowerCase()); // Split tags and convert to lowercase
  return posts.filter((post) =>
    tags.some((tag) => (post.data.tag || "").toLowerCase().includes(tag))
  );
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

function displayPostsList(posts, container) {
  container.innerHTML = "";
  posts.forEach(({ data }) => {
    const title = data.title || "Untitled";
    const summary = data.summary || "No summary available";

    const postElement = `
      <div class="post">
        <h2><a href="post.html?post=${data.id}">${title}</a></h2>
        <p>${summary}</p>
      </div>`
    ;
    container.innerHTML += postElement;
  });
}

// Load individual post content
async function loadPostContent(postId) {
  try {
    const response = await fetch(`${basePath}/posts/${postId}.md`);
    if (!response.ok) throw new Error(`Failed to load post ${postId}`);
    const text = await response.text();
    const { content, data } = parseFrontMatter(text); // Parse metadata and content
    const md = window.markdownit();

    // Ensure the metadata is correctly accessed and displayed
    return `
      <h1>${data.title || "Untitled"}</h1>
      <p>${data.date || "No date provided"}</p>
      <div>${md.render(content)}</div>`
    ;
  } catch (error) {
    console.error(`Error loading post content for ${postId}:`, error);
    return <p>Failed to load post content.</p>;
  }
}



document.addEventListener("DOMContentLoaded", loadPosts);

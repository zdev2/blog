// Load post metadata and render posts list or individual post
async function loadPosts() {
  const postsContainer = document.getElementById("posts");
  const urlParams = new URLSearchParams(window.location.search);
  const postParam = urlParams.get("post"); // Check for post parameter
  const tagParam = urlParams.get("tag"); // Check for tag parameter

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
    // Load and filter posts by tags if tagParam exists
    const posts = await fetchAllPostsMetadata();
    const filteredPosts = tagParam ? filterPostsByTag(posts, tagParam) : posts;
    displayPostsList(filteredPosts, postsContainer);
  }
}

// Filter posts by tag
function filterPostsByTag(posts, tagParam) {
  const tags = tagParam.split(",").map((tag) => tag.trim()); // Split tags and trim whitespace
  return posts.filter((post) =>
    tags.some((tag) => post.data.tag.includes(tag))
  );
}

// Fetch metadata of all posts
async function fetchAllPostsMetadata() {
  const posts = [];
  const postFiles = ["hello-world.md", "golang-react-url-shortener.md"]; // Add all your post filenames here

  for (const file of postFiles) {
    const response = await fetch(`/posts/${file}`);
    const text = await response.text();
    const { content, data } = parseFrontMatter(text); // Use custom front matter parser
    data.id = file.split(".")[0]; // Generate a simple ID from the filename
    posts.push({ content, data }); // Store both content and metadata
  }
  return posts;
}

// Parse front matter using regex
function parseFrontMatter(markdown) {
  const match = markdown.match(/---\s*([\s\S]*?)\s*---/); // Updated regex to capture front matter more reliably
  const metadata = {};

  if (match) {
    const metaLines = match[1].trim().split("\n");
    metaLines.forEach((line) => {
      const [key, ...value] = line.split(":");
      metadata[key.trim()] = value.join(":").trim();
    });
    // Remove the front matter from the content
    const content = markdown.replace(/---[\s\S]*?---/, "").trim();
    // console.log("Parsed Metadata:", metadata); // Debug log to check parsed metadata
    return { content, data: metadata };
  }

  console.log("No front matter found in file."); // Log if no front matter is found
  return { content: markdown, data: metadata }; // Return full content if no front matter
}

// Display list of posts
function displayPostsList(posts, container) {
  container.innerHTML = "";
  posts.forEach(({ data }) => {
    const title = data.title || "Untitled";
    const summary = data.summary || "No summary available";

    const postElement = `
              <div class="post">
                  <h2><a href="post.html?post=${data.id}">${title}</a></h2>
                  <p>${summary}</p>
              </div>
          `;
    container.innerHTML += postElement;
  });
}

// Load individual post content
async function loadPostContent(postId) {
  const response = await fetch(`/posts/${postId}.md`);
  const text = await response.text();
  const { content, data } = parseFrontMatter(text); // Parse metadata and content
  const md = window.markdownit();

  // Ensure the metadata is correctly accessed and displayed
  return `
        <h1>${data.title || "Untitled"}</h1>
        <p>${data.date || "No date provided"}</p>
        <div>${md.render(content)}</div>
    `;
}

// Initialize on document load
document.addEventListener("DOMContentLoaded", loadPosts);

$(document).ready(function () {
  // Load posts from JSON file
  $.getJSON("src/posts.json", function (posts) {
    // Function to display posts
    function displayPosts() {
      var postsContainer = $("#posts");
      postsContainer.empty();
      posts.forEach(function (post) {
        var postHtml = `
                    <div class="post">
                        <h2><a href="post.html?id=${post.id}">${post.title}</a></h2>
                        <p>${post.content}</p>
                    </div>
                `;
        postsContainer.append(postHtml);
      });
    }

    // Call the function to display posts on page load
    displayPosts();
  });
});

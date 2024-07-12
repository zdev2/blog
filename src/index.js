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
                    <p>${post.date}</p>
                        <h2><a href="post.html?id=${post.id}">${post.title}</a></h2>
                        
                    </div>
                `;
        postsContainer.append(postHtml);
      });
    }

    // Call the function to display posts on page load
    displayPosts();
  });
});

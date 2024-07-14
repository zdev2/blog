$(document).ready(function () {
  // Load posts from JSON file
  $.getJSON("src/posts.json", function (posts) {
    // Function to get URL parameters
    function getUrlParameter(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]([^&#]*)");
      var results = regex.exec(location.search);
      return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    // Get the post ID from the URL
    var postId = getUrlParameter("id");

    // Find the post with the matching ID
    var post = posts.find((p) => p.id === postId);

    // Display the post
    if (post) {
      // Update the document title
      $("title").text("Blog - " + post.title);

      // Add meta tags
      $("head").append(
        '<meta name="description" content="' + post.summary + '">'
      );
      $("head").append('<meta name="author" content="' + post.author + '">');
      $("head").append(
        '<meta name="keywords" content="' + post.tags.join(", ") + '">'
      );

      // Populate the post content
      $("#post-title").text(post.title);
      $("#post-content").html(post.content);
    } else {
      $("#post-title").text("Post not found");
      $("#post-content").html(
        "<p>Sorry, the post you are looking for does not exist.</p>"
      );
    }
  });
});

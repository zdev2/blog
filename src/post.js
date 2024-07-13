$(document).ready(function () {
  // Load posts from JSON file
  $.getJSON("src/posts.json", function (posts) {
    // Function to get URL parameters
    function getUrlParameter(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
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
      $("title").text("Blog - " + post.title);
      $("#post-title").text(post.title);
      $("#post-content").html(`<p>${post.content}</p>`);
    } else {
      $("#post-title").text("Post not found");
      $("#post-content").html(
        "<p>Sorry, the post you are looking for does not exist.</p>"
      );
    }
  });
});

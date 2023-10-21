// https://jsonplaceholder.typicode.com/guide/
const articleContainer = document.querySelector("main")

async function downloadPosts(page = 1) {
  const postsURL = `https://jsonplaceholder.typicode.com/posts?_page=${page}`;
  const response = await fetch(postsURL);
  const articles = await response.json();
  return articles;
}

async function downloadComments(postId) {
  const commentsURL = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
  const response = await fetch(commentsURL);
  const comments = await response.json();
  return comments;
}

async function getUserName(userId) {
  const userURL = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(userURL);
  const user = await response.json();
  return user.name;
}

function getArticleId(comments) {
  const article = comments.previousElementSibling;
  const data = article.dataset;
  return data.postId;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const posts = await downloadPosts(2);
console.log(posts);


posts.forEach(async post =>  { //template string literal for each post
  const userName = await getUserName(post.userId)
    .catch(error => {
      console.error("Error occurred")
      console.log(error)
    })
  const postBody = capitalizeFirstLetter(post.body.replaceAll(/\n/g, "<br>"));
  const postContent = `<article data-post-id=${post.id}>
  <h2>${post.title}</h2>
  <aside>
    <span>${userName}</span>
  </aside>
    ${postBody}
 </article>`
 
  const detailSection = 
  `
  <details class="details">
  <summary>See what our readers had to say...</summary>
    <section class="sections">
      <header>
        <h3>
          Comments
        </h3>
      </header>
    </section>
 </details>
 `
  articleContainer.insertAdjacentHTML("beforeend", postContent)
  articleContainer.insertAdjacentHTML("beforeend", detailSection)
  
  const detail = articleContainer.querySelector(".details:last-of-type"); //get last of type so we dont have to iterate over every detail each time in a forEach
  detail.addEventListener("toggle", async (event) => {
    if (detail.open) {
      const asides = detail.getElementsByTagName("aside")
      const commentsWereDownloaded = asides.length > 0;
      if (!commentsWereDownloaded) {
        const articleId = getArticleId(detail)
        const comments = await downloadComments(articleId);
        const section = detail.querySelector("section")
        comments.forEach(comment => { //template string literal for each comment
          const commentBody = capitalizeFirstLetter(comment.body.replaceAll(/\n/g, "<br>"));
          const commentName = capitalizeFirstLetter(comment.name)
          const commentSection = 
          `<aside>
            ${commentBody}
            <br></br>
            <small>${commentName}</small>
           </aside>
          `
          section.insertAdjacentHTML("beforeend", commentSection)
        })
      }
    }
})
});







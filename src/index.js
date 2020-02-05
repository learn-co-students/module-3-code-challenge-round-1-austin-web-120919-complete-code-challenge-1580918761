const imageId = 4478;

const imageURL = `https://randopic.herokuapp.com/images/${imageId}`;
const likeURL = `https://randopic.herokuapp.com/likes/`;
const commentsURL = `https://randopic.herokuapp.com/comments/`;

const imageTag = document.getElementById('image');
let likes = document.getElementById('likes');
const title = document.getElementById('name');
const commentsList = document.getElementById('comments');
const likeButton = document.getElementById('like_button');
const commentForm = document.getElementById('comment_form');





document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  getImage();

});


function getImage(){
  fetch(imageURL)
  .then(resp => resp.json())
  .then(resp => {
    displayImage(resp);
    likeImage(resp.like_count);
    displayComments(resp.comments);
    addComment();
  })
  .catch(error => console.log(error.message))
};

function displayImage(image){
  
  title.innerText = image.name;

  imageTag.src = image.url;
  
  likes.innerText = image.like_count;

  
}

function likeImage(){
  
  likeButton.addEventListener('click', () => {
    
    let moreLikes = parseInt(likes.innerText);
    moreLikes = ++moreLikes;
    likes.innerText = moreLikes;

    let likeConfiguationObject = {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify({
        like_count: moreLikes,
        image_id: imageId
      })
    }
    
    
    fetch(likeURL,likeConfiguationObject)
    .then(resp => resp.json())
    .then(resp => {
      likes.innerText = moreLikes;
      console.log(resp);
    })
    .catch(error => console.log(error.message))
  });
}

function addComment(){
  
  commentForm.addEventListener('submit', function(e){
    e.preventDefault();

    const formData = document.getElementById('comment_input').value;
    let commentListItem = document.createElement('li');
    commentListItem.innerText = formData;

    commentsList.appendChild(commentListItem);

    let commentFormConfiguationObject = {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify({
        image_id: imageId,
        content: formData
      })
    }

  fetch(commentsURL,commentFormConfiguationObject)
  .then(resp => resp.json())
  .then(resp => {
    commentListItem.dataset.id = resp.id;
  })
  .catch(error => console.log(error.message));

  });

}

function deleteComment(){
    let deleteCommentButton = event.target;
    deleteCommentButton.addEventListener('click',(e) =>{
    let soughtComment = e.target.parentNode;
    let commentId = soughtComment.getAttribute('data-id');

    let deleteCommentConfigurationObject = {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json',
       'Accept':'application/json'
      },
      body: JSON.stringify({
        comment_id: commentId,
        image_id: imageId
      })
    }

    fetch(commentsURL+`${commentId}`,deleteCommentConfigurationObject)
    .then(resp => resp.json())
    .then(resp => {
      soughtComment.remove();
      console.log(resp);
    })
    .catch(error => console.log(error.message))

    });
  }
  
}

function displayComments(comments){
  comments.forEach(comment => {
    let commentListItem = document.createElement('li');
    commentListItem.innerText = comment.content;
    commentListItem.dataset.id = comment.id;
    let deleteCommentButton = document.createElement('button');
    deleteCommentButton.className = 'delete';
    deleteCommentButton.innerText = 'Delete Comment';
    commentListItem.appendChild(deleteCommentButton);
    commentsList.appendChild(commentListItem);
  });
}

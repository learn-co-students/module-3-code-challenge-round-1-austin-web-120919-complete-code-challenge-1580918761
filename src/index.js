document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')
 

  let image_id = 4479 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${image_id}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`


  fetch(imageURL)
  .then(resp => resp.json())
  .then(json => createImageCard(json))

  function createImageCard(json){
    document.getElementById('name').innerText = json.name;
    document.getElementById('image').src = json.url;
    document.getElementById('likes').innerText = json.like_count;
    showComments(json)
    document.getElementById('like_button').addEventListener('click',e => likeImage(document.getElementById('likes')));
    const commentForm = document.getElementById('comment_form');
    //console.log(commentForm);
    commentForm.lastElementChild.addEventListener('click',e => addComment(e))
  }
  
  function displayComments(comment, comment_id){
    const commentList = document.getElementById('comments');
    const commentListElement = document.createElement('li');
    commentListElement.id = comment_id;
    commentListElement.innerText = comment;
    commentListElement.append(createDeleteButton(comment));
    commentList.appendChild(commentListElement);
  }
  
  function likeImage(likeContent){
    likeContent.innerText = parseInt(likeContent.innerText, 10) + 1;
    fetch(likeURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({image_id})
    })
  }

  function addComment(event){
    event.preventDefault();
    const content = event.target.previousElementSibling.value
 
    fetch(commentsURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id,
        content
      })
    })
    .then(resp => resp.json())
    .then(json =>  displayComments(content, json.id))
  }

  function createDeleteButton(comment){
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Remove Comment';
    deleteButton.id = comment;
    deleteButton.addEventListener('click', e => deleteComment(e));
    return deleteButton;
  }

  function deleteComment(event){
    fetch(`${commentsURL}${event.target.parentElement.id}`,{
      method: 'DELETE',
    })
    .then(resp => resp.json())
    //.then(json => json())
    .then (json => alert(json.message))
    .then(reloadComments())
  }

  function reloadComments(){
    document.getElementById('comments').innerHTML = '';
    fetch(imageURL)
    .then(resp => resp.json())
    .then(json => showComments(json))
  }

  function showComments(json){
    for (const comment of json.comments){
      displayComments(comment.content, comment.id)
    };
  }

})


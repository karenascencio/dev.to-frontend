const BASE_URL = 'https://miproyecto-jorge-default-rtdb.firebaseio.com'

//Helper function to use js as selector (learning purposes :D)
function getById(id){ return document.getElementById(id)}


///////////////////////
//// On page load /////
///////////////////////

// Get ID of post from URL
let url = new URLSearchParams(location.search)
let postId = url.get("key")

//Get post info
//let postData = getPost(postId)
//let postComments = getCommentsByPostId(postId)

//Update HTML 
renderPostHTML(postId);

let commentsQty = Object.keys(postComments).length
if (commentsQty>2){
    renderComments(postComments, "partial")
}else{
    renderComments(postComments)
}

//////////////////////
//// Post functions///
//////////////////////

// Call to get posts by post ID (used jQuery's ajax)
function getPost(postId) {
    let result
    $.ajax({
        method: "GET",
        url: `${BASE_URL}/posts/${postId}/.json`,
        success: response =>{
            result = response
            console.log(`${BASE_URL}/posts/${postId}/.json`)
        },
        async: false
        })
    return result
}
//fetch post from the api
async function fetchPost(postId){
    let data = await fetch(`http://localhost:8080/posts/${postId}`);
    let post = await data.json();
    return post.data;
}

async function fetchUserPosts(userId){
    let data = await fetch(`http://localhost:8080/users/${userId}`);
    let user = await data.json();
    let posts = user.data.user[0].posts;
    $('ul.list-group').empty()
    posts.forEach((post,index)=>{
        console.log(post.title,post.tag_list)
        let postItem = `<li class="list-group-item" id="${index}">${post.title}<span class="card-txt"><br></span></li>`;
        $('ul.list-group').append(postItem);
        let tags ="<span>";
        post.tag_list.forEach(tag => {
            tags+=tag;
        });
        tags+="</span>";
        $(`li#${index}`).append(tags)
    })
}


// Updates Post detail html (used javascript DOM methods)
async function renderPostHTML(postId){
    let data = await fetchPost(postId)
    let postData = data.post;
    const userId = postData.user._id;
    fetchUserPosts(userId);
    getById("title").textContent = postData.title
    console.log('el titulo es: ',postData.title)
    getById("cover-image").src = postData.cover_image
    getById("content").textContent = postData.content

    getById("user-image").src = postData.profile_image_90
    getById("user-name").textContent = postData.name

    getById("post-date").textContent = postData.readable_publish_date
    getById("read-time").textContent = postData.reading_time_minutes

    getById("reactions-count").textContent = postData.positive_reactions_count

    let tagsHtml = ""
    postData.tag_list.forEach((tag, idx) => {
        tagsHtml += `<button class="btn-card-${idx+2} text" type="button">#${tag}</button> `
    });
    getById("tags-list").innerHTML = tagsHtml

    /*$('.img-size').src = postData.user*/
    $('.card-title').text(postData.user.name)
    $('.card-text').text(postData.user.bio)
    $('.list-style>li:nth-child(3)').html(`<b class="simon-txt">JOINED</b><br>${postData.user.joinDate}`)
    $('span.c-text-color').text(postData.user.name)

    /*let postItem = `<li class="list-group-item">${}<span class="card-txt"><br></span></li>`*/
}

// Call to add 1 to the reaction count - PATCH
/*function addToReactionCount(){
    let positive_reactions_count = Number(postData.positive_reactions_count) + 1
    let postReactionObject = JSON.stringify({positive_reactions_count})
    let result
    $.ajax({
        method: "PATCH",
        url: `${BASE_URL}/posts/${postId}/.json`,
        data: postReactionObject,
        success: response =>{
            result = response
            // Update postData
            postData = getPost(postId)
        },
        async: false
        })
    return result
}*/

//// Post Listeners//////
/////////////////////////

//Reactions button (to add)
$("#reactions-btn").click(()=>{
    let newReactionCountObject = addToReactionCount()
    $("#reactions-count").text(newReactionCountObject.positive_reactions_count)
})


//////////////////////////
//// Comments functions///
/////////////////////////

// Save a comment - POST
function addComment(author, content, postId){
    let commentObject = {author, content, postId}
    const date = new Date()
    commentObject["commentDate"] = date
    commentObject["readableCommentDate"] = date.toDateString().split(" ").slice(1,3).join(" ")
    commentObject["likes"] = 0
    commentJson = JSON.stringify(commentObject)

    let result
    $.ajax({
        method: "POST",
        url: `${BASE_URL}/comments/.json`,
        data: commentJson,
        success: response =>{
            let postComments = getCommentsByPostId(postId)
            renderComments(postComments)
            result = response
        },
        async: false
        })
    return result
}

// Get a comment by ID - GET
function getCommentById(commentId){
    let result
    $.ajax({
        method: "GET",
        url: `${BASE_URL}/comments/${commentId}/.json`,
        success: response =>{
            result = response
        },
        async: false
        })
    return result
}

// Get all post's comments - GET
function getCommentsByPostId(postId){
    let allComments
    $.ajax({
        method: "GET",
        url: `${BASE_URL}/comments/.json`,
        success: response =>{
            allComments = response
        },
        async: false
        })

    let commentsByPostId = {}
    for (commentKey in allComments){
        let commentValues = allComments[commentKey]
        commentsByPostId = commentValues.postId === postId ? {...commentsByPostId, [commentKey]: commentValues} : commentsByPostId
    }
    return commentsByPostId
}

// Add like to comment - PATCH
function addLikeToComment(commentId){
    let likes = Number(postComments[commentId].likes) + 1
    let commentLikesObject = JSON.stringify({likes})
    let result
    $.ajax({
        method: "PATCH",
        url: `${BASE_URL}/comments/${commentId}/.json`,
        data: commentLikesObject,
        success: response =>{
            result = response
            // Update postData
            postComments = getCommentsByPostId(postId)
        },
        async: false
        })
    return result
}


// Builds comment html from comment data
function getCommentHtml(commentId, commentsData){
    let commentHtml = `
            <div class="comment-box pt-3 d-flex">
            <div class="pfp-collapse-images pr-md-0 d-flex mr-2 flex-column">
                <img class="rounded-circle" width="24px" height="24px" src="img/comment-person.png" alt="karen">
                <img class="mt-1" width="24px" height="24px" src="img/collapsed-icon.svg" alt="collapsed">
            </div>
            <div class="comment-info col-11 pl-md-0">
                <div class="card">
                    <div class="card-body pt-1">
                        <div class="comment-person-info d-flex">
                            <p class="card-text"><small class="text-muted"> <b>${commentsData.author}</b></small></p>
                            <p class="card-text pl-1"><small class="text-muted"> ${commentsData.readableCommentDate}</small></p>
                        </div>
                        <p>
                        ${commentsData.content}
                        </p>
                    </div>
                </div>
                <div class="comment-interaction">
                    <button type="button" class="btn btn-light bg-white like-comment-btn" data-comment-id=${commentId}><img src="img/heart-icon.svg" alt="heart" /><span class="font-weight-normal">${commentsData.likes}</span> likes</button>

                </div>
            </div>
        </div>
    `
    return commentHtml
}

// Renders a single comment at the end of section
function renderAComment(commentId, comment){
    let commentHtml = getCommentHtml(commentId, comment)
    $(".comment-container").append(commentHtml)
}

// Renders all post's comments
function renderComments(postComments, display){
    $(".comment-container").empty()
    if (display == "partial"){
        Object.keys(postComments).slice(0,2).forEach(commentId=>{
            renderAComment(commentId, postComments[commentId])
            $("#toogle-show-comments").removeClass("d-none")
        })
    }else{
        for (commentId in postComments){
            renderAComment(commentId, postComments[commentId])
            $("#toogle-show-comments").addClass("d-none")
        }
    }

    $(".comments-qty").text(Object.keys(postComments).length)

    // Add listener here so that all comments always have a listener
    $(".like-comment-btn").click( click_event =>{
        let commentId = click_event.currentTarget.dataset.commentId // js
        // let commentId = $(click_event.target).data("comment-id") // jQuery
        let commentLikesObject = addLikeToComment(commentId)
        //document.querySelector(`[data-comment-id=${commentId}] span`).textContent // Js
        $(`[data-comment-id=${commentId}] span`).text(commentLikesObject.likes)
    })

}

//Comments Listeners//
//////////////////////

// Submit a comment (used jquery)
$("#add-comment-btn").click(()=>{
    let commentContent = $("#comment-input").val().trim()
    console.log(commentContent);
    if (!commentContent){
       $("#comment-input").addClass("is-invalid")
    }else{
        let commentIdObject = addComment("Salvador Jiménez", commentContent, postId)
        console.log(commentIdObject);
        $("#comment-input").val("")
        $("html").animate(
            {scrollTop: $(`[data-comment-id=${commentIdObject.name}]`).offset().top - 170},
            800)
    }

})

$("#comment-input").click((e)=>{
    //e.target.classList.remove("is-invalid") // js
    $(e.target).removeClass("is-invalid") // jQuery
})

$("#toogle-show-comments").click(()=>{
    renderComments(postComments)
    $("#toogle-show-comments").addClass("d-none")
})

/*
Pending:
- Enable submit only when there is comment content
- Toogle show/hide comments button
- Style of comments: Buttons, width
- Add/Remove likes/reactions
*/



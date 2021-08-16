const ENDPOINT = 'http://localhost:8080/posts'

$('#publish-button').click( () => {
    const date = new Date()
    let readableDate = date.toDateString().split(" ").slice(1,3).join(" ")
    let publishedAt = date.toISOString()
    let randomReaction = Math.floor(Math.random() * 101)
    let randomReading = Math.floor(Math.random() * 11)

    let postObject = { published_timestamp: publishedAt, readable_publish_date: readableDate, 
        published_at: publishedAt, positive_reactions_count: randomReaction, reading_time_minutes: randomReading,
        user: "61186fa43e53711ef14426db"
        // {    
        //     // github_username: "benhalpern",
        //     // name: "Ben Halpern",
        //     // profile_image: "https://res.cloudinary.com/practicaldev/image/fetch/s--Y1sq1tFG--/c_fill,f_auto,fl_progressive,h_640,q_auto,w_640/https://thepracticaldev.s3.amazonaws.com/uploads/user/profile_image/1/f451a206-11c8-4e3d-8936-143d0a7e65bb.png",
        //     // profile_image_90: "https://res.cloudinary.com/practicaldev/image/fetch/s--DcW51A6v--/c_fill,f_auto,fl_progressive,h_90,q_auto,w_90/https://thepracticaldev.s3.amazonaws.com/uploads/user/profile_image/1/f451a206-11c8-4e3d-8936-143d0a7e65bb.png",
        //     // twitter_username: "bendhalpern",
        //     // username: "ben",
        //     // website_url: "http://benhalpern.com"
        // }
    }

    $('.publish-post').each( function(){
        let property = $(this).attr("name")
        let value = $(this).val()
        let postTime 
        if ($(this).attr("name") == "tags"){
            let tags = $(this).val()
            let tagList = tags.split(" ")
            postObject = { ...postObject, "tag_list":tagList}
        }
        
        postObject = {...postObject, [property] : value}
    })
    publishPost(JSON.stringify(postObject))
})


let asideTitle = `<div class="aside-content-wrapper" style="top: 148px; position: fixed;">
                        <h4 class="aside-title">
                            Writing a Great Post Title
                        </h4>
                        <p class="aside-conten text-muted">
                        Think of your post title as a super short (but compelling!) description — like an overview of the actual post in one short sentence.
                        Use keywords where appropriate to help ensure people can find your post by search.
                        </p>
                    </div>`
let asideTagging = `<div class="aside-content-wrapper" style="top: 218px; position: fixed;">
                            <h4 class="aside-1-title">
                                Tagging Guidelines
                            </h4>
                            <p class="aside-conten text-muted">
                                Tags help people find your post.
                                Think of tags as the topics or categories that best describe your post.
                                Add up to four comma-separated tags per post. Combine tags to reach the appropriate subcommunities.
                                Use existing tags whenever possible.
                                Some tags, such as “help” or “healthydebate”, have special posting guidelines.
                            </p>
                        </div>`
let asideContent = `<div class="aside-content-wrapper" style="top: 354px; position: fixed;">
                        <h4 class="aside-title">
                            Editor Basic
                        </h4>
                        <p class="aside-conten text-muted">
                            Use Markdown to write and format posts.<br/>
                            You can use Liquid tags to add rich content such as Tweets, YouTube videos, etc.
                            In addition to images for the post's content, you can also drag and drop a cover image
                        </p>
                    </div>`

$('#title-input').click(() =>{
    $('.post-aside-container').empty();
    $('.post-aside-container').append(asideTitle);
})

$('#tag-input').click(() =>{
    $('.post-aside-container').empty();
    $('.post-aside-container').append(asideTagging);
})

$('#content-body').click(() =>{
    $('.post-aside-container').empty();
    $('.post-aside-container').append(asideContent);
})

// const publishPost = postData => {
//     $.ajax({
//         type: "POST",
//         url: ENDPOINT,
//         data:JSON.stringify( postData ),
//         success: response => {
//             let responseKey = response.data.post._id
//             window.location.href = `/post_detail.html?key=${responseKey}`
//         },
//         error: error => {
//             console.log(error)
//         },
//         async:false
//     });
// 

function publishPost(postData){
    fetch(ENDPOINT, {
        method: 'POST',
        body: postData,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then( response => response.json())
        .then( response => {
        console.log(response)
        let responseKey = response.data.post._id
        window.location.href = `/post_detail.html?key=${responseKey}`
    })
        .catch( err => {
            console.log(err)
        })
}

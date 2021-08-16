const endPoint = 'https://miproyecto-jorge-default-rtdb.firebaseio.com'
/*claves del queryString*/
const urlParams = new URLSearchParams(location.search);
/*cunado buscamos nos redirigimos a la vista de busqueda y pasamos el parametro
de busqueda a travez de la url */
let busqueda = urlParams.get('busqueda');
$(document).ready(function(){
    /*si existe un parametro de busqueda en la URL imprimimos los post cuyo
    searchString incluya dicho parameto */
    if(busqueda){
        printAllCardsSearch(busqueda,'relevance');    
    }
    /*de lo conrtrario imprimimos todos los post*/
    else{
        printAllCards();
        printAside();
    }
})
function compareYear(dateToCompare){
    let currentDate = moment(new Date());
    let postDate = moment(new Date(dateToCompare));
    return currentDate.year() == postDate.year();
}
function compareMonth(dateToCompare){
    let currentDate = moment(new Date());
    let postDate = moment(new Date(dateToCompare));
    return currentDate.year() == postDate.year() &&  currentDate.month() == postDate.month();
}
function compareWeek(dateToCompare){
    let currentDate = moment(new Date());
    let postDate = moment(new Date(dateToCompare));
    return currentDate.year() == postDate.year() &&  currentDate.isoWeek() == postDate.isoWeek();
}



async function printAllCards(option='feed'){
    let posts = await fetchPosts();
    console.log(posts)
    let postFiltrados;
    if(option=='feed'){
        postFiltrados=posts;
    }
    if(option=='week'){
        postFiltrados=posts.filter(post=>compareWeek(post.published_timestamp));
    }
    if(option=='month'){
        postFiltrados=posts.filter(post=>compareMonth(post.published_timestamp));
    }
    if(option=='year'){
        postFiltrados=posts.filter(post=>compareYear(post.published_timestamp));
    }
    if(option=='latest'){
        postFiltrados = posts.sort(function(a,b){
            return moment(new Date(b.published_timestamp)).valueOf() - moment(new Date(a.published_timestamp)).valueOf()
            })
        postFiltrados = postFiltrados.slice(0,5);
    }
    $('#nav-feed').empty();
    postFiltrados.forEach(post=>poblateCard(post))
    let firstCard = $('#nav-feed .card:first-child').find('img');
    firstCard.addClass('d-block');
    return postFiltrados;
}



function poblateCard(article){
    /*creamos un string con el formato del post y lo populamos con los datos
    del objeto que recibe la funcion como argumento*/
    let newCard = createCard(article);
    /*lo agregamos al contenedor padre*/
    $('#nav-feed').append(newCard);
    let tags = $('#nav-feed .card:last-child').find('.card-post-tags')
    /*iteramos sobre el tagList para imprimir todos los tags */
    if(article.tagList){
        article.tagList.forEach(tag=>{
            tags.append(`<a>#${tag}<a/>`)
        })
    }
}

function createCard(article){
    /*string con el formato del post*/
            /*cover:post.cover_image,
            user:"https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile.png",
            name:post.user.name,
            readable_publish:post.readable_publish_date,
            title:post.title,
            tagList:post.tag_list,
            reading_time_minutes:post.reading_time_minutes,
            published_timestamp:post.published_timestamp,
            postId:post._id,
            tagString:post.tags,
            positives:post.positive_reactions_count,
            searchString:`${post.user.name} ${post.tags} ${post.title}`*/
    let {cover,user,name,readable_publish,title,tagList,reading_time_minutes,published_timestamp,postId,positives} = article;
    let templateCard = `<div class="card br-post post-card featured-post-card mb-2">
                        <img src=${cover} class="card-img-top d-none" alt="..." style="max-height:300px;object-fit: fill">
                        <div class="card-body">
                            <div class="d-flex c-header">
                            <img src=${user} alt="" class="br-100">
                            <div class="d-flex c-name">
                                <h6 class="nickname mb-0">${name}</h6></h6>
                                <p>${readable_publish}</p>
                            </div>
                        </div>
                        <div class="card-content pl-5 pt-2">
                            <a href="post_detail.html?key=${postId}" class="post-list">
                            <h4 class="card-title">${title}</h4>
                            </a>
                        <div class="d-flex h-order">
                            <nav class="card-post-tags">
                            </nav>
                        </div>
                        <div class=" d-flex read">
                    
                    <div class="d-flex">
                    <div>
                    <a href="post_detail.html?key=${postId}" class="post-list">
                    <svg class="crayons-icon" width="24" height="24" 
                        xmlns="http://www.w3.org/2000/svg"><path d="M18.884 12.595l.01.011L12 19.5l-6.894-6.894.01-.01A4.875 4.875 0 0112 5.73a4.875 4.875 0 016.884 6.865zM6.431 7.037a3.375 3.375 0 000 4.773L12 17.38l5.569-5.569a3.375 3.375 0 10-4.773-4.773L9.613 10.22l-1.06-1.062 2.371-2.372a3.375 3.375 0 00-4.492.25v.001z"></path></svg>
                        <button class="comment"><span>${positives}</span> reactions</button>
                    </a>
                        </div>
                    <div>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" role="img"
                        aria-labelledby="aavwx5vmqdgx8wvzfg593jo469ge3dnz"
                        class="crayons-icon mb-1">
                        <title id="aavwx5vmqdgx8wvzfg593jo469ge3dnz">
                            Comments</title>
                        <path
                            d="M10.5 5h3a6 6 0 110 12v2.625c-3.75-1.5-9-3.75-9-8.625a6 6 0 016-6zM12 15.5h1.5a4.501 4.501 0 001.722-8.657A4.5 4.5 0 0013.5 6.5h-3A4.5 4.5 0 006 11c0 2.707 1.846 4.475 6 6.36V15.5z">
                        </path>
                    </svg>
                    </div>
                    </div>
                    <div class="d-flex">
                    <p class="card-text mb-0"><small class="text-muted">${reading_time_minutes}
                        min read</small></p>
                    <button class="save">Save</button>
                </div>
            </div>
        </div>
        </div>
    </div>`
    return templateCard;
}
/*manejador de eventos del filtro*/
$('#nav-tab').on('click',function(event){
    let target = event.target;
    switch(target.id) {
        case 'feed':
            printAllCards('feed');
            break;
        case 'latest':
            printAllCards('latest');
            break;
        case 'week':
            printAllCards('week');
            break;
        case 'month':
            printAllCards('month');
            break;
        case 'year':
            printAllCards('year');
            break;
        case 'newest':
            printAllCardsSearch(busqueda,'desc');
            break;
        case 'oldest':
            printAllCardsSearch(busqueda,'asc');
            break;
        case 'relevance':
            printAllCardsSearch(busqueda,'relevance');
            break;
    }
    
})
/*manejador de eventos de la busqueda*/
$('#search').on('search',function(event){
    location.href = `vistaBusqueda.html?busqueda=${$(this).val()}`
})
/*manejador de eventos de la busqueda (mobile vista busqueda)*/
$('#searchMobile').on('search',function(event){
    location.href = `vistaBusqueda.html?busqueda=${$(this).val()}`
})
/*funcion para traer comentarios de manera sincrona*/
function bringComments(){
    let commentsObject;
    $.ajax({
        method:'GET',
        url:endPoint+'/comments/.json',
        success: function (result) {
            commentsObject = result;
        },
        async: false
    });
    let commentsArray = Object.values(commentsObject)
    return commentsArray;
}
/*funcion para crear comentarios*/
function createCommentary(postId,author,content){
    $.ajax({
        method:'POST',
        url:endPoint+'/comments/.json',
        data:JSON.stringify({postId,author,content}),
        success: function (result) {
            console.log(result);
        },
        async: true
    });
}


function bringPosts(){
    $.ajax({
        method:'GET',
        url:endPoint+'/posts/.json',
        success: function (result) {
            postsObject = result;
        },
        async: false
    });
    let comments = bringComments();
    let postsMatrix = Object.entries(postsObject);
    let postsArray = postsMatrix.map(post=>{
        return {
            cover:post[1].cover_image,
            /*avatar del usuario*/
            user:post[1].user.profile_image_90,
            /*nombre del usuario*/
            name:post[1].user.name,
            /*fecha de publicacion (formato corto)*/
            readable_publish:post[1].readable_publish_date,
            /*titulo del post*/
            title:post[1].title,
            /*arreglo con los tags*/
            tagList:post[1].tag_list,
            /*tiempo de lectura*/
            reading_time_minutes:post[1].reading_time_minutes,
            /*fecha de publicacion (formato largo)*/
            published_timestamp:post[1].published_timestamp,
            /*clave de nuestro post en nuetria API*/
            postId:post[0],
            /*string con los tags*/
            tagString:post[1].tags,
            /*comentarios de cada post*/
            comments:comments.filter(item=>item.postId == post[0]),
            /*respuestas positivas al post*/
            /*este criterio de orden es tentativo (puede cambiar despues)*/
            positives:post[1].positive_reactions_count,
            searchString:`${post[1].user.name} ${post[1].tags} ${post[1].title}`.toLowerCase()
        }
    })
    return postsArray;
}

async function fetchPosts(){
    let data = await fetch('http://localhost:8080/posts');
    let posts = await data.json();
    let arreglo =  posts.data.posts;
    let postArray = arreglo.map(post =>{
        return {
            cover:post.cover_image,
            user:"https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile.png",
            name:post.user.name,
            readable_publish:post.readable_publish_date,
            title:post.title,
            tagList:post.tag_list,
            reading_time_minutes:post.reading_time_minutes,
            published_timestamp:post.published_timestamp,
            postId:post._id,
            tagString:post.tags,
            positives:post.positive_reactions_count,
            searchString:`${post.user.name} ${post.tags} ${post.title}`
        }
    })
    return postArray  
}


async function printAllCardsSearch(busqueda,order='desc'){
    let posts = await fetchPosts();
    let postFiltrados = posts.filter(post =>{
        return post.searchString.includes(busqueda.toLowerCase());
    }
    )
/*si argumento order es el parametro 'desc', ordenamos los post del mas reciente al mas viejo*/
    if(order=='desc'){
        postFiltrados.sort(function(a,b){
            return moment(new Date(b.published_timestamp)).valueOf() - moment(new Date(a.published_timestamp)).valueOf()
            })
        }
/*si argumento order es el parametro 'asc', ordenamos los post del mas viejo al mas reciente*/
    if(order=='asc'){
        postFiltrados.sort(function(a,b){
            return  moment(new Date(a.published_timestamp)).valueOf() - moment(new Date(b.published_timestamp)).valueOf()
        })
    }
/*ordenamos por relevancia*/
    if(order=='relevance'){
        postFiltrados.sort(function(a,b){
            return b.positives - a.positives;
        })
    }
    $('#nav-feed').empty();
    postFiltrados.forEach(post=>poblateCard(post))
    let firstCard = $('#nav-feed .card:first-child').find('img');
    firstCard.addClass('d-block');
    return postFiltrados;
}

function createListItem(article){
    let {title,postId,comments} = article
    let listItemTemplate = `<li class="list-group-item">
                                    <a href="post_detail.html?key=${postId}" class="post-list">
                                    ${title}
                                    </a>
                                    <div>
                                        <p class="text-muted l-text">${comments.length} comments</p>
                                    </div>
                                
                            </li>`  
    return  listItemTemplate;
}

function printAside(){
    let posts = bringPosts();
    console.log(posts)
    let help = posts.filter(post =>{
        return post.searchString.includes('help')
    })
    let news = posts.filter(post =>{
        return post.searchString.includes('new')
    })
    console.log(help)
    console.log(news)
    $('#newsPost').empty();
    news.forEach(post=>{
        $('#newsPost').append(createListItem(post));
    })

    $('#helpPost').empty();
    help.forEach(post=>{
        $('#helpPost').append(createListItem(post));
    })
}
//Async function that fetches news data from the API
async function fetchNews() {
    let category = this.innerHTML;
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=8fb69ffaae4541d4b23735b94523dc64`);
    const json = await response.json();
    newsData = json.articles;
    displayNewsCards(newsData);
}
//Creates news cards from the news data given
function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';

    const image = document.createElement('img');
    image.src = article.urlToImage || 'notavailable.png';
    image.alt = article.title;

    const cardContent = document.createElement('div');
    cardContent.className = 'news-card-content';

    const title = document.createElement('h3');
    title.className = 'news-card-title';
    title.textContent = article.title;

    const description = document.createElement('p');
    description.className = 'news-card-description';
    description.textContent = article.description;

    const readMore = document.createElement('a');
    readMore.href = article.url;
    readMore.textContent = 'Read more';
    readMore.target = '_blank';

    const addbookmarkButton = document.createElement('button');
    addbookmarkButton.className = 'addbookmark-button';

    if (isBookmarked(article)) {
        addbookmarkButton.textContent = 'Unbookmark';
    } else {
        addbookmarkButton.textContent = 'Bookmark';
    }
    //When the button is clicked the function adds article to bookmarks or removes it while changing the text content accordingly
    addbookmarkButton.addEventListener('click', () => {
        if (article.bookmarked) {
            unbookmarkArticle(article);
            addbookmarkButton.textContent = 'Bookmark';
        } else {
            bookmarkArticle(article);
            addbookmarkButton.textContent = 'Unbookmark';
        }
        // if we're in bookmarks view:
        if (isBookmarksView) {
            displayNewsCards(bookmarkedArticles);
        }
    });

    cardContent.appendChild(title);
    cardContent.appendChild(description);
    cardContent.appendChild(readMore);
    cardContent.appendChild(addbookmarkButton);

    card.appendChild(image);
    card.appendChild(cardContent);

    return card;
}
//filter news while typing on the search bar
function filterNews() {
    // if we are in BookmarksView we work with bookmarkedArticles; else with newsData
    let displayedData = isBookmarksView?bookmarkedArticles:newsData;

    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredNews = displayedData.filter(article => {
        let title = '';
        let description = '';
        if (article.title) {
            title = article.title.toLowerCase();
        }
        if (article.description) {
            description = article.description.toLowerCase();
        }
        return title.includes(query) || description.includes(query);
    });
    displayNewsCards(filteredNews);
}
//displays news cards in the news-container
function displayNewsCards(newsData) {
    newsContainer.innerHTML = '';

    newsData.forEach(article => {
        const newsCard = createNewsCard(article);
        newsContainer.appendChild(newsCard);
    });
}

//Checks if an article is bookmarked or not
function isBookmarked(article) {
    return article.bookmarked === true;
}
//Function that adds articles to the bookmarkarticles array and mark it as bookmarked
function bookmarkArticle(article) {
    article.bookmarked = true;
    bookmarkedArticles.push(article);
}
//Removes article from the bookmarkedArticles array and mark it as unbookmarked
function unbookmarkArticle(article) {
    article.bookmarked = false;
    bookmarkedArticles = bookmarkedArticles.filter(bookmarked => bookmarked.url !== article.url);
}
// Toggle between Bookmarks/Articles View
function toggleBookmarks() {
    if(isBookmarksView){
        // we are in a bookmarks view => change to articles view
        displayNewsCards(newsData);
        buttonBookmarks.textContent = 'Show Bookmarks';
        isBookmarksView = false;
    }else{
        // we are in a articles view => change to bookmarks view
        displayNewsCards(bookmarkedArticles);
        buttonBookmarks.textContent = 'Hide Bookmarks';
        isBookmarksView = true;
    }
}



let buttons = document.querySelectorAll('.category');
const buttonBookmarks = document.querySelector('.bookmarks-button');
const newsContainer = document.getElementById('news-container');

let newsData = [];
let bookmarkedArticles = [];
let isBookmarksView = false;  // Flag to track if we're in the bookmarks view

document.getElementById('search-input').addEventListener('keyup', filterNews);
buttonBookmarks.addEventListener('click', toggleBookmarks) //When the Bookmarks button is clicked articles from the bookmarks array are displayed

//Iterates through the categories
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', fetchNews);
}
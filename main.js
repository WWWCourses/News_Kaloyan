//Async function that fetches news data from the API
async function fetchNews() {
    let category = this.innerHTML;
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=8fb69ffaae4541d4b23735b94523dc64`);
    const json = await response.json();
    newsData = json.articles;
    displayedData = newsData;
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
        if (isBookmarked(article)) {
            unbookmarkArticle(article);
            addbookmarkButton.textContent = 'Bookmark';
        } else {
            bookmarkArticle(article);
            addbookmarkButton.textContent = 'Unbookmark';
        }
        if (displayedData === bookmarkedArticles) {
            displayBookmarks();
        } else {
            displayNewsCards(displayedData);
        }
    })
    cardContent.appendChild(title);
    cardContent.appendChild(description);
    cardContent.appendChild(readMore);
    cardContent.appendChild(addbookmarkButton);

    card.appendChild(image);
    card.appendChild(cardContent);

    return card;
}
//displays news cards in the news-container
function displayNewsCards(newsData) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    newsData.forEach(article => {
        const newsCard = createNewsCard(article);
        newsContainer.appendChild(newsCard);
    });
}
//Checks if an article is bookmarked or not
function isBookmarked(article) {
    return bookmarkedArticles.some(bookmarked => bookmarked.url === article.url);
}
//filter news while typing on the search bar
function filterNews() {
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
//Function that adds articles to the bookmarkarticles array
function bookmarkArticle(article) {
    if (!isBookmarked(article)) {
        bookmarkedArticles.push(article);
    }
}
//Removes article from the bookmarkedArticles array and checks if an article is already bookmarked
function unbookmarkArticle(article) {
    bookmarkedArticles = bookmarkedArticles.filter(bookmarked => bookmarked.url !== article.url);

    displayedData = displayedData.map(item => {
        if (item.url === article.url) {
            item.bookmarked = false
        }
        return item;
    });
}
//Displays bookmarks that are in the array
function displayBookmarks() {
    displayedData = bookmarkedArticles
    displayNewsCards(bookmarkedArticles)
}

let buttons = document.querySelectorAll('.category');
const buttonBookmarks = document.querySelector('.bookmarks-button');
let newsData = [];
let displayedData = [];
let bookmarkedArticles = [];

document.getElementById('search-input').addEventListener('keyup', filterNews);
buttonBookmarks.addEventListener('click', displayBookmarks) //When the Bookmarks button is clicked articles from the bookmarks array are displayed

//Iterates through the categories
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', fetchNews);
}
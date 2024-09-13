let buttons = document.querySelectorAll('.category');
const buttonBookmarks = document.querySelector('.bookmarks-button');
let newsData = [];
let bookmarkedArticles = [];
let displayedData = [];

function isBookmarked(article) {
    return bookmarkedArticles.some(bookmarked => bookmarked.url === article.url);
}

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', functionasyns);
}

async function functionasyns() {
    let category = this.innerHTML;
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=8fb69ffaae4541d4b23735b94523dc64`);
    const json = await response.json();
    newsData = json.articles;
    displayedData = newsData;
    displayNewsCards(newsData);
}
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

function displayNewsCards(newsData) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    newsData.forEach(article => {
        const newsCard = createNewsCard(article);
        newsContainer.appendChild(newsCard);
    });
}

document.getElementById('search-input').addEventListener('keyup', filterNews);

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

function bookmarkArticle(article) {
    if (!isBookmarked(article)) {
        bookmarkedArticles.push(article);
    }
}

function unbookmarkArticle(article) {
    bookmarkedArticles = bookmarkedArticles.filter(bookmarked => bookmarked.url !== article.url);

    displayedData = displayedData.map(item => {
        if (item.url === article.url) {
            item.bookmarked = false
        }
        return item;
    });
}

function displayBookmarks() {
    displayedData = bookmarkedArticles
    displayNewsCards(bookmarkedArticles)
}

buttonBookmarks.addEventListener('click', displayBookmarks)
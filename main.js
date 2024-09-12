let buttons = document.querySelectorAll('.category')
const buttonBookmarks = document.querySelector('.bookmarks-button')
let newsData = []
let bookmarkedArticles = []
let displayedData = []
function isBookmarked(article) {
   for (let i = 0; i < bookmarkedArticles.length; i++) {
        if (bookmarkedArticles[i].url === article.url) {
            return true;
}
  }
    return false; // Article is not bookmarked
}
    for (let i=0;i<buttons.length;i++) {
        buttons[i].addEventListener('click', functionasyns)
    }
async function functionasyns() {
  let category = this.innerHTML
  const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=8fb69ffaae4541d4b23735b94523dc64`)
  const json = await response.json()
  newsData = json.articles
  displayedData = newsData
  displayNewsCards(newsData)
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
  
    // Corrected code: Use isBookmarked to check bookmark state
    if (isBookmarked(article)) {
      addbookmarkButton.textContent = 'Unbookmark';
    } else {
      addbookmarkButton.textContent = 'Bookmark';
    }
  
    // Add click event listener for bookmarking/unbookmarking
    addbookmarkButton.addEventListener('click', () => {
      if (isBookmarked(article)) {
        unbookmarkArticle(article);
        addbookmarkButton.textContent = 'Bookmark';
      } else {
        bookmarkArticle(article);
        addbookmarkButton.textContent = 'Unbookmark';
      }
      console.log('Updated Bookmarked Articles:', bookmarkedArticles);
    });
  
    cardContent.appendChild(title);
    cardContent.appendChild(description);
    cardContent.appendChild(readMore);
    cardContent.appendChild(addbookmarkButton);
  
    card.appendChild(image);
    card.appendChild(cardContent);
  
    return card;
  }
function displayNewsCards(newsData) {
    const newsContainer = document.getElementById('news-container')
    newsContainer.innerHTML = ''

    newsData.forEach(article => {
        const newsCard = createNewsCard(article)
        newsContainer.appendChild(newsCard)
    });
}
document.getElementById('search-input').addEventListener('keyup', filterNews)
function filterNews() {
    const query = document.getElementById('search-input').value.toLowerCase()
    const filteredNews = displayedData.filter(article => {
        let title = ''
        let description = ''
        if (article.title) {
            title = article.title.toLowerCase()
        }
        if (article.description) {
            description = article.description.toLowerCase()
        }
        return title.includes(query) || description.includes(query)
    });
    displayNewsCards(filteredNews)
}
function bookmarkArticle(article) {
    if (!bookmarkedArticles.includes(article)) {
        bookmarkedArticles.push(article)
    }
}
function unbookmarkArticle(article) {
    const index = bookmarkedArticles.indexOf(article);
if (index > -1) { 
    bookmarkedArticles.splice(index, 1);
}
}
function displayBookmarks() {
    displayedData = bookmarkedArticles
    displayNewsCards(bookmarkedArticles)
}
buttonBookmarks.addEventListener('click', displayBookmarks)
console.dir(bookmarkedArticles);
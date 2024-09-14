async function fetchLatestNews() {
    try {
        const response = await fetch('https://newsdata.io/api/1/latest?apikey=pub_5347050d3bb5290bcb45cd574cb7831f26f4d&category=politics&country=bd');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        displayNewsData(data);

    } catch (error) {
        console.error('Error fetching news data:', error);
    }
}

function displayNewsData(data) {
    data.results.forEach(article => {
        console.log(`Title: ${article.title}`);
        console.log(`Description: ${article.description}`);
        console.log(`Link: ${article.link}`);
    });
}

// Call the function to test
fetchLatestNews();

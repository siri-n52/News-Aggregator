const API_KEY = YOUR_API_KEY;
const articlesContainer = document.getElementById("articles-container");
const loadingIndicator = document.getElementById("loading-indicator");
const categoryTitle = document.getElementById("news-category-title");
const navLinks = document.querySelectorAll("nav a");

// Load general news by default
window.addEventListener("DOMContentLoaded", () => fetchNews("general"));

async function fetchNews(category = "general") {
    loadingIndicator.style.display = "block";
    articlesContainer.innerHTML = "";
    categoryTitle.textContent = `Latest ${capitalize(category)} News`;

    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        loadingIndicator.style.display = "none";

        if (!data.articles || data.articles.length === 0) {
            articlesContainer.innerHTML = "<p>No news found for this category.</p>";
            return;
        }

        data.articles.forEach(article => {
            const articleElement = document.createElement("article");

            articleElement.innerHTML = `
                <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="News Image">
                <div class="article-content">
                    <h3>${article.title}</h3>
                    <p>${article.description || "No description available."}</p>
                    <div class="article-meta">${new Date(article.publishedAt).toLocaleString()}</div>
                    <a href="${article.url}" target="_blank">Read more</a>
                </div>
            `;

            articlesContainer.appendChild(articleElement);
        });

    } catch (error) {
        console.error("Error fetching news:", error);
        articlesContainer.innerHTML = "<p>Error loading news. Please try again later.</p>";
        loadingIndicator.style.display = "none";
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Category buttons
navLinks.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        const category = link.getAttribute("data-category");
        fetchNews(category);
    });
});

// Chatbot behavior
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotContainer = document.getElementById("chatbot-container");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotSend = document.getElementById("chatbot-send");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMessages = document.getElementById("chatbot-messages");

chatbotToggle.addEventListener("click", () => {
    chatbotContainer.style.display = "flex";
});

chatbotClose.addEventListener("click", () => {
    chatbotContainer.style.display = "none";
});

chatbotSend.addEventListener("click", () => {
    const userInput = chatbotInput.value.trim();
    if (!userInput) return;

    addMessage(userInput, "user-message");

    // Check for small talk first
    const reply = handleSmallTalk(userInput);
    if (reply) {
        addMessage(reply, "bot-message");
        chatbotInput.value = "";
        return;
    }

    // Detect category
    const category = detectCategory(userInput);
    fetchNews(category);
    addMessage(`Here's the latest ${capitalize(category)} news for you.`, "bot-message");

    chatbotInput.value = "";
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
});

function addMessage(text, className) {
    const msg = document.createElement("div");
    msg.className = className === "user-message" ? "bot-message user" : "bot-message";
    msg.textContent = text;
    chatbotMessages.appendChild(msg);
}

function detectCategory(text) {
    const lower = text.toLowerCase();

    if (lower.includes("technology") || lower.includes("tech")) return "technology";
    if (lower.includes("sports") || lower.includes("cricket") || lower.includes("football")) return "sports";
    if (lower.includes("business") || lower.includes("finance") || lower.includes("money")) return "business";
    if (lower.includes("entertainment") || lower.includes("movies") || lower.includes("celeb")) return "entertainment";
    if (lower.includes("science")) return "science";
    if (lower.includes("health") || lower.includes("covid") || lower.includes("vaccine")) return "health";
    return "general";
}

function handleSmallTalk(text) {
    const lower = text.toLowerCase();
    if (["hi", "hello", "hey"].some(greet => lower.includes(greet))) {
        return "Hi there! 👋 What kind of news are you interested in today?";
    }
    if (lower.includes("how are you")) {
        return "I'm just a bunch of code, but I'm doing great! Ready to fetch some news?";
    }
    if (lower.includes("who are you")) {
        return "I'm your friendly NewsBot, here to keep you informed!";
    }
    if (lower.includes("thank")) {
        return "You're welcome! 😊";
    }
    if (lower.includes("bye")) {
        return "Goodbye! Come back soon for more news.";
    }

    return null;
}

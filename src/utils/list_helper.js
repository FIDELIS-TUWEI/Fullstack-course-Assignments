const dummy = (blogs) => {
    return 1
};

const totalLikes = (blogs) => {
    return blogs.reduce((total, blogs) => total + blogs.likes, 0);
};

const favoriteBlog = (blogs) => {
    let maxLikes = 0;
    let favoriteBlog = null;

    for (let blog of blogs) {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes;
            favoriteBlog = blog;
        }
    }

    return favoriteBlog;
};

const mostBlogs = (blogs) => {
    const authorCounts = blogs.reduce((count, blog) => {
        count[blog.author] = (count[blog.author] || 0) + 1;
        return count;
    }, {});

    let mostBlogsAuthor = '';
    let maxBlogs = 0;

    for (const author in authorCounts) {
        if (authorCounts[author] > maxBlogs) {
            mostBlogsAuthor = author;
            maxBlogs = authorCounts[author];
        }
    }

    return {
        author: mostBlogsAuthor,
        blogs: maxBlogs
    }
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;

    const likesPerAuthor = {};
    blogs.forEach((blog) => {
        if (likesPerAuthor[blog.author]) {
            likesPerAuthor[blog.author] += blog.likes;
        } else {
            likesPerAuthor[blog.author] = blog.likes;
        }
    });

    let mostLikes = 0;
    let favoriteAuthor = '';
    for (const author in likesPerAuthor) {
        if (likesPerAuthor[author] > mostLikes) {
            mostLikes = likesPerAuthor[author];
            favoriteAuthor = author;
        }
    }

    return {
        author: favoriteAuthor,
        likes: mostLikes
    };
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
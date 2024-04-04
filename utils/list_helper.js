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
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
};
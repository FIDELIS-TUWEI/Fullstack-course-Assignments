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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
};
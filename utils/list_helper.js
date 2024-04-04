const dummy = (blogs) => {
    return 1
};

const totalLikes = (blogs) => {
    return blogs.reduce((total, blogs) => total + blogs.likes, 0);
};

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;

    const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes ? prev : current));

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
};
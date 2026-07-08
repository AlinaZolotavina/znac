const getDate = (timestamp) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = timestamp.slice(8, 10);
    const month = parseInt(timestamp.slice(5, 7), 10);
    const year = timestamp.slice(0, 4);
    return `${day} ${months[month - 1]} ${year}`;
};

export default getDate;
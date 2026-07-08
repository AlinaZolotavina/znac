const getCurrentActivePage = (pathname) => {
    const index = pathname.lastIndexOf('/');
    return pathname.substring(index + 1);
};

export default getCurrentActivePage;
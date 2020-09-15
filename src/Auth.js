const loggedIn = async () => {
    const response = await fetch('https://dog.ceo/api/breeds/list/all', {
        method: 'GET'
    });
    const data = await response.json();
    return data;
}

export default loggedIn();
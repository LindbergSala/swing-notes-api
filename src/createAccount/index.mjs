export const handler = async (event) => {
    const account = JSON.parse(event.body); // { username, password, email }


    return {
        statusCode: 200,
        body: JSON.stringify({ success: true, account }),
    };
};
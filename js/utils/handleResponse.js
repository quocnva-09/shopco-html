export const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
    }
    return data;
};

export default handleResponse;
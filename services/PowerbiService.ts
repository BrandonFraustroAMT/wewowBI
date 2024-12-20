import axios from "axios";

/* const BackendURL = 'http://40.124.176.57:8082/api' */
const BackendURL = 'https://wewowatwork.com:4434/api'
/* const BackendURL = 'http://localhost:8082/api' */

export const getUrlEmbed = async () => {
    try {
        const response = await axios.get(`${BackendURL}/urlembed`)
        return response
    } catch(error) {
        return error
    }
}

export const getEmbedToken = async () => {
    try {
        const response = await axios.get(`${BackendURL}/tokenembed`);
        return response
    } catch(error) {
        return error
    }
}

export const getUrlEmbedTable = async () => {
    try {
        const response = await axios.get(`${BackendURL}/urlembedtable`)
        return response
    } catch(error) {
        return error
    }
}

export const getEmbedTokenTable = async () => {
    try {
        const response = await axios.get(`${BackendURL}/tokenembedtable`);
        return response
    } catch(error) {
        return error
    }
}
import axios from "axios";

/* const BackendURL = 'http://40.124.176.57:8082/api' */
const BackendURL = 'https://wewowatwork.com:4434/api'

const getAnswersID = async (id: number) => {
  try {
    const response = await axios.get(`${BackendURL}/bdinf/${id}`);
    //console.log("Dimensions Data", response.data);
    return response.data;
  } catch(err: any) {
    //console.log("Dimensions error", err);
    return err;
  }

}

export default {getAnswersID};
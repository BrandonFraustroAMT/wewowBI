import axios from "axios";

const baseURL = 'http://localhost:8080/api';

const getRespuestas = async (id:number) => {
  try {
    const response = await axios.get(`${baseURL}/bdinf/${id}`)
    //console.log("Response getrespuestas: ", response.data);
    return response.data;
  } catch(e: any) {
    console.log("Error getrespuestas: ", e);
  }
}


export default {getRespuestas}
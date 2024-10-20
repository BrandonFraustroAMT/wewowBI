import axios from "axios";

const BackendURL = 'http://40.124.176.57:8082/api'
/* const BackendURL = 'http://20.65.225.187:8082/api' */

const getEmpresasModulos = async () => {
  try {
    const response = await axios.get(`${BackendURL}/empresasmodulos`)
    //console.log("Response getempresas: ", response.data);
    return response.data;
  } catch(e: any) {
    //console.log("Error getempresas: ", e);
  }
}
import axios from "axios";

/* const BackendURL = 'http://40.124.176.57:8082/api' */
const BackendURL = 'http://20.65.225.187:8082/api'

const getEmpresas = async () => {
  try {
    const response = await axios.get(`${BackendURL}/empresas`)
    //console.log("Response getempresas: ", response.data);
    return response.data;
  } catch(e: any) {
    //console.log("Error getempresas: ", e);
  }
}

const getEmpresaId = async (id:number) => {
  try {
    const response = await axios.get(`${BackendURL}/empresas/${id}`)
    //console.log("Response getempresaid: ", response.data);
    return response.data
  } catch(e:any) {
    //console.log("Error getempresaid: ", e.message);
    return e.message
  }
}

export default {getEmpresas, getEmpresaId}
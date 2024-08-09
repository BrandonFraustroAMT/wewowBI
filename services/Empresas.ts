import axios from "axios";

const BackendURL = 'http://localhost:8080/api'

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
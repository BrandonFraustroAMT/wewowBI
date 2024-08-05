import axios from "axios";

const BackendURL = 'http://localhost:8080/api'

const getDimensionsByEmp = async (id: number) => {
  try {
    const response = await axios.get(`${BackendURL}/tindl010/dimensions/${id}`);
    //console.log("Dimensions Data", response.data);
    return response.data;
  } catch(err: any) {
    //console.log("Dimensions error", err);
    return err;
  }

}

export default {getDimensionsByEmp};
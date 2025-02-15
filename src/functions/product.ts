import axios from "axios";

export interface ProdData {
  name: string;
  description: string;
  price: Number;
  category: string;
  imglink: string;
  composition: string;
  gender: string;
  required_measurements: string[];
}

export async function deleteProduct(id:number) {
    try {
        const response = await axios.delete(`http://localhost:8000/api/admin/product`, {
            params: { id: id },
            withCredentials: true
        });
        return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error))
        return error.response ? error.response.data : error.message;
    }
}

export async function addNewProduct(data:ProdData) {
    try 
    {
        const response = await axios.post('http://127.0.0.1:8000/api/product', data, {withCredentials: true});
        console.log(response.data);
        return true
    }
    catch (error) 
    {
        console.error('Произошла ошибка!', error);
        return false
    }
}

export async function getProduct(id:number) {
    try {
      const response = await axios.get(`http://localhost:8000/api/product/` + id, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  

export async function getCatalog () {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/product/', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
    throw error;
  }
};

export async function getMeasurements () {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/product/measurements', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении мерок:', error);
    throw error;
  }
};

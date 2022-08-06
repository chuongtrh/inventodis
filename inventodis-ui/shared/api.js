import ky from "ky-universal";

export const apiServer = process.env.NEXT_PUBLIC_API_SERVER;

const api = ky.create({
  prefixUrl: apiServer,
  timeout: 300000,
  retry: 0,
});

class Api {
  getStores = (query) => {
    const queryString = new URLSearchParams(query).toString();
    return api.get(`store?${queryString}`).json();
  };
  getStoreInventory = (id) => {
    return api.get(`store/${id}/inventory`).json();
  };
}

export default new Api();

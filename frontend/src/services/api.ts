import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productosAPI = {
    buscarPorCodigoBarras: async (codigoBarras: string) => {
        const response = await api.get(`/productos/barras/${codigoBarras}`);
        return response.data;
    },

    listarTodos: async (limite: number = 100) => {
        const response = await api.get(`/productos?limite=${limite}`);
        return response.data;
    },

    proximosACaducar: async (dias: number = 30) => {
        const response = await api.get(`/productos/caducar?dias=${dias}`);
        return response.data;
    },

    stockBajo: async (minimo: number = 10) => {
        const response = await api.get(`/productos/stock-bajo?minimo=${minimo}`);
        return response.data;
    },
};

export const ventasAPI = {
    ventasDelDia: async () => {
        const response = await api.get('/ventas/hoy');
        return response.data;
    },

    ventasPorRango: async (fechaInicio: string, fechaFin: string) => {
        const response = await api.get(`/ventas/rango?inicio=${fechaInicio}&fin=${fechaFin}`);
        return response.data;
    },
};

export default api;

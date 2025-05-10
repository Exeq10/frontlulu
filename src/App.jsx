import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Statistics from './components/Statistics';
import VentaCalculator from './components/VentaCalculator';

const API = 'https://backendlulu.onrender.com/api/productos';

const App = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProductos = async () => {
    try {
      const res = await axios.get(API);
      setProductos(res.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const venderProducto = async (id) => {
    try {
      await axios.put(`${API}/vender/${id}`);
      fetchProductos();
    } catch (err) {
      console.error('Error al vender producto:', err);
    }
  };


  const desmarcarProductoComoVendido = async (id) => {
    try {
      await axios.put(`${API}/desvender/${id}`);
      fetchProductos();
    } catch (err) {
      console.error('Error al desmarcar producto como vendido:', err);
    }
  };
  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchProductos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
    }
  };

  const editarProducto = (producto) => {
    setSelectedProduct(producto);
  };

  const handleProductSubmit = async (form) => {
  try {
    if (form._id) {
      // Actualizar producto existente
      await axios.put(`${API}/${form._id}`, form);
      fetchProductos();
      setSelectedProduct(null);
      return { ...form }; // Retorna el producto actualizado por si querés mostrarlo también
    } else {
      // Crear nuevo producto
      const response = await axios.post(API, form);
      fetchProductos();
      return response.data; // ✅ Retornamos el producto creado con _id
    }
  } catch (err) {
    console.error('Error al guardar producto:', err.response?.data || err.message);
    return null;
  }
};

  return (
    <div className="p-4 w-full  mx-auto bg-[var(--color-background)] rounded-xl shadow-md">

<div className='w-full flex justify-start mb-4'> 
  <img className='w-20 h-20' src="/logo.png" alt="logo" />
</div>

      <ProductForm 
        onSubmit={handleProductSubmit} // ✅ Agregada esta línea
        editingProduct={selectedProduct}
      />


      <ProductList 
  productos={productos} 
  onSell={venderProducto} 
  onUnsell={desmarcarProductoComoVendido} 
  onDelete={eliminarProducto} 
  onEdit={editarProducto}
/>
      <Statistics productos={productos} />




    </div>
  );
};

export default App;

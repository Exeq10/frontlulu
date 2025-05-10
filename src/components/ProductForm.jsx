import React, { useEffect, useState } from 'react';

const initialForm = {
  nombre: '', talle: '', categoria: '', color: '', precio: ''
};

const ProductForm = ({ onSubmit, editingProduct }) => {
  const [form, setForm] = useState(initialForm);
  const [createdProduct, setCreatedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    } else {
      setForm(initialForm);
    }
  }, [editingProduct]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await onSubmit(form); // Esperamos la respuesta con el _id
    if (result && result._id) {
      setCreatedProduct(result);
      setShowModal(true);
      setForm(initialForm);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3 mb-6 bg-amber-50 p-4 rounded-xl shadow w-[60%] m-auto ">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="border border-[var(--color-primario)] p-2 w-full rounded bg-white text-[var(--color-text)]" />
        <input name="talle" placeholder="Talle" value={form.talle} onChange={handleChange} className="border border-[var(--color-primario)] p-2 w-full rounded bg-white text-[var(--color-text)]" />
        <input name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} className="border border-[var(--color-primario)] p-2 w-full rounded bg-white text-[var(--color-text)]" />
        <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className="border border-[var(--color-primario)] p-2 w-full rounded bg-white text-[var(--color-text)]" />
        <input name="precio" placeholder="Precio" type="number" value={form.precio} onChange={handleChange} className="border border-[var(--color-primario)] p-2 w-full rounded bg-white text-[var(--color-text)]" />
        <button type="submit" className="bg-[var(--color-accent)] text-[var(--color-text)] px-4 py-2 rounded hover:bg-[var(--color-highlight)]">
          {form._id ? 'Actualizar' : 'Agregar'} producto
        </button>
      </form>

      {showModal && createdProduct && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Producto creado exitosamente</h2>
            <p><strong>COD:</strong> {createdProduct.COD}</p>
            <p><strong>Nombre:</strong> {createdProduct.nombre}</p>
           
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductForm;

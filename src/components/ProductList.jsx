import React, { useState } from 'react';
import ProductItem from './ProductItem';
import dayjs from 'dayjs';

const ProductList = ({ productos, onEdit, onDelete, onSell, onUnsell }) => {
  const [busqueda, setBusqueda] = useState('');
  const [verAtrasados, setVerAtrasados] = useState(false);

  const hoy = dayjs();

  const filtrados = productos.filter(p =>
    p.COD?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Filtramos los productos según el botón "ver atrasados"
  const productosDisponibles = filtrados.filter(p => {
    if (p.estado === 'vendido') return false;
    if (!verAtrasados) return true;

    const dias = hoy.diff(dayjs(p.createdAt), 'day');
    return dias > 45;
  });

  const productosVendidos = filtrados.filter(p => p.estado === 'vendido');

  const totalPrecio = productosDisponibles.reduce((acc, prod) => acc + Number(prod.precio), 0);

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por código..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded bg-white"
        />
        <button
          onClick={() => setVerAtrasados(!verAtrasados)}
          className="bg-[var(--color-primario)] text-white px-4 py-2 rounded hover:opacity-90"
        >
          {verAtrasados ? 'Ver todos' : 'Ver atrasados'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Disponibles */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3 text-color-text">
            {verAtrasados ? 'Atrasados' : 'A la venta'} / total artículos: <span className='text-green-500'>{productosDisponibles.length}</span>
          </h3>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left border-b">
                  <th>Nombre</th>
                  <th>Cat.</th>
                  <th>Color</th>
                  <th>Precio</th>
                  <th>COD</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosDisponibles.map(p => {
                  const dias = hoy.diff(dayjs(p.createdAt), 'day');
                  const atrasado = dias > 45;

                  return (
                    <ProductItem
                      key={p._id}
                      producto={{ ...p, atrasado }}
                      onEdit={() => onEdit(p)}
                      onDelete={() => onDelete(p._id)}
                      onSell={() => onSell(p._id)}
                      onUnsell={() => onUnsell(p._id)}
                      esTabla
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-right text-color-text font-semibold">
            Total en productos disponibles: ${totalPrecio}
          </p>
        </div>

        {/* Vendidos */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3 text-color-text">Vendidos</h3>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left border-b">
                  <th>Nombre</th>
                  <th>Cat.</th>
                  <th>Color</th>
                  <th>Precio</th>
                  <th>COD</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosVendidos.map(p => (
                  <ProductItem
                    key={p._id}
                    producto={p}
                    onEdit={() => onEdit(p)}
                    onDelete={() => onDelete(p._id)}
                    onSell={() => onSell(p._id)}
                    onUnsell={() => onUnsell(p._id)}
                    esTabla
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

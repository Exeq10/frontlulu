import React from 'react';
import dayjs from 'dayjs';

const ProductItem = ({ producto, onEdit, onDelete, onSell, onUnsell, esTabla }) => {
  const hoy = dayjs();
  const creado = dayjs(producto.createdAt); // createdAt viene del modelo con timestamps: true
  const sinVenderHace45Dias = producto.estado !== 'vendido' && hoy.diff(creado, 'day') > 45;

  const acciones = (
    <div className="flex flex-wrap gap-2">
      {producto.estado === 'vendido' ? (
        <button
          onClick={onUnsell}
          className="bg-[var(--color-highlight)] text-[var(--color-text)] px-2 py-1 rounded hover:opacity-90"
        >
          Deshacer venta
        </button>
      ) : (
        <button
          onClick={onSell}
          className="bg-[var(--color-softBlue)] text-[var(--color-text)] px-2 py-1 rounded hover:opacity-90"
        >
          Vender
        </button>
      )}
      <button
        onClick={onEdit}
        className="bg-[var(--color-accent)] text-[var(--color-text)] px-3 py-1 rounded hover:opacity-90"
      >
        Editar
      </button>
      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Eliminar
      </button>
    </div>
  );

  if (esTabla) {
    return (
      <tr
        className={`border-b text-[var(--color-text)] ${
          sinVenderHace45Dias ? 'bg-yellow-100' : ''
        }`}
      >
        <td className="py-2 capitalize">{producto.nombre}</td>
        <td className='capitalize'>{producto.categoria}</td>
        <td className='capitalize'>{producto.color}</td>
        <td className='capitalize'>${producto.precio}</td>
        <td className='capitalize'>{producto.COD}</td>
        <td>{acciones}</td>
      </tr>
    );
  }

  return (
    <li
      className={`border ${
        sinVenderHace45Dias ? 'border-yellow-500 bg-yellow-50' : 'border-[var(--color-primario)] bg-white'
      } p-4 rounded-xl flex justify-between items-center shadow`}
    >
      <div className="text-[var(--color-text)]">
        <strong>{producto.nombre}</strong> - {producto.categoria} - {producto.color} - ${producto.precio} - {producto.estado.toUpperCase()} - {producto.COD}
        {sinVenderHace45Dias && (
          <span className="ml-2 text-yellow-700 font-semibold">(¡45 días sin vender!)</span>
        )}
      </div>
      {acciones}
    </li>
  );
};

export default ProductItem;

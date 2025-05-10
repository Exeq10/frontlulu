// src/components/VentaCalculator.jsx
import React, { useMemo, useState } from 'react';

const VentaCalculator = ({ productos }) => {
  const vendidos = useMemo(() => productos.filter(p => p.estado === 'vendido'), [productos]);

  const total = vendidos.reduce((acc, p) => acc + p.precio, 0);
  const [pagoCliente, setPagoCliente] = useState('');
  const cambio = pagoCliente - total;

  const handleReset = () => {
    setPagoCliente('');  // Resetea el input del monto recibido
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">Resumen de Venta</h2>

      <p>Total vendido: <strong>${total.toFixed(2)}</strong></p>

      <label className="block mt-2">
        Monto recibido del cliente:
        <input
          type="number"
          value={pagoCliente}
          onChange={(e) => setPagoCliente(e.target.value)}
          className="mt-1 p-1 border rounded w-full"
        />
      </label>

      {pagoCliente && (
        <p className="mt-2">
          Cambio a devolver: <strong className={cambio < 0 ? 'text-red-600' : 'text-green-600'}>
            ${cambio.toFixed(2)}
          </strong>
        </p>
      )}

      <button
        onClick={handleReset}  // Resetea solo los valores internos
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Resetear
      </button>
    </div>
  );
};

export default VentaCalculator;

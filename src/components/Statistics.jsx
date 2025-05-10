import React, { useState } from 'react';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const Statistics = ({ productos }) => {
  const now = dayjs();
  const [selectedMonth, setSelectedMonth] = useState(now.month());
  const [selectedYear, setSelectedYear] = useState(now.year());
  const [selectedDay, setSelectedDay] = useState('');

  const vendidosDelMes = productos.filter(p => {
    if (p.estado !== 'vendido' || !p.fechaVenta) return false;
    const fecha = dayjs(p.fechaVenta);
    return fecha.month() === selectedMonth && fecha.year() === selectedYear;
  });

  const totalGanancia = vendidosDelMes.reduce((acc, p) => acc + p.precio, 0);

  const productosMasVendidos = Object.entries(
    vendidosDelMes.reduce((acc, p) => {
      acc[p.nombre] = (acc[p.nombre] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const gananciaPorDia = vendidosDelMes.reduce((acc, p) => {
    const dia = dayjs(p.fechaVenta).format('YYYY-MM-DD');
    acc[dia] = (acc[dia] || 0) + p.precio;
    return acc;
  }, {});

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Estadísticas de ${months[selectedMonth]} ${selectedYear}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Total vendidos: ${vendidosDelMes.length}`, 10, 25);
    doc.text(`Ganancia total: $${totalGanancia.toFixed(2)}`, 10, 35);
    doc.text('Top 3 productos más vendidos:', 10, 50);
    productosMasVendidos.forEach(([nombre, cantidad], i) => {
      doc.text(`${i + 1}. ${nombre}: ${cantidad} ventas`, 10, 60 + i * 10);
    });

    const offset = 60 + productosMasVendidos.length * 10 + 10;
    doc.text('Ganancias por día:', 10, offset);
    Object.entries(gananciaPorDia).forEach(([dia, total], i) => {
      doc.text(`${dia}: $${total.toFixed(2)}`, 10, offset + 10 + i * 10);
    });

    doc.save(`estadisticas-${selectedMonth + 1}-${selectedYear}.pdf`);
  };

  const gananciaDelDiaSeleccionado = selectedDay ? gananciaPorDia[selectedDay] || 0 : null;

  return (
    <div className="mt-8 bg-white text-gray-800 p-6 rounded-xl shadow border">
      <h2 className="text-2xl font-bold mb-4">Estadísticas por mes</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Mes:</label>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="border rounded p-2"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Año:</label>
          <input
            type="number"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Día:</label>
          <select
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Seleccionar</option>
            {Object.keys(gananciaPorDia).sort().map(fecha => (
              <option key={fecha} value={fecha}>{fecha}</option>
            ))}
          </select>
        </div>

        <div className="self-end">
          <button
            onClick={generarPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Descargar PDF
          </button>
        </div>
      </div>

      <p><strong>Total vendidos:</strong> {vendidosDelMes.length}</p>
      <p><strong>Ganancia total:</strong> ${totalGanancia.toFixed(2)}</p>

      {selectedDay && (
        <p><strong>Ganancia del {selectedDay}:</strong> ${gananciaDelDiaSeleccionado.toFixed(2)}</p>
      )}

      <h3 className="mt-4 font-semibold">Top 3 productos más vendidos:</h3>
      <ul className="list-disc pl-6">
        {productosMasVendidos.length > 0 ? (
          productosMasVendidos.map(([nombre, cantidad]) => (
            <li key={nombre}>{nombre}: {cantidad} ventas</li>
          ))
        ) : (
          <li>No hay ventas este mes</li>
        )}
      </ul>

      <h3 className="mt-6 font-semibold">Ganancias por día:</h3>
      <table className="w-full text-left border mt-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Ganancia</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gananciaPorDia).sort().map(([dia, total]) => (
            <tr key={dia}>
              <td className="p-2 border">{dia}</td>
              <td className="p-2 border">${total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;

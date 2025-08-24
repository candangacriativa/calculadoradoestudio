import React, { useMemo, useState } from "react";

// --- Utils ---
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function App() {
  const [tipo, setTipo] = useState("podcast");
  const [horas, setHoras] = useState(1);
  const [cortesRedes, setCortesRedes] = useState(0);
  const [cortesYoutube, setCortesYoutube] = useState(0);

  // cálculo com limite de 6h por ciclo e detalhamento
  const { valorBase, detalhes } = useMemo(() => {
    if (horas <= 0) return { valorBase: 0, detalhes: [] };

    let total = 0;
    let horasRestantes = horas;
    let ciclo = 1;
    const detalhes = [];

    while (horasRestantes > 0) {
      let subtotal = 0;
      // primeira hora do ciclo
      if (tipo === "podcast") {
        subtotal += 700;
      } else if (tipo === "clipe") {
        subtotal += 1000;
      }
      horasRestantes -= 1;

      // adicionais do ciclo (até 5h)
      const adicionais = Math.min(5, horasRestantes);
      if (tipo === "podcast") {
        subtotal += adicionais * 500;
      } else if (tipo === "clipe") {
        subtotal += adicionais * 700;
      }
      horasRestantes -= adicionais;

      detalhes.push(`Ciclo ${ciclo}: ${brl.format(subtotal)}`);
      ciclo++;
      total += subtotal;
    }

    return { valorBase: total, detalhes };
  }, [tipo, horas]);

  const valorCortes = useMemo(() => {
    return cortesRedes * 150 + cortesYoutube * 200;
  }, [cortesRedes, cortesYoutube]);

  const total = valorBase + valorCortes;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto grid gap-6">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold">Calculadora de Gravação</h1>
        </header>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 grid gap-4">
          <div>
            <label className="block text-sm mb-1">Tipo de gravação</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
            >
              <option value="podcast">Podcast / Curso</option>
              <option value="clipe">Clipes / Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Quantidade de horas</label>
            <input
              type="number"
              min={1}
              value={horas}
              onChange={(e) => setHoras(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Cortes p/ redes sociais</label>
              <input
                type="number"
                min={0}
                value={cortesRedes}
                onChange={(e) => setCortesRedes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Cortes p/ YouTube</label>
              <input
                type="number"
                min={0}
                value={cortesYoutube}
                onChange={(e) => setCortesYoutube(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <h2 className="font-semibold mb-2">Resumo</h2>
          <div className="space-y-1 text-sm">
            {detalhes.map((d, idx) => (
              <div key={idx} className="flex justify-between"><span className="text-gray-600">{d.split(":")[0]}</span><span>{d.split(":")[1]}</span></div>
            ))}
            <Row label="Cortes" value={brl.format(valorCortes)} />
            <hr className="my-2" />
            <Row label="Total" value={brl.format(total)} bold large />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold = false, large = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-gray-600 ${large ? "text-base" : "text-sm"}`}>{label}</span>
      <span className={`${bold ? "font-semibold" : ""} ${large ? "text-lg" : ""}`}>{value}</span>
    </div>
  );
}

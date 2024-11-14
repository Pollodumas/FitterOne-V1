import React from 'react';
import { Client, ProgressRecord } from '../../types/Trainer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ClientProgressProps {
  client: Client;
}

export const ClientProgress: React.FC<ClientProgressProps> = ({ client }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Progreso de {client.profile.name}
        </h2>
        <p className="text-gray-400">
          Seguimiento del progreso y mediciones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Evolución del Peso
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={client.progress}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#2DD4BF"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Registro de Mediciones
          </h3>
          <div className="space-y-4">
            {client.progress.map((record: ProgressRecord, index: number) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">
                    {formatDate(record.date)}
                  </span>
                  <span className="text-teal-400 font-medium">
                    {record.weight} kg
                  </span>
                </div>
                {record.measurements && (
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    {record.measurements.chest && (
                      <p>Pecho: {record.measurements.chest} cm</p>
                    )}
                    {record.measurements.waist && (
                      <p>Cintura: {record.measurements.waist} cm</p>
                    )}
                    {record.measurements.arms && (
                      <p>Brazos: {record.measurements.arms} cm</p>
                    )}
                    {record.measurements.legs && (
                      <p>Piernas: {record.measurements.legs} cm</p>
                    )}
                  </div>
                )}
                {record.notes && (
                  <p className="mt-2 text-sm text-gray-400">{record.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
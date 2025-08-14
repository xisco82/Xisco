
import React, { useState } from 'react';
import { ExtraOrder } from '../types';
import Header from '../components/Header';
import Modal from '../components/Modal';

const initialOrders: ExtraOrder[] = [];

const ExtrasView: React.FC = () => {
    const [orders, setOrders] = useState<ExtraOrder[]>(initialOrders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOrder, setNewOrder] = useState({ guestName: '', roomNumber: '', regime: '', compensationReason: '', startDate: '', endDate: '' });

    const handleAddOrder = () => {
        if (!newOrder.guestName || !newOrder.roomNumber || !newOrder.regime || !newOrder.compensationReason || !newOrder.startDate || !newOrder.endDate) return;
        const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
        setOrders([...orders, { ...newOrder, id: newId }]);
        setIsModalOpen(false);
        setNewOrder({ guestName: '', roomNumber: '', regime: '', compensationReason: '', startDate: '', endDate: '' });
    };

    return (
        <div>
            <Header title="Restaurante">
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Añadir Compensación
                </button>
            </Header>
            <div className="p-4 space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                        <div className="flex justify-between items-start">
                             <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{order.guestName} - Hab. {order.roomNumber}</h3>
                             <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">{order.regime}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{order.compensationReason}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Desde: {order.startDate} - Hasta: {order.endDate}
                        </p>
                    </div>
                ))}
                 {orders.length === 0 && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        No hay compensaciones registradas.
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Compensación de Restaurante">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Nombre del Huésped" value={newOrder.guestName} onChange={(e) => setNewOrder({ ...newOrder, guestName: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="Nº Habitación" value={newOrder.roomNumber} onChange={(e) => setNewOrder({ ...newOrder, roomNumber: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <input type="text" placeholder="Régimen (ej. TI, MP)" value={newOrder.regime} onChange={(e) => setNewOrder({ ...newOrder, regime: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <textarea placeholder="Motivo de compensación" value={newOrder.compensationReason} onChange={(e) => setNewOrder({ ...newOrder, compensationReason: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Fecha Inicio</label>
                            <input type="date" value={newOrder.startDate} onChange={(e) => setNewOrder({ ...newOrder, startDate: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Fecha Fin</label>
                            <input type="date" value={newOrder.endDate} onChange={(e) => setNewOrder({ ...newOrder, endDate: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <button onClick={handleAddOrder} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Guardar Compensación
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ExtrasView;
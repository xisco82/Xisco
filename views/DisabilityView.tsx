
import React, { useState, useMemo } from 'react';
import { AccessibilityBooking } from '../types';
import Header from '../components/Header';
import Modal from '../components/Modal';

const initialBookings: AccessibilityBooking[] = [];

const AccessibilityCard: React.FC<{ booking: AccessibilityBooking, onDelete: (id: number) => void }> = ({ booking, onDelete }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md relative animate-fade-in">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{booking.guestName}</h3>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Habitación {booking.roomNumber}</p>
            </div>
            <button 
                onClick={() => onDelete(booking.id)} 
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-full absolute top-2 right-2"
                aria-label="Eliminar registro"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{booking.disabilityInfo}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            Check-out: {new Date(booking.departureDate + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
    </div>
);

const DisabilityView: React.FC = () => {
    const [bookings, setBookings] = useState<AccessibilityBooking[]>(initialBookings);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBooking, setNewBooking] = useState({
        guestName: '',
        roomNumber: '',
        arrivalDate: new Date().toISOString().split('T')[0],
        departureDate: '',
        disabilityInfo: ''
    });

    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    const currentBookings = useMemo(() => {
        return bookings
            .filter(b => b.arrivalDate <= today && b.departureDate >= today)
            .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }));
    }, [bookings, today]);

    const handleAddBooking = () => {
        if (!newBooking.guestName || !newBooking.roomNumber || !newBooking.arrivalDate || !newBooking.departureDate || !newBooking.disabilityInfo) {
            alert('Por favor, complete todos los campos.');
            return;
        }
        if (newBooking.arrivalDate > newBooking.departureDate) {
            alert('La fecha de llegada no puede ser posterior a la fecha de salida.');
            return;
        }
        const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
        setBookings([...bookings, { ...newBooking, id: newId }]);
        setIsModalOpen(false);
        setNewBooking({
            guestName: '',
            roomNumber: '',
            arrivalDate: new Date().toISOString().split('T')[0],
            departureDate: '',
            disabilityInfo: ''
        });
    };

    const handleDeleteBooking = (id: number) => {
        if (window.confirm("¿Seguro que quieres eliminar este registro?")) {
            setBookings(bookings.filter(b => b.id !== id));
        }
    };
    
    return (
        <div>
            <Header title="Accesibilidad">
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Añadir Huésped
                </button>
            </Header>
            <div className="p-4 space-y-4">
                {currentBookings.length > 0 ? (
                    currentBookings.map(booking => (
                        <AccessibilityCard key={booking.id} booking={booking} onDelete={handleDeleteBooking} />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        No hay huéspedes con necesidades especiales registrados actualmente.
                    </div>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Registro de Accesibilidad">
                <div className="space-y-4">
                    <input type="text" placeholder="Nombre del Huésped" value={newBooking.guestName} onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Nº Habitación" value={newBooking.roomNumber} onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Fecha Llegada</label>
                            <input type="date" value={newBooking.arrivalDate} onChange={(e) => setNewBooking({ ...newBooking, arrivalDate: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Fecha Salida</label>
                            <input type="date" value={newBooking.departureDate} onChange={(e) => setNewBooking({ ...newBooking, departureDate: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <textarea placeholder="Descripción de la discapacidad o necesidad especial" value={newBooking.disabilityInfo} onChange={(e) => setNewBooking({ ...newBooking, disabilityInfo: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4}></textarea>
                    <button onClick={handleAddBooking} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Guardar Registro
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default DisabilityView;

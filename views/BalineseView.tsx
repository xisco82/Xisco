
import React, { useState } from 'react';
import { BalineseBedBooking } from '../types';
import Header from '../components/Header';
import Modal from '../components/Modal';

const TOTAL_BEDS = 6;

const initialBookings: BalineseBedBooking[] = [];

const BalineseBed: React.FC<{ bedId: number; booking: BalineseBedBooking | undefined; onBook: (bedId: number) => void; onCancel: (bedId: number) => void }> = ({ bedId, booking, onBook, onCancel }) => {
    const isBooked = !!booking;
    return (
        <div className={`p-4 rounded-xl shadow-lg text-center transition-all duration-300 ${isBooked ? 'bg-red-200 dark:bg-red-900' : 'bg-green-200 dark:bg-green-800'}`}>
            <h3 className="font-bold text-2xl text-gray-800 dark:text-gray-100">Cama {bedId}</h3>
            {isBooked ? (
                <div className="mt-2 text-red-800 dark:text-red-100">
                    <p className="font-semibold">{booking.guestName}</p>
                    <p className="text-sm">Hab. {booking.roomNumber}</p>
                    <button onClick={() => onCancel(bedId)} className="mt-3 bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 transition">Cancelar</button>
                </div>
            ) : (
                <div className="mt-2 text-green-800 dark:text-green-100">
                    <p className="font-semibold">Disponible</p>
                    <button onClick={() => onBook(bedId)} className="mt-3 bg-green-600 text-white px-3 py-1 text-sm rounded-md hover:bg-green-700 transition">Reservar</button>
                </div>
            )}
        </div>
    );
}

const BalineseView: React.FC = () => {
    const [bookings, setBookings] = useState<BalineseBedBooking[]>(initialBookings);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBedId, setCurrentBedId] = useState<number | null>(null);
    const [newBooking, setNewBooking] = useState({ guestName: '', roomNumber: '' });
    
    // NOTE: In a real app, bookings would be fetched based on selectedDate
    const bookingsForDate = bookings;

    const handleOpenModal = (bedId: number) => {
        setCurrentBedId(bedId);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentBedId(null);
        setNewBooking({ guestName: '', roomNumber: '' });
    };

    const handleBookBed = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBedId || !newBooking.guestName || !newBooking.roomNumber) return;

        const bookingData = {
            _subject: `Nueva Reserva: Cama Balinesa #${currentBedId}`,
            Tipo: "Cama Balinesa",
            "Cama No.": currentBedId,
            "Nombre Huésped": newBooking.guestName,
            "Habitación No.": newBooking.roomNumber,
            Fecha: selectedDate,
        };

        try {
            const response = await fetch("https://formsubmit.co/ajax/xiscoquin@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }
            
            setBookings([...bookings, { bedId: currentBedId, ...newBooking }]);
            handleCloseModal();

        } catch (error) {
            console.error(error);
            alert("Hubo un error al enviar la reserva. Por favor, inténtelo de nuevo.");
        }
    };
    
    const handleCancelBooking = (bedId: number) => {
        if (window.confirm("¿Seguro que quieres cancelar esta reserva?")) {
            setBookings(bookings.filter(b => b.bedId !== bedId));
        }
    };

    return (
        <div>
            <Header title="Control de Balinesas" />
            <div className="p-4">
                <div className="mb-6">
                    <label htmlFor="date-picker" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seleccionar Fecha:</label>
                    <input 
                        type="date"
                        id="date-picker"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: TOTAL_BEDS }, (_, i) => i + 1).map(bedId => (
                        <BalineseBed 
                            key={bedId} 
                            bedId={bedId} 
                            booking={bookingsForDate.find(b => b.bedId === bedId)}
                            onBook={handleOpenModal}
                            onCancel={handleCancelBooking}
                        />
                    ))}
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Reservar Cama ${currentBedId}`}>
                <form onSubmit={handleBookBed}>
                    <div className="space-y-4">
                        <input type="text" placeholder="Nombre del Huésped" value={newBooking.guestName} onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        <input type="text" placeholder="Número de Habitación" value={newBooking.roomNumber} onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            Confirmar Reserva
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BalineseView;
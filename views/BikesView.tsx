
import React, { useState } from 'react';
import { BikeBooking } from '../types';
import Header from '../components/Header';
import Modal from '../components/Modal';

const TOTAL_BIKES = 15;

const initialBookings: BikeBooking[] = [];

const Bike: React.FC<{ 
    bikeId: number; 
    booking: BikeBooking | undefined; 
    onBook: (bikeId: number) => void; 
    onCancel: (bikeId: number) => void;
}> = ({ bikeId, booking, onBook, onCancel }) => {
    const isBooked = !!booking;
    return (
        <div className={`p-3 rounded-xl shadow-lg text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] ${isBooked ? 'bg-red-200 dark:bg-red-900' : 'bg-green-200 dark:bg-green-800'}`}>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Bici {bikeId}</h3>
            {isBooked ? (
                <div className="mt-2 text-red-800 dark:text-red-100">
                    <p className="font-semibold text-sm break-all">{booking.guestName}</p>
                    <p className="text-xs">Hab. {booking.roomNumber}</p>
                    <button onClick={() => onCancel(bikeId)} className="mt-2 bg-red-500 text-white px-3 py-1 text-xs rounded-md hover:bg-red-600 transition">Cancelar</button>
                </div>
            ) : (
                <div className="mt-2 text-green-800 dark:text-green-100">
                    <p className="font-semibold text-sm">Disponible</p>
                    <button onClick={() => onBook(bikeId)} className="mt-2 bg-green-600 text-white px-3 py-1 text-xs rounded-md hover:bg-green-700 transition">Reservar</button>
                </div>
            )}
        </div>
    );
}

const BikesView: React.FC = () => {
    const [bookings, setBookings] = useState<BikeBooking[]>(initialBookings);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBikeId, setCurrentBikeId] = useState<number | null>(null);
    const [newBooking, setNewBooking] = useState({ guestName: '', roomNumber: '' });
    
    const bookingsForDate = bookings.filter(b => b.date === selectedDate);

    const handleOpenModal = (bikeId: number) => {
        setCurrentBikeId(bikeId);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentBikeId(null);
        setNewBooking({ guestName: '', roomNumber: '' });
    };

    const handleBookBike = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBikeId || !newBooking.guestName || !newBooking.roomNumber) return;
        
        const bookingData = {
            _subject: `Nueva Reserva: Bici #${currentBikeId}`,
            Tipo: "Bicicleta",
            "Bici No.": currentBikeId,
            "Nombre Huésped": newBooking.guestName,
            "Habitación No.": newBooking.roomNumber,
            Fecha: selectedDate,
        };

        try {
            const response = await fetch("https://formsubmit.co/ajax/el/gefami", {
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
            
            setBookings([...bookings, { bikeId: currentBikeId, date: selectedDate, ...newBooking }]);
            handleCloseModal();

        } catch (error) {
            console.error(error);
            alert("Hubo un error al enviar la reserva. Por favor, inténtelo de nuevo.");
        }
    };
    
    const handleCancelBooking = (bikeId: number) => {
        if (window.confirm("¿Seguro que quieres cancelar esta reserva?")) {
            setBookings(bookings.filter(b => !(b.bikeId === bikeId && b.date === selectedDate)));
        }
    };

    return (
        <div>
            <Header title="Control de Bicis" />
            <div className="p-4">
                <div className="mb-6">
                    <label htmlFor="date-picker-bikes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seleccionar Fecha:</label>
                    <input 
                        type="date"
                        id="date-picker-bikes"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {Array.from({ length: TOTAL_BIKES }, (_, i) => i + 1).map(bikeId => (
                        <Bike
                            key={bikeId} 
                            bikeId={bikeId} 
                            booking={bookingsForDate.find(b => b.bikeId === bikeId)}
                            onBook={handleOpenModal}
                            onCancel={handleCancelBooking}
                        />
                    ))}
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Reservar Bici ${currentBikeId}`}>
                <form onSubmit={handleBookBike}>
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

export default BikesView;

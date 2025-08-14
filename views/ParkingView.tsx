
import React, { useState } from 'react';
import { ParkingBooking } from '../types';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { DisabilityIcon } from '../components/icons/NavIcons';

const TOTAL_SPOTS = 10;
const DISABILITY_SPOT_ID = 1;

const initialBookings: ParkingBooking[] = [];

const ParkingSpot: React.FC<{ 
    spotId: number; 
    booking: ParkingBooking | undefined; 
    onBook: (spotId: number) => void; 
    onCancel: (spotId: number) => void;
}> = ({ spotId, booking, onBook, onCancel }) => {
    const isBooked = !!booking;
    const isDisabilitySpot = spotId === DISABILITY_SPOT_ID;
    
    const baseClasses = "p-4 rounded-xl shadow-lg text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[140px]";
    const bookedClasses = 'bg-red-200 dark:bg-red-900';
    const availableClasses = 'bg-green-200 dark:bg-green-800';
    const disabilityAvailableClasses = 'bg-blue-200 dark:bg-blue-800';

    const getBgColor = () => {
        if (isBooked) return bookedClasses;
        if (isDisabilitySpot) return disabilityAvailableClasses;
        return availableClasses;
    }

    return (
        <div className={`${baseClasses} ${getBgColor()}`}>
            <div className="flex items-center gap-2 mb-2">
              {isDisabilitySpot && <div className="text-blue-800 dark:text-blue-100"><DisabilityIcon /></div>}
              <h3 className="font-bold text-xl md:text-2xl text-gray-800 dark:text-gray-100">Plaza {spotId}</h3>
            </div>
            {isBooked ? (
                <div className="text-red-800 dark:text-red-100">
                    <p className="font-semibold text-sm break-all">{booking.guestName}</p>
                    <p className="text-xs">Hab. {booking.roomNumber}</p>
                    <button onClick={() => onCancel(spotId)} className="mt-3 bg-red-500 text-white px-3 py-1 text-xs rounded-md hover:bg-red-600 transition">Cancelar</button>
                </div>
            ) : (
                <div className="mt-2">
                    <p className={`font-semibold text-sm ${isDisabilitySpot ? 'text-blue-900 dark:text-blue-100' : 'text-green-900 dark:text-green-100'}`}>Disponible</p>
                    <button onClick={() => onBook(spotId)} className="mt-3 bg-green-600 text-white px-3 py-1 text-xs rounded-md hover:bg-green-700 transition">Reservar</button>
                </div>
            )}
        </div>
    );
}

const ParkingView: React.FC = () => {
    const [bookings, setBookings] = useState<ParkingBooking[]>(initialBookings);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSpotId, setCurrentSpotId] = useState<number | null>(null);
    const [newBooking, setNewBooking] = useState({ guestName: '', roomNumber: '' });
    
    const bookingsForDate = bookings.filter(b => b.date === selectedDate);

    const handleOpenModal = (spotId: number) => {
        setCurrentSpotId(spotId);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSpotId(null);
        setNewBooking({ guestName: '', roomNumber: '' });
    };

    const handleBookSpot = () => {
        if (!currentSpotId || !newBooking.guestName || !newBooking.roomNumber) return;
        setBookings([...bookings, { spotId: currentSpotId, date: selectedDate, ...newBooking }]);
        handleCloseModal();
    };
    
    const handleCancelBooking = (spotId: number) => {
        if (window.confirm("¿Seguro que quieres cancelar esta reserva?")) {
            setBookings(bookings.filter(b => !(b.spotId === spotId && b.date === selectedDate)));
        }
    };

    return (
        <div>
            <Header title="Control de Parking" />
            <div className="p-4">
                <div className="mb-6">
                    <label htmlFor="date-picker-parking" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seleccionar Fecha:</label>
                    <input 
                        type="date"
                        id="date-picker-parking"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: TOTAL_SPOTS }, (_, i) => i + 1).map(spotId => (
                        <ParkingSpot 
                            key={spotId} 
                            spotId={spotId} 
                            booking={bookingsForDate.find(b => b.spotId === spotId)}
                            onBook={handleOpenModal}
                            onCancel={handleCancelBooking}
                        />
                    ))}
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Reservar Plaza ${currentSpotId}`}>
                <div className="space-y-4">
                    <input type="text" placeholder="Nombre del Huésped" value={newBooking.guestName} onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Número de Habitación" value={newBooking.roomNumber} onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={handleBookSpot} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Confirmar Reserva
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ParkingView;


import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { NewsEvent } from '../types';

const initialEvents: NewsEvent[] = [];


const Calendar: React.FC<{ currentDate: Date, events: NewsEvent[], onDayClick: (date: Date) => void, onAddEvent: (dateStr: string) => void, onMonthChange: (offset: number) => void }> = ({ currentDate, events, onDayClick, onAddEvent, onMonthChange }) => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
    const year = currentDate.getFullYear();

    const blanks = Array(firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const eventsByDate = events.reduce((acc, event) => {
        const eventDate = new Date(event.date + 'T00:00:00');
        if(eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === year){
            const day = eventDate.getDate();
            if(!acc[day]) acc[day] = [];
            acc[day].push(event);
        }
        return acc;
    }, {} as {[key: number]: NewsEvent[]});

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => onMonthChange(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">&lt;</button>
                <h3 className="text-xl font-bold capitalize">{monthName} {year}</h3>
                <button onClick={() => onMonthChange(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <div key={d} className="font-semibold text-gray-500">{d}</div>)}
                {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                {days.map(day => {
                    const hasEvent = !!eventsByDate[day];
                    const fullDate = new Date(year, currentDate.getMonth(), day);
                    const fullDateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    return (
                        <div key={day} className="relative">
                             <button 
                                onClick={() => {
                                    onDayClick(fullDate);
                                    onAddEvent(fullDateStr);
                                }}
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                                    new Date().toDateString() === fullDate.toDateString() 
                                    ? 'bg-blue-500 text-white' 
                                    : 'hover:bg-blue-100 dark:hover:bg-blue-900'
                                }`}
                            >
                                {day}
                             </button>
                             {hasEvent && <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

const NewsView: React.FC = () => {
  const [events, setEvents] = useState<NewsEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '', title: '', description: '' });
  
  const handleMonthChange = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleOpenModal = (dateStr: string) => {
      setNewEvent({ date: dateStr, title: '', description: '' });
      setIsModalOpen(true);
  }

  const handleAddEvent = () => {
    if(!newEvent.title || !newEvent.description) return;
    const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    setEvents([...events, { ...newEvent, id: newId }].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setIsModalOpen(false);
  };

  const selectedDayEvents = selectedDate 
        ? events.filter(e => new Date(e.date + 'T00:00:00').toDateString() === selectedDate.toDateString())
        : [];

  return (
    <div>
      <Header title="Novedades y Eventos" />
      <div className="p-4 space-y-4">
        <Calendar 
            currentDate={currentDate}
            events={events} 
            onDayClick={handleDayClick} 
            onAddEvent={handleOpenModal} 
            onMonthChange={handleMonthChange}
        />
        {selectedDate && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md animate-fade-in">
                <h3 className="font-bold text-lg mb-2">Eventos para {selectedDate.toLocaleDateString('es-ES', {day:'numeric', month:'long'})}</h3>
                {selectedDayEvents.length > 0 ? selectedDayEvents.map(event => (
                    <div key={event.id} className="border-t border-gray-200 dark:border-gray-700 py-2 first:border-t-0">
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                    </div>
                )) : <p className="text-sm text-gray-500">No hay eventos para este día.</p>}
            </div>
        )}
      </div>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Añadir Evento para ${new Date(newEvent.date + 'T00:00:00').toLocaleDateString('es-ES')}`}>
            <div className="space-y-4">
                <input type="text" placeholder="Título del evento" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600" />
                <textarea placeholder="Descripción" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600" rows={3}></textarea>
                <button onClick={handleAddEvent} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Guardar Evento
                </button>
            </div>
       </Modal>
    </div>
  );
};

export default NewsView;
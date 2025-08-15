import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { NewsEvent } from '../types';

const initialEvents: NewsEvent[] = [];

const NewsView: React.FC = () => {
  const [events, setEvents] = useState<NewsEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });

  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todaysEvents = useMemo(() => {
    return events
      .filter(e => e.date === todayString)
      .sort((a, b) => b.id - a.id); // Show newest first
  }, [events, todayString]);

  const handleOpenModal = () => {
    setNewEvent({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description) {
        alert("Por favor, complete todos los campos.");
        return;
    };

    const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    const eventToAdd: NewsEvent = {
        id: newId,
        date: todayString,
        title: newEvent.title,
        description: newEvent.description,
    };

    setEvents([...events, eventToAdd]);
    handleCloseModal();
  };

  const handleDeleteEvent = (id: number) => {
    if (window.confirm("¿Seguro que quieres eliminar esta novedad?")) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div>
      <Header title="Novedades del Día">
        <button onClick={handleOpenModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Añadir Novedad
        </button>
      </Header>
      <div className="p-4 space-y-4">
        {todaysEvents.length > 0 ? todaysEvents.map(event => (
            <div key={event.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md relative animate-fade-in">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{event.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{event.description}</p>
                 <button 
                    onClick={() => handleDeleteEvent(event.id)} 
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-full absolute top-2 right-2"
                    aria-label="Eliminar novedad"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        )) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                No hay novedades registradas para hoy.
            </div>
        )}
      </div>
       <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Añadir Novedad del Día">
            <form onSubmit={(e) => { e.preventDefault(); handleAddEvent(); }}>
                <div className="space-y-4">
                    <input type="text" placeholder="Título" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <textarea placeholder="Descripción de la novedad" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} required></textarea>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Guardar Novedad
                    </button>
                </div>
            </form>
       </Modal>
    </div>
  );
};

export default NewsView;
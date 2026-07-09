import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaRegClock,
  FaTicketAlt,
  FaShieldAlt
} from 'react-icons/fa';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get(`/events?search=${search}`);
      setEvents(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-violet-700 via-indigo-700 to-fuchsia-600"></div>

        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center text-white">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full backdrop-blur-lg mb-8">
            <FaTicketAlt />
            <span className="text-sm font-semibold tracking-wider">
              WELCOME TO EVENTORA
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
            Discover Amazing
            <br />
            <span className="text-yellow-300">
              Events Near You
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed mb-12">
            Explore conferences, workshops, music festivals and unforgettable experiences.
            Book your seats instantly with secure OTP verification.
          </p>

          {/* SEARCH BAR */}

          <div className="max-w-3xl mx-auto bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-3 shadow-2xl">
            <div className="relative">

              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-lg" />

              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-gray-200 pl-14 pr-5 py-5 outline-none text-lg"
              />
            </div>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">

            <div>
              <h2 className="text-3xl font-black">500+</h2>
              <p className="text-gray-200">Events</p>
            </div>

            <div>
              <h2 className="text-3xl font-black">20K+</h2>
              <p className="text-gray-200">Bookings</p>
            </div>

            <div>
              <h2 className="text-3xl font-black">99%</h2>
              <p className="text-gray-200">Satisfaction</p>
            </div>

          </div>

        </div>
      </section>


      {/* FEATURES */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 duration-300">

            <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center text-2xl mb-6">
              <FaRegClock />
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Fast Booking
            </h2>

            <p className="text-gray-500 leading-relaxed">
              Book your favourite events instantly with lightning fast experience.
            </p>

          </div>


          <div className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 duration-300">

            <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl mb-6">
              <FaTicketAlt />
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Smart Tickets
            </h2>

            <p className="text-gray-500 leading-relaxed">
              Access and manage your bookings easily from your dashboard.
            </p>

          </div>


          <div className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 duration-300">

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-6">
              <FaShieldAlt />
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Secure Platform
            </h2>

            <p className="text-gray-500 leading-relaxed">
              OTP verification and secure infrastructure keep your bookings safe.
            </p>

          </div>

        </div>


        {/* EVENTS TITLE */}

        <div className="flex items-center justify-between mt-20 mb-10">

          <div>
            <h1 className="text-4xl font-black text-slate-800">
              Upcoming Events
            </h1>

            <p className="text-gray-500 mt-2">
              Find your next experience
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl shadow font-semibold text-violet-700">
            {events.length} Events
          </div>
        </div>
              {/* EVENTS GRID */}

      {loading ? (
        <div className="text-center py-24">
          <div className="text-2xl font-bold text-gray-500">
            Loading Events...
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
          <h2 className="text-3xl font-bold text-gray-700 mb-3">
            No Events Found
          </h2>

          <p className="text-gray-500">
            Try searching with another keyword.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {events.map((event) => (
            <div
              key={event._id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl duration-300 hover:-translate-y-3"
            >
              {/* IMAGE */}

              <div className="relative h-60 overflow-hidden">

                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black">
                    {event.category}
                  </div>
                )}

                {/* PRICE */}

                <div className="absolute top-5 right-5 bg-white shadow-lg rounded-2xl px-4 py-2 font-bold">

                  {event.ticketPrice === 0 ? (
                    <span className="text-green-600">
                      FREE
                    </span>
                  ) : (
                    <span className="text-violet-700">
                      ₹{event.ticketPrice}
                    </span>
                  )}

                </div>

              </div>


              {/* BODY */}

              <div className="p-7">

                <div className="inline-block bg-violet-100 text-violet-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  {event.category}
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-5">
                  {event.title}
                </h2>

                <div className="space-y-3 text-gray-600 mb-6">

                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-violet-600" />
                    <span>
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-pink-500" />
                    <span>{event.location}</span>
                  </div>

                </div>


                {/* SEATS */}

                <div className="mb-6">

                  <div className="flex justify-between text-sm mb-2">

                    <span className="font-semibold text-gray-600">
                      Available Seats
                    </span>

                    <span className="font-bold text-violet-700">
                      {event.availableSeats}/{event.totalSeats}
                    </span>

                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-pink-500"
                      style={{
                        width: `${(event.availableSeats / event.totalSeats) * 100}%`
                      }}
                    ></div>

                  </div>

                </div>


                {/* BUTTON */}

                <Link
                  to={`/events/${event._id}`}
                  className="block text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-4 rounded-2xl hover:scale-105 duration-300 shadow-lg"
                >
                  View Details
                </Link>

              </div>
            </div>
          ))}

        </div>
             
      )}
       </section>


      {/* FOOTER */}

      <footer className="mt-28 bg-slate-900 text-white rounded-t-[50px] px-8 py-20">

        <div className="max-w-7xl mx-auto text-center">

          <div className="flex justify-center items-center gap-4 mb-6">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center text-3xl font-black">
              E
            </div>

            <h1 className="text-4xl font-black">
              Eventora
            </h1>

          </div>

          <p className="max-w-2xl mx-auto text-gray-400 leading-relaxed mb-10">
            Discover, manage and experience unforgettable events with
            Eventora. Your all-in-one platform for booking and hosting events.
          </p>

          <div className="border-t border-slate-700 pt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} Eventora. All Rights Reserved.
          </div>

        </div>

      </footer>

    </div>
  );
};

export default Home;
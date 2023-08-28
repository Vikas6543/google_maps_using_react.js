import React, { useRef, useState } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';

// Vidhana Soudha Coordinates
const center = {
  lat: 12.9797,
  lng: 77.5912,
};

const GoogleMaps = () => {
  const [googleMap, setGoogleMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const originRef = useRef(null);
  const destinationRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (!isLoaded) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-800'></div>
      </div>
    );
  }

  const handleGetDirection = async () => {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirections(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const clearDirections = () => {
    setDirections(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinationRef.current.value = '';
  };

  return (
    <main>
      <div
        className='shadow mx-24 lg:w-5/12 lg:mx-auto p-2 absolute top-2 left-0 right-0 bg-gray-600 rounded-lg'
        style={{ zIndex: 100 }}
      >
        {/* origin & destination input's */}
        <section className='flex justify-center mb-5 mt-3'>
          <Autocomplete>
            <input
              type='text'
              ref={originRef}
              placeholder='Origin'
              className='border-2 py-1 px-2 rounded outline-none border-2 focus:border-gray-400'
            />
          </Autocomplete>

          <Autocomplete>
            <input
              type='text'
              ref={destinationRef}
              placeholder='Destination'
              className='border-2 py-1 px-2 rounded outline-none border-2 focus:border-gray-400 mx-3'
            />
          </Autocomplete>

          <button
            className='bg-red-400 text-white font-bold py-1 px-2 rounded'
            onClick={handleGetDirection}
          >
            Get Directions
          </button>

          <button
            onClick={clearDirections}
            className='bg-red-400 text-white font-bold py-1 px-4 rounded ml-3'
          >
            X
          </button>
        </section>

        {/* {origin && destination && ( */}
        <section className='flex justify-between text-white mx-24 items-center border py-2 px-4 rounded-lg border-gray-300 mb-2'>
          <div>
            <p className='text-lg font-semibold mb-1'>Distance : {distance}</p>
            <p className='text-lg font-semibold'>Duration : {duration}</p>
          </div>

          <button
            onClick={() => {
              googleMap.panTo(center);
            }}
            className='bg-white rounded-full h-10 p-3 flex justify-center items-center hover:bg-gray-50'
          >
            <i
              className='fa fa-location-arrow text-red-500 text-xl'
              aria-hidden='true'
            ></i>
          </button>
        </section>
      </div>

      {/* map */}
      <GoogleMap
        mapContainerClassName='h-screen w-full'
        zoom={15}
        center={center}
        options={{
          disableDefaultUI: true,
        }}
        onLoad={(map) => setGoogleMap(map)}
      >
        <Marker position={center} />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </main>
  );
};

export default GoogleMaps;

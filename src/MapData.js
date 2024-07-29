import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';

export default function MapData() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Default position and zoom level for the map
  const position = [20.0, 0.0];
  const zoom = 2;

  return (
    <div>
      <h1>Map Data Page</h1>
      <MapContainer center={position} zoom={zoom} style={{ height: '800px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {users.map((user) => (
          <React.Fragment key={user.id}>
            {/* Home coordinates */}
            <Circle
              center={[user.address.coordinates.lat, user.address.coordinates.lng]}
              radius={20000} // Adjust radius as needed
              color="green"
              fillColor="green"
              fillOpacity={0.4}
            >
              <Popup>
                <div>
                  <h3>{`${user.firstName} ${user.lastName} (Home)`}</h3>
                  <p>{user.address.city}, {user.address.country}</p>
                  <p>Company: {user.company.name}</p>
                </div>
              </Popup>
            </Circle>
            {/* Company coordinates */}
            <Circle
              center={[user.company.address.coordinates.lat, user.company.address.coordinates.lng]}
              radius={20000} // Adjust radius as needed
              color="blue"
              fillColor="blue"
              fillOpacity={0.4}
            >
              <Popup>
                <div>
                  <h3>{`${user.firstName} ${user.lastName} (Company)`}</h3>
                  <p>{user.company.address.city}, {user.company.address.country}</p>
                  <p>Company: {user.company.name}</p>
                </div>
              </Popup>
            </Circle>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
}

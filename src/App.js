import React, { useState } from "react";
import "./App.css";

function App() {
    const [markers, setMarkers] = useState([]);

    const addMarker = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const name = prompt("Enter location name:");
        if (!name) return;

        setMarkers([...markers, { x, y, name }]);
    };

    const editMarker = (index) => {
        const newName = prompt("Edit location name:", markers[index].name);
        if (newName) {
            setMarkers(markers.map((m, i) => (i === index ? { ...m, name: newName } : m)));
        }
    };

    return (
        <div className="App">
            <h2>DM Interactive Map</h2>
            <p>Click to add markers. Hover over a marker to see details.</p>
            <div id="map" onClick={addMarker}>
                {markers.map((marker, index) => (
                    <div
                        key={index}
                        className="marker"
                        style={{ left: marker.x, top: marker.y }}
                        onClick={(e) => { e.stopPropagation(); editMarker(index); }}
                        title={marker.name}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;

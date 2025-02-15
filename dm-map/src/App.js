import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [characters, setCharacters] = useState([]);
    const [zoom, setZoom] = useState(1);
    const [isAddingMarker, setIsAddingMarker] = useState(false);
    const [minZoom, setMinZoom] = useState(1);
    const [maxZoom, setMaxZoom] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "addMarker" or "addCharacter"
    const [newMarkerPosition, setNewMarkerPosition] = useState({ x: 0, y: 0 });
    const [characterName, setCharacterName] = useState("");
    const [characterDescription, setCharacterDescription] = useState("");
    const [characterLink, setCharacterLink] = useState("");

    useEffect(() => {
        const updateZoomLevels = () => {
            const mapContainer = document.getElementById("map-container");
            const map = document.getElementById("map");
            if (mapContainer && map) {
                const minZoomWidth = mapContainer.clientWidth / map.clientWidth;
                const minZoomHeight = mapContainer.clientHeight / map.clientHeight;
                const minZoomLevel = Math.max(minZoomWidth, minZoomHeight);
                setMinZoom(minZoomLevel);
                setMaxZoom(minZoomLevel * 4); // Allow zooming in up to 4 times the minimum zoom level
                setZoom(minZoomLevel);
            }
        };

        updateZoomLevels();
        window.addEventListener("resize", updateZoomLevels);
        return () => window.removeEventListener("resize", updateZoomLevels);
    }, []);

    const addMarker = (e) => {
        if (!isAddingMarker) return;

        const rect = e.target.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        setNewMarkerPosition({ x, y });
        setName("");
        setDescription("");
        setModalType("addMarker");
        setShowModal(true);
        setIsAddingMarker(false);
    };

    const saveMarker = () => {
        const newMarkers = [...markers, { ...newMarkerPosition, name, description, characters: [] }];
        setMarkers(newMarkers);
        setShowModal(false);
    };

    const selectMarker = (index) => {
        setSelectedMarker(index);
        setName(markers[index].name);
        setDescription(markers[index].description);
        setCharacters(markers[index].characters);
    };

    const updateMarker = () => {
        const updatedMarkers = markers.map((marker, index) =>
            index === selectedMarker ? { ...marker, name, description } : marker
        );
        setMarkers(updatedMarkers);
    };

    const addCharacter = () => {
        setCharacterName("");
        setCharacterDescription("");
        setCharacterLink("");
        setModalType("addCharacter");
        setShowModal(true);
    };

    const saveCharacter = () => {
        const updatedCharacters = [...characters, { name: characterName, description: characterDescription, link: characterLink }];
        setCharacters(updatedCharacters);

        const updatedMarkers = markers.map((marker, index) =>
            index === selectedMarker ? { ...marker, characters: updatedCharacters } : marker
        );
        setMarkers(updatedMarkers);
        setShowModal(false);
    };

    const editCharacter = (charIndex) => {
        const name = prompt("Edit character name:", characters[charIndex].name);
        const description = prompt("Edit character description:", characters[charIndex].description);
        const link = prompt("Edit link to D&D monster sheet:", characters[charIndex].link);
        if (!name || !description || !link) return;

        const updatedCharacters = characters.map((char, index) =>
            index === charIndex ? { name, description, link } : char
        );
        setCharacters(updatedCharacters);

        const updatedMarkers = markers.map((marker, index) =>
            index === selectedMarker ? { ...marker, characters: updatedCharacters } : marker
        );
        setMarkers(updatedMarkers);
    };

    const deleteCharacter = (charIndex) => {
        const updatedCharacters = characters.filter((_, index) => index !== charIndex);
        setCharacters(updatedCharacters);

        const updatedMarkers = markers.map((marker, index) =>
            index === selectedMarker ? { ...marker, characters: updatedCharacters } : marker
        );
        setMarkers(updatedMarkers);
    };

    const deleteMarker = () => {
        const updatedMarkers = markers.filter((_, index) => index !== selectedMarker);
        setMarkers(updatedMarkers);
        setSelectedMarker(null);
    };

    const saveToFile = () => {
        const data = JSON.stringify(markers);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "map_data.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const loadFromFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = JSON.parse(event.target.result);
            setMarkers(data);
        };
        reader.readAsText(file);
    };

    const zoomIn = () => {
        setZoom(Math.min(zoom * 1.2, maxZoom));
    };

    const zoomOut = () => {
        setZoom(Math.max(zoom / 1.2, minZoom));
    };

    const resetZoom = () => {
        setZoom(minZoom);
    };

    const handleMapMouseDown = (e) => {
        if (isAddingMarker) return;

        const mapContainer = document.getElementById("map-container");
        const startX = e.clientX;
        const startY = e.clientY;
        const scrollLeft = mapContainer.scrollLeft;
        const scrollTop = mapContainer.scrollTop;

        const onMouseMove = (e) => {
            const x = e.clientX - startX;
            const y = e.clientY - startY;
            mapContainer.scrollLeft = Math.max(0, Math.min(mapContainer.scrollWidth - mapContainer.clientWidth, scrollLeft - x));
            mapContainer.scrollTop = Math.max(0, Math.min(mapContainer.scrollHeight - mapContainer.clientHeight, scrollTop - y));
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h2>DM Interactive Map</h2>
                <div id="controls">
                    <button onClick={saveToFile}>Save Map</button>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Load Map
                    </label>
                    <input id="file-upload" type="file" onChange={loadFromFile} />
                    <button onClick={zoomOut}>-</button>
                    <button onClick={resetZoom}>Home</button>
                    <button onClick={zoomIn}>+</button>
                    <button onClick={() => setIsAddingMarker(true)}>Add Marker</button>
                </div>
            </header>
            <div id="map-container" onMouseDown={handleMapMouseDown}>
                <div id="map" onClick={addMarker} style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                    {markers.map((marker, index) => (
                        <div
                            key={index}
                            className="marker"
                            style={{ left: `${marker.x}px`, top: `${marker.y}px`, transform: `scale(${1 / zoom})` }}
                            onClick={(e) => { e.stopPropagation(); selectMarker(index); }}
                            title={marker.name}
                        />
                    ))}
                </div>
            </div>
            {selectedMarker !== null && (
                <div id="side-panel">
                    <button onClick={() => setSelectedMarker(null)}>Collapse</button>
                    <button onClick={deleteMarker}>Delete Marker</button>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={updateMarker}
                        placeholder="Enter marker name"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={updateMarker}
                        placeholder="Enter description"
                    />
                    <button onClick={addCharacter}>Add Character</button>
                    <ul>
                        {characters.map((char, index) => (
                            <li key={index}>
                                <strong>{char.name}</strong>: {char.description}
                                <br />
                                <a href={char.link} target="_blank" rel="noopener noreferrer">Monster Sheet</a>
                                <br />
                                <button onClick={() => editCharacter(index)}>Edit</button>
                                <button onClick={() => deleteCharacter(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {showModal && modalType === "addMarker" && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add Marker</h3>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>
                        <button onClick={saveMarker}>Save</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {showModal && modalType === "addCharacter" && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add Character</h3>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={characterName}
                                onChange={(e) => setCharacterName(e.target.value)}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={characterDescription}
                                onChange={(e) => setCharacterDescription(e.target.value)}
                            />
                        </label>
                        <label>
                            Link:
                            <input
                                type="text"
                                value={characterLink}
                                onChange={(e) => setCharacterLink(e.target.value)}
                            />
                        </label>
                        <button onClick={saveCharacter}>Save</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

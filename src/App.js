import React, { useState, useEffect } from "react";
import "./App.css";
import defaultMap from './map.jpg'; // Import the default map image

function App() {
    // State variables to manage various aspects of the application
    const [markers, setMarkers] = useState([]); // Array of markers on the map
    const [selectedMarker, setSelectedMarker] = useState(null); // Index of the currently selected marker
    const [name, setName] = useState(""); // Name of the marker being added or edited
    const [description, setDescription] = useState(""); // Description of the marker being added or edited
    const [components, setComponents] = useState([]); // Array of components associated with the selected marker
    const [zoom, setZoom] = useState(1); // Current zoom level of the map
    const [isAddingMarker, setIsAddingMarker] = useState(false); // Boolean to indicate if a new marker is being added
    const [minZoom, setMinZoom] = useState(1); // Minimum zoom level
    const [maxZoom, setMaxZoom] = useState(1); // Maximum zoom level
    const [showModal, setShowModal] = useState(false); // Boolean to control the visibility of the modal
    const [modalType, setModalType] = useState(""); // Type of modal ("addMarker", "addComponent", or "editComponent")
    const [newMarkerPosition, setNewMarkerPosition] = useState({ x: 0, y: 0 }); // Position of the new marker being added
    const [componentName, setComponentName] = useState(""); // Name of the component being added or edited
    const [componentDescription, setComponentDescription] = useState(""); // Description of the component being added or edited
    const [componentLink, setComponentLink] = useState(""); // Link of the component being added or edited
    const [currentMap, setCurrentMap] = useState("master"); // Current map view ("master" or a sub-map)
    const [currentMarkers, setCurrentMarkers] = useState([]); // Array of markers for the current map view
    const [backgroundMap, setBackgroundMap] = useState(defaultMap); // Background image for the current map view
    const [editingComponentIndex, setEditingComponentIndex] = useState(null); // Index of the component being edited

    // useEffect hook to update zoom levels based on the size of the map container and the map
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

    // useEffect hook to update the current markers and background map based on the current map view
    useEffect(() => {
        if (currentMap === "master") {
            setCurrentMarkers(markers);
            setBackgroundMap(defaultMap); // Set the master map background
        } else {
            const marker = markers.find((m) => m.name === currentMap);
            setCurrentMarkers(marker ? marker.subMarkers : []);
            setBackgroundMap(marker ? marker.map : defaultMap); // Set the marker map background
        }
    }, [currentMap, markers]);

    // Function to handle adding a new marker to the map
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

    // Function to save the new marker to the state
    const saveMarker = () => {
        if (currentMap === "master") {
            const newMarkers = [...markers, { ...newMarkerPosition, name, description, components: [], map: null, subMarkers: [] }];
            setMarkers(newMarkers);
        } else {
            const updatedMarkers = markers.map((marker) =>
                marker.name === currentMap
                    ? { ...marker, subMarkers: [...marker.subMarkers, { ...newMarkerPosition, name, description, components: [] }] }
                    : marker
            );
            setMarkers(updatedMarkers);
        }
        setShowModal(false);
    };

    // Function to select a marker and update the state with its details
    const selectMarker = (index) => {
        setSelectedMarker(index);
        const marker = currentMarkers[index];
        if (marker) {
            setName(marker.name);
            setDescription(marker.description);
            setComponents(marker.components);
        }
    };

    // Function to update the details of the selected marker
    const updateMarker = () => {
        const updatedMarkers = currentMarkers.map((marker, index) =>
            index === selectedMarker ? { ...marker, name, description } : marker
        );
        if (currentMap === "master") {
            setMarkers(updatedMarkers);
        } else {
            const updatedMasterMarkers = markers.map((marker) =>
                marker.name === currentMap ? { ...marker, subMarkers: updatedMarkers } : marker
            );
            setMarkers(updatedMasterMarkers);
        }
    };

    // Function to open the modal for adding a new component
    const addComponent = () => {
        setComponentName("");
        setComponentDescription("");
        setComponentLink("");
        setModalType("addComponent");
        setShowModal(true);
    };

    // Function to save the new component to the state
    const saveComponent = () => {
        const updatedComponents = [...components, { name: componentName, description: componentDescription, link: componentLink }];
        setComponents(updatedComponents);

        const updatedMarkers = currentMarkers.map((marker, index) =>
            index === selectedMarker ? { ...marker, components: updatedComponents } : marker
        );
        if (currentMap === "master") {
            setMarkers(updatedMarkers);
        } else {
            const updatedMasterMarkers = markers.map((marker) =>
                marker.name === currentMap ? { ...marker, subMarkers: updatedComponents } : marker
            );
            setMarkers(updatedMasterMarkers);
        }
        setShowModal(false);
    };

    // Function to open the modal for editing a component
    const editComponent = (compIndex) => {
        const component = components[compIndex];
        setComponentName(component.name);
        setComponentDescription(component.description);
        setComponentLink(component.link);
        setEditingComponentIndex(compIndex);
        setModalType("editComponent");
        setShowModal(true);
    };

    // Function to update the details of the component being edited
    const updateComponent = () => {
        const updatedComponents = components.map((comp, index) =>
            index === editingComponentIndex ? { name: componentName, description: componentDescription, link: componentLink } : comp
        );
        setComponents(updatedComponents);

        const updatedMarkers = currentMarkers.map((marker, index) =>
            index === selectedMarker ? { ...marker, components: updatedComponents } : marker
        );
        if (currentMap === "master") {
            setMarkers(updatedMarkers);
        } else {
            const updatedMasterMarkers = markers.map((marker) =>
                marker.name === currentMap ? { ...marker, subMarkers: updatedComponents } : marker
            );
            setMarkers(updatedMasterMarkers);
        }
        setShowModal(false);
    };

    // Function to delete a component from the state
    const deleteComponent = (compIndex) => {
        const updatedComponents = components.filter((_, index) => index !== compIndex);
        setComponents(updatedComponents);

        const updatedMarkers = currentMarkers.map((marker, index) =>
            index === selectedMarker ? { ...marker, components: updatedComponents } : marker
        );
        if (currentMap === "master") {
            setMarkers(updatedMarkers);
        } else {
            const updatedMasterMarkers = markers.map((marker) =>
                marker.name === currentMap ? { ...marker, subMarkers: updatedComponents } : marker
            );
            setMarkers(updatedMasterMarkers);
        }
    };

    // Function to delete a marker from the state
    const deleteMarker = () => {
        const updatedMarkers = currentMarkers.filter((_, index) => index !== selectedMarker);
        if (currentMap === "master") {
            setMarkers(updatedMarkers);
        } else {
            const updatedMasterMarkers = markers.map((marker) =>
                marker.name === currentMap ? { ...marker, subMarkers: updatedMarkers } : marker
            );
            setMarkers(updatedMasterMarkers);
        }
        setSelectedMarker(null);
    };

    // Function to save the current state of markers to a JSON file
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

    // Function to load markers from a JSON file
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

    // Function to upload a sub-map for a marker
    const uploadMarkerMap = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const updatedMarkers = markers.map((marker, index) =>
                index === selectedMarker ? { ...marker, map: event.target.result } : marker
            );
            setMarkers(updatedMarkers);
        };
        reader.readAsDataURL(file);
    };

    // Function to open a sub-map view for a marker
    const openMarkerMap = (markerName) => {
        setCurrentMap(markerName);
    };

    // Function to return to the master map view
    const goBackToMasterMap = () => {
        setCurrentMap("master");
    };

    // Function to zoom in on the map
    const zoomIn = () => {
        setZoom(Math.min(zoom * 1.2, maxZoom));
    };

    // Function to zoom out on the map
    const zoomOut = () => {
        setZoom(Math.max(zoom / 1.2, minZoom));
    };

    // Function to reset the zoom level to the default
    const resetZoom = () => {
        setZoom(minZoom);
    };

    // Function to handle dragging the map
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
                    {currentMap !== "master" && <button onClick={goBackToMasterMap}>Back to Master Map</button>}
                </div>
            </header>
            <div id="map-container" onMouseDown={handleMapMouseDown}>
                <div id="map" onClick={addMarker} style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', backgroundImage: `url(${backgroundMap})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                    {currentMarkers.map((marker, index) => (
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
            {selectedMarker !== null && currentMarkers[selectedMarker] && (
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
                    <button onClick={addComponent}>Add Component</button>
                    <input type="file" onChange={uploadMarkerMap} />
                    {currentMarkers[selectedMarker].map && (
                        <div className="marker-map-preview">
                            <img src={currentMarkers[selectedMarker].map} alt="Marker Map" style={{ width: '100%', height: 'auto' }} />
                            <button onClick={() => openMarkerMap(currentMarkers[selectedMarker].name)}>Open Marker Map</button>
                        </div>
                    )}
                    <ul>
                        {components.map((comp, index) => (
                            <li key={index}>
                                <strong>{comp.name}</strong>: {comp.description}
                                <br />
                                <a href={comp.link} target="_blank" rel="noopener noreferrer">Monster Sheet</a>
                                <br />
                                <button onClick={() => editComponent(index)}>Edit</button>
                                <button onClick={() => deleteComponent(index)}>Delete</button>
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
            {showModal && (modalType === "addComponent" || modalType === "editComponent") && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{modalType === "addComponent" ? "Add Component" : "Edit Component"}</h3>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={componentName}
                                onChange={(e) => setComponentName(e.target.value)}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={componentDescription}
                                onChange={(e) => setComponentDescription(e.target.value)}
                            />
                        </label>
                        <label>
                            Link:
                            <input
                                type="text"
                                value={componentLink}
                                onChange={(e) => setComponentLink(e.target.value)}
                            />
                        </label>
                        <button onClick={modalType === "addComponent" ? saveComponent : updateComponent}>
                            {modalType === "addComponent" ? "Save" : "Update"}
                        </button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

# World Planner

This project is an interactive map application for Dungeon Masters to plan and manage their campaigns. The application allows you to add markers, characters, and sub-maps to the main map.

## Features

- Add and manage markers on the map
- Add and manage characters associated with markers
- Upload and view sub-maps for markers
- Save and load map data to/from a file
- Zoom in and out of the map
- Reset zoom to the default level

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/world-planner.git
    cd world-planner
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Running the Application

1. Start the development server:

    ```bash
    npm start
    ```

2. Open your browser and navigate to `http://localhost:3000`.

### Project Structure

- [src/](http://_vscodecontentref_/5)
  - [App.js](http://_vscodecontentref_/6): Main application component
  - [App.css](http://_vscodecontentref_/7): Styles for the application
  - [map.jpg](http://_vscodecontentref_/8): Default map image

### Usage

1. **Add Marker**: Click the "Add Marker" button and then click on the map to place a new marker. Fill in the marker details in the modal that appears.
2. **Add Character**: Select a marker and click the "Add Character" button. Fill in the character details in the modal that appears.
3. **Upload Marker Map**: Select a marker and upload a sub-map image for the marker.
4. **Open Marker Map**: Click the "Open Marker Map" button to switch to the sub-map view.
5. **Back to Master Map**: Click the "Back to Master Map" button to return to the main map.
6. **Save Map**: Click the "Save Map" button to save the current map data to a file.
7. **Load Map**: Click the "Load Map" button to load map data from a file.
8. **Zoom In/Out**: Use the zoom buttons to zoom in and out of the map.
9. **Reset Zoom**: Click the "Home" button to reset the zoom to the default level.

### Notes

- Ensure that the [map.jpg](http://_vscodecontentref_/9) file is located in the [src](http://_vscodecontentref_/10) directory.
- The application uses the [map.jpg](http://_vscodecontentref_/11) file as the default background map.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### License

This project is licensed under the MIT License.

import { useState, useEffect } from "react";
import Song from "../../objects/Song";
import "./SongList.css";
import AddSongForm from "../AddSongForm/AddSongForm";
import EditSongForm from "../EditSongForm/EditSongForm";
import MessageBox from "../MessageBox/MessageBox";

const API_URL = "http://localhost:8080/songs";

function SongList() {
    const [songs, setSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSong, setEditingSong] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedArtist, setSelectedArtist] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const songsPerPage = 5;

    useEffect(() => {
        fetchSongs();
    }, [searchQuery, selectedGenre, selectedArtist]);

    const fetchSongs = async () => {
        let query = `${API_URL}?`;
        if (searchQuery) query += `name=${searchQuery}&`;
        if (selectedGenre) query += `genre=${selectedGenre}&`;
        if (selectedArtist) query += `artist=${selectedArtist}&`;

        try {
            const response = await fetch(query);
            const data = await response.json();
            setSongs(data);
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };

    
    const handleAddSong = async (newSong) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSong),
            });

            if (response.ok) {
                fetchSongs(); 
                setShowAddForm(false);
            }
        } catch (error) {
            console.error("Error adding song:", error);
        }
    };

    
    const handleEditSong = async (updatedSong) => {
        try {
            const response = await fetch(`${API_URL}/${updatedSong.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedSong),
            });

            if (response.ok) {
                fetchSongs(); 
                setEditingSong(null);
            }
        } catch (error) {
            console.error("Error editing song:", error);
        }
    };

    
    const handleDeleteSong = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            fetchSongs(); 
        } catch (error) {
            console.error("Error deleting song:", error);
        }
    };

    const handleIncrementLikes = async (id) => {
        try {
            await fetch(`${API_URL}/${id}/like`, { method: "PATCH" });
            fetchSongs(); 
        } catch (error) {
            console.error("Error liking song:", error);
        }
    };

    const handleIncrementListens = async (id) => {
        try {
            await fetch(`${API_URL}/${id}/listen`, { method: "PATCH" });
            fetchSongs(); 
        } catch (error) {
            console.error("Error listening to song:", error);
        }
    };

    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const paginatedSongs = songs.slice(indexOfFirstSong, indexOfLastSong);
    const totalPages = Math.ceil(songs.length / songsPerPage);

    return (
        <div className="songlist">
            <input
                className="searchbar"
                type="text"
                placeholder="Song Name..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
            />

            <div className="filter-container">
                <button className="filter-button" onClick={() => setSelectedGenre("")}>
                    Reset Filters
                </button>
                <select onChange={(e) => setSelectedGenre(e.target.value)} value={selectedGenre}>
                    <option value="">All Genres</option>
                    <option value="Rock">Rock</option>
                    <option value="Metal">Metal</option>
                    <option value="Pop">Pop</option>
                </select>

                <input
                    type="text"
                    placeholder="Filter by artist"
                    value={selectedArtist}
                    onChange={(e) => setSelectedArtist(e.target.value)}
                />
            </div>

            <button className="addbutton" onClick={() => setShowAddForm(true)}>+</button>

            {showAddForm && (
                <MessageBox onClose={() => setShowAddForm(false)}>
                    <AddSongForm onAddSong={handleAddSong} onCancel={() => setShowAddForm(false)} />
                </MessageBox>
            )}

            {editingSong && (
                <MessageBox onClose={() => setEditingSong(null)}>
                    <EditSongForm song={editingSong} onEditSong={handleEditSong} onCancel={() => setEditingSong(null)} />
                </MessageBox>
            )}

{songs.length > 0 ? (
    <>
        {(() => {
            
            const maxLikes = Math.max(...songs.map(s => s.likes));
            const minLikes = Math.min(...songs.map(s => s.likes));

            return paginatedSongs.map((song) => {
                let bgClass = "";
                if (song.likes === maxLikes) {
                    bgClass = "most-liked";
                } else if (song.likes === minLikes) {
                    bgClass = "least-liked";
                } else {
                    bgClass = "average-liked";
                }

                return (
                    <Song
                        key={song.id}
                        songData={song}
                        className={bgClass}
                        onEdit={() => setEditingSong(song)}
                        onDelete={() => handleDeleteSong(song.id)}
                        onIncrementListens={() => handleIncrementListens(song.id)}
                        onIncrementLikes={() => handleIncrementLikes(song.id)}
                    />
                );
            });
        })()}

                    <div className="pagination-controls">
                        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>No songs found</p>
            )}
        </div>
    );
}

export default SongList;

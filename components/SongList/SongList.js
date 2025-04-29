import { useState, useEffect, useCallback, useRef } from "react";
import Song from "../../objects/Song";
import "./SongList.css";
import AddSongForm from "../AddSongForm/AddSongForm";
import EditSongForm from "../EditSongForm/EditSongForm";
import MessageBox from "../MessageBox/MessageBox";

const API_URL = "http://localhost:8080/songs";

function SongList() {
    const [songs, setSongs] = useState([]);
    const [displayedSongs, setDisplayedSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSong, setEditingSong] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedArtist, setSelectedArtist] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [queuedOperations, setQueuedOperations] = useState([]);
    const songsPerPage = 5;
    const [isLoading, setIsLoading] = useState(false);

    // Load initial state from localStorage
    useEffect(() => {
        const cachedSongs = localStorage.getItem("songs");
        const cachedQueue = localStorage.getItem("queuedOperations");
        
        if (cachedSongs) {
            const parsedSongs = JSON.parse(cachedSongs);
            setSongs(parsedSongs);
            setDisplayedSongs(parsedSongs.slice(0, songsPerPage));
        }
        if (cachedQueue) setQueuedOperations(JSON.parse(cachedQueue));
    }, []);

    // Network status handlers
    const handleOnline = useCallback(() => {
        console.log("Network: Online");
        setIsOnline(true);
    }, []);

    const handleOffline = useCallback(() => {
        console.log("Network: Offline");
        setIsOnline(false);
    }, []);

    // Network event listeners
    useEffect(() => {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [handleOnline, handleOffline]);

    // Periodic connectivity check
    useEffect(() => {
        const interval = setInterval(() => {
            setIsOnline(navigator.onLine);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Sync logic
    const syncWithServerRef = useRef();
    const syncWithServer = useCallback(async () => {
        if (!queuedOperations.length) return;

        console.log("Starting sync with server...");
        const queue = [...queuedOperations];
        let updatedSongs = [...songs];
        let remainingOperations = [];

        for (const op of queue) {
            let retries = 3;
            while (retries > 0) {
                try {
                    if (op.type === "ADD") {
                        // Handle temporary IDs
                        const { tempId, ...cleanData } = op.data;
                        const response = await fetch(API_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(cleanData),
                        });
                        if (!response.ok) throw new Error("ADD failed");
                        const newSong = await response.json();
                        
                        // Replace temporary entry
                        updatedSongs = updatedSongs
                            .filter(song => song.tempId !== tempId)
                            .concat(newSong);
                    }
                    else if (op.type === "EDIT") {
                        const serverId = op.data.serverId || op.data.id;
                        const response = await fetch(`${API_URL}/${serverId}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(op.data),
                        });
                        if (!response.ok) throw new Error("EDIT failed");
                        const updatedSong = await response.json();
                        
                        updatedSongs = updatedSongs.map(song =>
                            song.id === op.data.id ? updatedSong : song
                        );
                    }
                    else if (op.type === "DELETE") {
                        const serverId = op.data.serverId || op.data.id;
                        const response = await fetch(`${API_URL}/${serverId}`, {
                            method: "DELETE"
                        });
                        if (!response.ok) throw new Error("DELETE failed");
                        updatedSongs = updatedSongs.filter(song => 
                            song.id !== op.data.id
                        );
                    }
                    break;
                } catch (error) {
                    retries--;
                    if (retries === 0) {
                        console.log("Operation failed, queuing for retry:", op);
                        remainingOperations.push(op);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // Update state and storage
        setSongs(updatedSongs);
        setDisplayedSongs(prev => 
            updatedSongs.slice(0, Math.ceil(prev.length / songsPerPage) * songsPerPage)
        );
        localStorage.setItem("songs", JSON.stringify(updatedSongs));
        setQueuedOperations(remainingOperations);
        localStorage.setItem("queuedOperations", JSON.stringify(remainingOperations));
    }, [queuedOperations, songs, songsPerPage]);

    useEffect(() => {
        syncWithServerRef.current = syncWithServer;
    }, [syncWithServer]);

    // Auto-sync when coming online
    useEffect(() => {
        if (isOnline && queuedOperations.length > 0) {
            syncWithServerRef.current();
        }
    }, [isOnline, queuedOperations.length]);

    // CRUD Operations
    const queueOperation = (operation) => {
        const newQueue = [...queuedOperations, operation];
        setQueuedOperations(newQueue);
        localStorage.setItem("queuedOperations", JSON.stringify(newQueue));
    };

    const handleAddSong = async (newSong) => {
        if (!isOnline) {
            const tempId = Date.now();
            const songWithTempId = { ...newSong, id: tempId, tempId };
            const updatedSongs = [...songs, songWithTempId];
            
            setSongs(updatedSongs);
            localStorage.setItem("songs", JSON.stringify(updatedSongs));
            queueOperation({ type: "ADD", data: songWithTempId });
            setShowAddForm(false);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSong),
            });

            if (response.ok) {
                const newSong = await response.json();
                setSongs(prev => [...prev, newSong]);
                setShowAddForm(false);
            }
        } catch (error) {
            console.error("Error adding song:", error);
            setIsOnline(false);
            queueOperation({ type: "ADD", data: newSong });
        }
    };

    const handleEditSong = async (updatedSong) => {
        if (!isOnline) {
            const updatedSongs = songs.map(song =>
                song.id === updatedSong.id ? updatedSong : song
            );
            
            setSongs(updatedSongs);
            localStorage.setItem("songs", JSON.stringify(updatedSongs));
            queueOperation({ 
                type: "EDIT", 
                data: {
                    ...updatedSong,
                    serverId: updatedSong.serverId || updatedSong.id
                }
            });
            setEditingSong(null);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${updatedSong.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedSong),
            });

            if (response.ok) {
                const newSong = await response.json();
                setSongs(prev => prev.map(song =>
                    song.id === updatedSong.id ? newSong : song
                ));
                setEditingSong(null);
            }
        } catch (error) {
            console.error("Error editing song:", error);
            setIsOnline(false);
            queueOperation({ type: "EDIT", data: updatedSong });
        }
    };

    const handleDeleteSong = async (id) => {
        if (!isOnline) {
            const updatedSongs = songs.filter(song => song.id !== id);
            
            setSongs(updatedSongs);
            localStorage.setItem("songs", JSON.stringify(updatedSongs));
            queueOperation({ 
                type: "DELETE", 
                data: { 
                    id,
                    serverId: songs.find(s => s.id === id)?.serverId 
                }
            });
            return;
        }

        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            setSongs(prev => prev.filter(song => song.id !== id));
        } catch (error) {
            console.error("Error deleting song:", error);
            setIsOnline(false);
            queueOperation({ type: "DELETE", data: { id } });
        }
    };

    // Fetch songs when searchQuery, selectedGenre, or selectedArtist changes
    useEffect(() => {
        fetchSongs();
    }, [searchQuery, selectedGenre, selectedArtist]);

    // Set up scroll listener
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isLoading]);

    // Update displayed songs when currentPage changes
    useEffect(() => {
        const newDisplayedSongs = songs.slice(0, currentPage * songsPerPage);
        setDisplayedSongs(newDisplayedSongs);
    }, [currentPage, songs]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 50 &&
            !isLoading
        ) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const fetchSongs = async () => {
        let query = `${API_URL}?`;
        if (searchQuery) query += `name=${searchQuery}&`;
        if (selectedGenre) query += `genre=${selectedGenre}&`;
        if (selectedArtist) query += `artist=${selectedArtist}&`;

        try {
            setIsLoading(true);
            const response = await fetch(query);
            if (!response.ok) throw new Error("Server down");
            const data = await response.json();
            setSongs(data);
            setDisplayedSongs(data.slice(0, currentPage * songsPerPage));
            localStorage.setItem("songs", JSON.stringify(data));
        } catch (error) {
            console.error("Error fetching songs:", error);
            setIsOnline(false);
            const cachedSongs = localStorage.getItem("songs");
            if (cachedSongs) {
                setSongs(JSON.parse(cachedSongs));
                setDisplayedSongs(JSON.parse(cachedSongs).slice(0, currentPage * songsPerPage));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleIncrementLikes = async (id) => {
        if (!isOnline) return;
        try {
            await fetch(`${API_URL}/${id}/like`, { method: "PATCH" });
            fetchSongs();
        } catch (error) {
            console.error("Error liking song:", error);
            setIsOnline(false);
        }
    };

    const handleIncrementListens = async (id) => {
        if (!isOnline) return;
        try {
            await fetch(`${API_URL}/${id}/listen`, { method: "PATCH" });
            fetchSongs();
        } catch (error) {
            console.error("Error listening to song:", error);
            setIsOnline(false);
        }
    };

    return (
        <div className="songlist">
            {!isOnline && (
                <div className="offline-message">
                    <p>You are offline. Changes will sync when you're back online.</p>
                </div>
            )}

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

            {displayedSongs.length > 0 ? (
                <>
                    {(() => {
                        const maxLikes = Math.max(...songs.map(s => s.likes));
                        const minLikes = Math.min(...songs.map(s => s.likes));

                        return displayedSongs.map((song) => {
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

                    {isLoading && <p>Loading more songs...</p>}
                </>
            ) : (
                <p>No songs found</p>
            )}
        </div>
    );
}

export default SongList;
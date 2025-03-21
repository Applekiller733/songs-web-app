import { useState } from "react";
import Song from "../../objects/Song";
import "./SongList.css";
import AddSongForm from "../AddSongForm/AddSongForm";
import EditSongForm from "../EditSongForm/EditSongForm";
import MessageBox from "../MessageBox/MessageBox";

function SongList() {
    const [songs, setSongs] = useState([
        { id: 1, image: "https://i.scdn.co/image/ab67616d0000b2731e0dc5baaabda304b0ad1815", name: "Island in the Sun", artist: "Weezer", genre: "Rock", listens: 0, likes: 0 },
        { id: 2, image: "https://i1.sndcdn.com/artworks-Mndt2nr2zGNU-0-t500x500.jpg", name: "Passenger", artist: "Deftones", genre: "Metal", listens: 0, likes: 0 },
        { id: 3, image: "https://upload.wikimedia.org/wikipedia/en/6/6b/DontFearTheReaper.jpg", name: "Don't Fear the Reaper", artist: "Blue Oyster Cult", genre: "Rock", listens: 0, likes: 0 }
    ]);

    const getNextId = () => {
        const maxId = songs.reduce((max, song) => (song.id > max ? song.id : max), 0);
        return maxId + 1;
    };

    const [searchQuery, setSearchQuery] = useState("");
    // const searchedSongs = songs.filter((song) =>
    //     song.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const [showAddForm, setShowAddForm] = useState(false);
    const handleAddSong = (newSong) => {
        const nextId = getNextId();
        setSongs([...songs, { ...newSong, id: nextId }]);
        setShowAddForm(false);
    };

    const [editingSong, setEditingSong] = useState(null);
    const handleEditSong = (updatedSong) => {
        setSongs((prevSongs) =>
            prevSongs.map((song) =>
                song.id === updatedSong.id ? { ...updatedSong } : song
            )
        );
        setEditingSong(null);
    };

    const handleDeleteSong = (id) => {
        setSongs(songs.filter(song => song.id !== id));
    };

    const handleIncrementListens = (id) => {
        setSongs(songs.map(song =>
            song.id === id ? { ...song, listens: song.listens + 1 } : song
        ));
    };

    const handleIncrementLikes = (id) => {
        setSongs(songs.map(song => 
            song.id === id ? {...song, likes: song.likes + 1} : song
        ));
    };

    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedArtist, setSelectedArtist] = useState("");

    const filteredSongs = songs.filter((song) => {
        const matchesGenre = selectedGenre ? song.genre === selectedGenre : true;
        const matchesArtist = selectedArtist ? song.artist === selectedArtist : true;
        const matchesSearch = song.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGenre && matchesArtist && matchesSearch;
    });

    const sortedSongs = filteredSongs.sort((songa, songb) => songb.listens - songa.listens);

    return (
        <div class="songlist">

            <input
                class="searchbar"
                type="text"
                placeholder="Song Name..."
                onChange={(query) => setSearchQuery(query.target.value)}
                value={searchQuery}
            ></input>

            <div className="filter-container">
                <button className="filter-button" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                    Filter by
                </button>
                {showFilterMenu && (
                    <div className="filter-menu">
                        <div className="filter-group">
                            <label>Genre:</label>
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                            >
                                <option value="">All Genres</option>
                                <option value="Rock">Rock</option>
                                <option value="Metal">Metal</option>
                                <option value="Pop">Pop</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Artist:</label>
                            <input
                                type="text"
                                placeholder="Filter by artist"
                                value={selectedArtist}
                                onChange={(e) => setSelectedArtist(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>


            <button className="addbutton" onClick={() => setShowAddForm(true)}>+</button>

            {showAddForm && (
                <MessageBox onClose={() => setShowAddForm(false)}>
                    <AddSongForm
                        onAddSong={handleAddSong}
                        onCancel={() => setShowAddForm(false)}
                    />
                </MessageBox>
            )}

            {editingSong && (
                <MessageBox onClose={() => setEditingSong(null)}>
                    <EditSongForm
                        song={editingSong}
                        onEditSong={handleEditSong}
                        onCancel={() => setEditingSong(null)}
                    />
                </MessageBox>
            )}

            {sortedSongs.length > 0 ? (
                sortedSongs.map((song) => (<Song
                    key={song.id}
                    songData={song}
                    onEdit={() => setEditingSong(song)}
                    onDelete={() => handleDeleteSong(song.id)}
                    onIncrementListens={() => handleIncrementListens(song.id)}
                    onIncrementLikes={() => handleIncrementLikes(song.id)}
                />))
            )
                :
                <p>No songs</p>
            }
        </div>
    );
}

export default SongList;
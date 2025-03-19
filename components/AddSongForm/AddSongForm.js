
import {useState} from "react";

export default function AddSongForm({ onAddSong, onCancel }) {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [artist, setArtist] = useState("");
    const [listens, setListens] = useState(0);
    const [likes, setLikes] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddSong({ image, name, artist, listens, likes });
    };

    return (
        <form className="song-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
            <input type="text" placeholder="Song Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} required />
            <input type="number" placeholder="Listens" value={listens} onChange={(e) => setListens(parseInt(e.target.value))} required />
            <input type="number" placeholder="Likes" value={likes} onChange={(e) => setLikes(parseInt(e.target.value))} required />
            <button type="submit">Add Song</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}

import {useState} from "react";

export default function EditSongForm({ song, onEditSong, onCancel }) {
    const [image, setImage] = useState(song.image);
    const [name, setName] = useState(song.name);
    const [artist, setArtist] = useState(song.artist);
    const [listens, setListens] = useState(song.listens);
    const [likes, setLikes] = useState(song.likes);

    const handleSubmit = (e) => {
        e.preventDefault();
        onEditSong({ ...song, image, name, artist, listens, likes });
    };

    return (
        <form className="song-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
            <input type="text" placeholder="Song Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} required />
            <input type="number" placeholder="Listens" value={listens} onChange={(e) => setListens(parseInt(e.target.value))} required />
            <input type="number" placeholder="Likes" value={likes} onChange={(e) => setLikes(parseInt(e.target.value))} required />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}

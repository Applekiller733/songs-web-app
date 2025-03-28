import "./Song.css";
import { useState } from "react";

function Song({songData, onEdit, onDelete, onIncrementListens, onIncrementLikes, className}){
    const [song, setSong] = useState(songData);

    return (
        <div className={`background ${className}`}>
            <button onClick={onIncrementListens} className="playbutton">Listen</button>
            <button onClick={onIncrementLikes} className="playbutton">Like</button>

            <img src={songData.image} alt={songData.name} className="songimg"></img>

            <div className="column">
                <h2> {songData.name} </h2>
                <p> {songData.artist} </p>
            </div>

            <div className="column">
                <h3>Genre: {songData.genre}</h3>
            </div>

            <div className = "column">
                <p> Listens: {songData.listens}</p>
                <p> Likes: {songData.likes}</p>
            </div>

            <div className="column">
                <button className="button" onClick={onEdit}> Edit </button>
                <br></br>
                <br></br>
                <button className="deletebutton" onClick={onDelete}> Delete </button>
            </div>
        </div>
    );
}

export default Song;
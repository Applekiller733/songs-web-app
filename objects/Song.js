import "./Song.css";
import { useState } from "react";

function Song({songData, onEdit, onDelete, onIncrementListens, onIncrementLikes}){
    const [song, setSong] = useState(songData);

    return (
        <div class="background">
            <button onClick={onIncrementListens} class="playbutton">Listen</button>
            <button onClick={onIncrementLikes} class="playbutton">Like</button>

            <img src={songData.image} alt={songData.name} class="songimg"></img>

            <div class="column">
            <h2> {songData.name} </h2>
            <p> {songData.artist} </p>
            </div>

            <div class="column">
                <h3>Genre: {songData.genre}</h3>
            </div>

            <div class = "column">
            <p> Listens: {songData.listens}</p>
            <p> Likes: {songData.likes}</p>
            </div>

            <div class="column">
            <button class="button" onClick={onEdit}> Edit </button>
            <br></br>
            <br></br>
            <button class="deletebutton" onClick={onDelete}> Delete </button>
            </div>
        </div>
    );
}

export default Song;
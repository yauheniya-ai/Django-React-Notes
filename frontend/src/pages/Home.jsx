import { useState, useEffect } from "react"
import api from "../api"
import Note from "../components/Note"
import "../styles/Home.css"
 
function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => setNotes(data))
            .catch((err) => alert(err))
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
        }).catch((error) => alert(error))
        
    };

    const createNote = async (e) => {
        e.preventDefault();
        
        try {
            // Step 1: Call AI-powered auto-tagging API
            const tagResponse = await api.post(
                "/api/notes/autotag/",
                { content },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const tags = tagResponse.data.tags; // AI-generated tags
    
            // Step 2: Save the note with the generated tags
            const res = await api.post("/api/notes/", { 
                title, 
                content, 
                tags 
            });
    
            if (res.status === 201) {
                alert("Note created with AI-generated tags!");
                getNotes(); // Refresh notes
            } else {
                alert("Failed to create note.");
            }
        } catch (err) {
            alert("Error: " + JSON.stringify(err.response ? err.response.data : err.message));
        }
    };
    

    return <div>
        <h2 style={{ textAlign: "center" }}>Create a Note</h2>
        <form onSubmit={createNote}>
            <label htmlFor="title">Title:</label>
            <br />
            <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            />
            <label htmlFor="content">Content:</label>
            <br />
            <textarea 
                id="content" 
                name="content"
                className="note-input-content" 
                required value={content} 
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <br />
            <button type="submit" className="form-button">Submit</button>

        </form>
        <div className="notes-wrapper">
            <h2>Saved Notes</h2>
            {notes.map((note) => (
                <Note note={note} onDelete={deleteNote} key={note.id} />
            ))}
        </div>
    </div>
}

export default Home
import React from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism" // pick a theme you like
import "../styles/Note.css"

function Note({note, onDelete}) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("de-DE")
    return <div className="note-container">
        <p className="note-title">{note.title}</p>
        <p className="note-date">{ formattedDate }</p>
        <div className="note-content">
            <ReactMarkdown
                children={note.content}
                components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    return !inline && match ? (
                    <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                    >
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                    ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                    )
                },
                }}
            />
        </div>


        {/* AI-generated tags */}
        {note.tags && (
            <p className="note-tags">
                <strong>Tags:</strong> {note.tags}
            </p>
        )}

        <button className="delete-button" onClick={() => onDelete(note.id)}>
            Delete
        </button>
    </div>
}

export default Note


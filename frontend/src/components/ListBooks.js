/*
Simple component for listing out all the books
*/
import Book from "./Book";
import React, { useState } from 'react';
const ListBooks = ({ books, updateBook }) => {
    //store which editor we're using here, so we can toggle off all the others, like an accordion
    const [activeEditor, setActiveEditor] = useState(false);
    const handleBookClick = (book_id) =>{
        setActiveEditor(book_id);
    }
    const getBooks = () => {
        let res = [];
        if (books.length > 0) {
            res = books.map((b) => { let editing = activeEditor === b.book_id ? true : false; return <Book key={b.book_id} book={b} updateBook={updateBook} editing={editing} handleClick={() => handleBookClick(b.book_id)} /> });
        }
        return res;
    }

    return (
        <div className="books-list">
            {getBooks()}
        </div>

    );
}

export default ListBooks;
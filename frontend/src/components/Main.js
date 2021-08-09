/*
Major component; runs API cmds, holds all the books data
*/
import ListBooks from "./ListBooks";
import Book from "./Book";
import React, { useState, useEffect } from "react";
import "../css/main.css";

const Main = () => {
    const api_url = "http://" + process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT;
    const [error, setError] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [books, setBooks] = useState([]);
    const [activeEditor, setActiveEditor] = useState(false); //store which editor we're using here, so we can toggle off all the others, like an accordion

    

    useEffect(() => {
        fetch(api_url + "/books", { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => { console.log(data); setDataLoaded(true); setBooks(data); })
            .catch((error) => { setDataLoaded(true); setError(error) });
    },[api_url]);

    //receive a book object from Book.js
    //consider sanitizing here if needed, but mostly just call PUT
    //and then update the state
    const updateBook = async (book) => {
        console.log("received book update: " + JSON.stringify(book));
        const id = book.book_id;
        //dont run api if book isn't real
        if (!Number(id)) return;

        await fetch(api_url + "/books/" + id, {
            method: 'put',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        })
            .then((response) => response.json())
            .then((data) => {
                let updated_books = books;
                const book_index = updated_books.findIndex(b => b.book_id === id);
                updated_books[book_index] = data;
                console.log(data);
                setBooks(updated_books);
            })
            .catch((error) => { console.log(error); })
    }

    //add a book to the db
    const addBook = async (book) => {
        console.log("received book to add: " + JSON.stringify(book));
        if (book.add_book === "true") {
            await fetch(api_url + "/books", {
                method: 'post',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book)
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    window.location.hash = "book-added";
                    window.location.reload();
                })
                .catch((error) => { console.log(error); })
        }
    }

    const handleBookClick = (book_id) => {
        setActiveEditor(book_id);
    }

    //output errors/loading/content
    if (error) {
        return <div className="error">Error: {error.message}</div>;
    } else if (!dataLoaded) {
        return <div className="loading"><h1>Loading...</h1></div>;
    } else {
        return (
            <div>
                <h1 className="title" onClick={() => handleBookClick(0)}>Cannon Star Wars Books</h1>
                <ListBooks books={books} updateBook={updateBook} activeEditor={activeEditor} clickHandler={handleBookClick}/>
                <h2 className="title" onClick={() => handleBookClick(0)}>Add Book</h2>
                <Book book={{ title: "", author: "", release_date: "", book_timeline: "", rating: 0, completed: false }} addBook={addBook} editing={true} handleClick={() => null} adding_book={true} />
                <div className="hidden">
                    using api_url: {api_url}
                </div>
            </div>
        );
    }
}

export default Main;
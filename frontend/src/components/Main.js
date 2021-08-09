import ListBooks from "./ListBooks";
import AddBook from "./AddBook";
import React, { useState, useEffect } from "react";
import "../css/main.css";

const Main = () => {
    const [error, setError] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [books, setBooks] = useState([]);
    const api_url = "http://localhost:2223";

    useEffect(() => {
        fetch(api_url + "/books", {mode: 'cors'})
        .then((response) => response.json())
        .then((data) => {console.log(data);setDataLoaded(true);setBooks(data);})
        .catch((error) => {setDataLoaded(true);setError(error)});
    }, []);

    const updateBook = async (book) => {
        console.log("received book update: " + JSON.stringify(book));
        const id = book.book_id;

        //dont run api if book isn't real
        if(!Number(id)) return;
        await fetch(api_url + "/books/" + id, {
            method: 'put', 
            mode: 'cors', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(book)
        })
        .then((response) =>response.json())
        .then((data)=>{
            let updated_books = books;
            const book_index = updated_books.findIndex(b => b.book_id === id);
            updated_books[book_index] = data;
            console.log(data);
            setBooks(updated_books);
        })
        .catch((error)=>{console.log(error);})

    }



    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!dataLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <h2>All Books</h2>
                <ListBooks books={books} updateBook={updateBook} />
                <h3>Add Book</h3>
                <AddBook />
            </div>
        );
    }
}

export default Main;
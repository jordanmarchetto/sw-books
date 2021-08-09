/*
Major component; handles interactivity, display, and passes info back up to Main.js
*/
import React, { useState, useEffect } from 'react';
import "../css/book.css";
import icon_star from '../images/icon_star.png';
import icon_star_inactive from '../images/icon_star_inactive.png';

const Book = (props) => {
    const updateBook = props.updateBook;
    const editing = props.editing;
    const handleClick = props.handleClick;
    //const changeFocus = props.changeFocus;
    const serialize = require('form-serialize-improved');
    const [book, setBook] = useState(props.book);
    //const [editing, setEditing] = useState(false);
    const [starRating, setStarRating] = useState(props.book.rating);

    //TODO: have this close other books
    /*
    const handleClick = () => {
        setEditing(!editing);
    }
    */

    //output the rating as stars, handles editable and non-editable versions
    const bookRating = (editable) => {
        let res = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Number(starRating)) {
                res.push(<img key={i} className="star-icon" src={icon_star} alt="star icon" onClick={() => editable ? setStarRating(i) : ''} />);
            } else {
                res.push(<img key={i} className="star-icon inactive" src={icon_star_inactive} alt="inactivestar icon" onClick={() => editable ? setStarRating(i) : ''} />);
            }
        }
        return res;
    }

    //separate useEffect for when we are changing the rating from clicking stars
    useEffect(() => {
        console.log("rating changed: " + starRating);
        updateHandler(book.book_id);
    }, [starRating]);

    //when parents update props, make sure to update component state
    useEffect(() => {
        console.log("book updated");
        setBook(props.book);
    }, [props.book]);

    //take all the data from the editable form, and pass it up to the main component
    const updateHandler = (book_id) => {
        //turn form into js obj and pass back to Main.js
        const form = document.querySelector('#edit-form-' + book_id);
        let payload = serialize(form, { hash: true, booleans: true });
        payload.book_id = Number(payload.book_id);
        payload.completed = payload.completed === true || payload.completed === false ? payload.completed : false;
        payload.rating = Number(starRating);
        console.log("sending payload:" + JSON.stringify(payload));
        setBook(payload);
        updateBook(payload);
    }


    if (editing === false) {
        return (
            <div onClick={handleClick} className="book display-only">
                <span className="title">{book.title}</span>
                <span className="author">{book.author}</span>
                <span className="timeline">({book.book_timeline})</span>
                <span className="release_date">released: {book.release_date}</span>
                <br />
                <span className="rating">{bookRating()}</span>
                <span className="completed">{book.completed}</span>
            </div>
        );
    } else {
        return (
            <div className="book editable">
                <form id={"edit-form-" + book.book_id}>
                    <input type="hidden" name="book_id" value={book.book_id} />
                    <input type="text" name="title" placeholder="Book Title" value={book.title} onChange={() => updateHandler(book.book_id)} />
                    <input type="text" name="author" placeholder="Author Name" value={book.author} onChange={() => updateHandler(book.book_id)} />
                    <input type="text" name="book_timeline" placeholder="Book Timeline (ex: 0 BBY)" value={book.book_timeline} onChange={() => updateHandler(book.book_id)} />
                    <input type="text" name="release_date" placeholder="Release Date (YYYY-MM-DD)" value={book.release_date} onChange={() => updateHandler(book.book_id)} />
                    {bookRating(true)}
                    <label>Completed: <input type="checkbox" checked={book.completed} name="completed" value="true" onChange={() => updateHandler(book.book_id)} /></label>
                </form>
            </div>
        );

    }

}

export default Book;
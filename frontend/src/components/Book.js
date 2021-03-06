/*
Major component; handles interactivity, display, and passes info back up to Main.js
*/
import React, { useState, useEffect } from 'react';
import "../css/book.css";
import icon_star from '../images/icon_star.png';
import icon_star_inactive from '../images/icon_star_inactive.png';
import serialize from 'form-serialize-improved';
import { CheckCircle } from '@material-ui/icons';


const Book = (props) => {
    const updateBook = props.updateBook;
    const addBook = props.addBook;
    const editing = props.editing;
    const adding_book = props.adding_book;
    const handleClick = props.handleClick;
    const [book, setBook] = useState(props.book);
    const [starRating, setStarRating] = useState(props.book.rating);

    //take all the data from the editable form, and pass it up to the main component
    const updateHandler = (book_id) => {
        let formSelector = '#edit-form-' + book_id;
        //turn form into js obj and pass back to Main.js
        const form = document.querySelector(formSelector);
        let payload = serialize(form, { hash: true, booleans: true });
        if (!Number(payload.book_id)) return;
        payload.book_id = Number(payload.book_id);
        payload.completed = payload.completed === true || payload.completed === false ? payload.completed : false;
        payload.rating = Number(starRating);
        console.log("updateHandler: sending payload:" + JSON.stringify(payload));
        setBook(payload);
        updateBook(payload);
    }

    const addBookHandler = () => {
        console.log("sending a book");
        let formSelector = '#edit-form-add';
        //turn form into js obj and pass back to Main.js
        const form = document.querySelector(formSelector);
        let payload = serialize(form, { hash: true, booleans: true });
        if(payload.title === "")return;
        payload.completed = payload.completed === true || payload.completed === false ? payload.completed : false;
        payload.rating = Number(starRating);
        console.log("addBookHandler: sending payload:" + JSON.stringify(payload));
        setBook(payload);
        addBook(payload);
    }

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
        updateHandler(book.book_id);
    }, [starRating, book.book_id]);

    //when parents update props, make sure to update component state
    useEffect(() => {
        setBook(props.book);
    }, [props.book]);



    if (editing === false) {
        return (
            <div onClick={handleClick} className={"book display-only" + (book.completed === true ? " completed" : "")}>
                <div className="left-col">
                    <span className="title">{book.title}</span>
                    <span className="author">{book.author}</span>
                    <span className="timeline">({book.book_timeline})</span>
                    <br />
                    <span className="release_date">released: {book.release_date}</span>
                </div>
                <div className="middle-col">
                </div>
                <div className="right-col">
                    <span className="rating">{bookRating()}</span>
                    {book.completed === true ? <CheckCircle fontSize="medium" className="completed-icon" /> : <span className="icon-spacer"></span>}
                </div>
            </div>
        );
    } else if (adding_book !== true) {
        return (
            <div className="book editable"> 
                <form id={"edit-form-" + book.book_id}>
                    <input type="hidden" name="book_id" value={book.book_id} />
                    <div className="left-col">
                        <label>Title: <input type="text" name="title" placeholder="Book Title" value={book.title} onChange={() => updateHandler(book.book_id)} /></label><br />
                        <label>Author: <input type="text" name="author" placeholder="Author Name" value={book.author} onChange={() => updateHandler(book.book_id)} /></label><br />
                        <label>Book Timeline: <input type="text" name="book_timeline" placeholder="Book Timeline (ex: 0 BBY)" value={book.book_timeline} onChange={() => updateHandler(book.book_id)} /></label><br />
                        <label>Release Date: <input type="text" name="release_date" placeholder="Release Date (YYYY-MM-DD)" value={book.release_date} onChange={() => updateHandler(book.book_id)} /></label>
                    </div>
                    <div className="middle-col">
                    </div>
                    <div className="right-col">
                        {bookRating(true)} {book.completed === true ? <CheckCircle fontSize="medium" className="completed-icon" /> : <span className="icon-spacer"></span>}<br />
                        <label>Completed: <input type="checkbox" checked={book.completed} name="completed" value="true" onChange={() => updateHandler(book.book_id)} /></label> <span className="icon-spacer"></span>
                    </div>
                </form>
            </div>
        );
    } else {
        return (
            <div className="book editable adding-book">
                <form id="edit-form-add" method="post">
                    <input type="hidden" name="add_book" value="true" />
                    <input type="text" name="title" placeholder="Book Title" required />
                    <input type="text" name="author" placeholder="Author Name" />
                    <input type="text" name="book_timeline" placeholder="Book Timeline (ex: 0 BBY)" />
                    <input type="text" name="release_date" placeholder="Release Date (YYYY-MM-DD)" />
                    {bookRating(true)}
                    <label>Completed: <input type="checkbox" name="completed" /></label>
                    <button onClick={() => addBookHandler(null, true)} >Save</button>
                </form>
            </div>
        );
    }

}

export default Book;
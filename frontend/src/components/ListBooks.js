import Book from "./Book";
const ListBooks = ({books, updateBook}) => {


    const getBooks = () => {
        let res = [];
        if(books.length>0){
            res = books.map((b)=>{return <Book key={b.book_id} book={b} updateBook={updateBook}  />});
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



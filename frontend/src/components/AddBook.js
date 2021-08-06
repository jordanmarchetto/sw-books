const AddBook = () => {
    return (
        <div>
            <form action="http://localhost:2222/books" method="POST">
                <input type="text" name="title" placeholder="title" value="booktitle" />
                <input type="text" name="author" placeholder="author" value="author name" />
                <input type="submit" />
            </form>
        </div>
    );
}

export default AddBook;
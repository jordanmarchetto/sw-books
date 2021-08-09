const AddBook = () => {
    return (
        <div>
            <form action="/books" method="POST">
                <input type="text" name="title" placeholder="title" value="booktitle" onChange={() => { }} />
                <input type="text" name="author" placeholder="author" value="author name" onChange={() => { }} />
                Completed:
                <label> True:
                    <input type="radio" name="completed" value={true} onChange={() => { }} />
                </label>
                <label> False:
                    <input type="radio" name="completed" value={false} onChange={() => { }} />
                </label>
                <select name="rating">
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
                <input type="submit" />
            </form>
        </div>
    );
}

export default AddBook;
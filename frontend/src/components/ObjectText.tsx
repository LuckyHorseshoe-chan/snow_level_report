function ObjectText({name, date, batches}: {name: string, date: string, batches: string}){
    return(
        <div>
            <div className="name">{name}</div>
            <div className="batches">{batches}</div>
            <div className="date">{date}</div>
        </div>
    )
}
export default ObjectText;
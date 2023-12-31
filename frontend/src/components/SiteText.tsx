function SiteText({name, date, batches}: {name: string, date: string, batches: string}){
    return(
        <div className="item-content">
            <div className="name">{name}</div>
            <div className="batches">{batches}</div>
            <div className="date">{date}</div>
        </div>
    )
}
export default SiteText;
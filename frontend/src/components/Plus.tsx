function Plus({onClick} : {onClick: any}){
    return(
        <li id="plus-block" className="item" onClick={onClick}>
            <div id="plus"></div>
        </li>
    )
}
export default Plus;
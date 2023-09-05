import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Plus from "./Plus";
import SiteText from "./SiteText"

function SiteList({openModal}: {openModal: any}){
    const [sites, setSites] = useState<any>([])
    
    useEffect(() => {
        fetch("http://localhost:8000/sites", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            return response.json();
        }).then((sites_list) =>{
            setSites(sites_list) 
        })
    }, [])

    return (
        <ul className="object-list">
            <Plus onClick={openModal}/>
            {sites.map((site: any, i: number) => (
                <Link to={('/site/' + site[0])}>
                    <li key={i} className="item">
                        <SiteText name={site[1]} 
                                  date={site[3] ? `${site[3].slice(8, 10)}.${site[3].slice(5, 7)}.${site[3].slice(0, 4)}-${site[4].slice(8, 10)}.${site[4].slice(5, 7)}.${site[4].slice(0, 4)}` : ''}
                                  batches={(site[2] + " пачек")}/>
                    </li>
                </Link>
            ))}
        </ul>
    )
}
export default SiteList;
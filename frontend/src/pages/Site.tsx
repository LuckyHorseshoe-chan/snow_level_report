import { VStack } from '@chakra-ui/react'
import { useState, useEffect  } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import "react-confirm-alert/src/react-confirm-alert.css"
import SiteText from "../components/SiteText";
import Plus from "../components/Plus";

function Site(){
    const [name, setName] = useState('')
    const [comment, setComment] = useState('')
    const [batches, setBatches] = useState<string[]>([])
    const [checked, setChecked] = useState<string[]>([])
    const [confirmMessage, setConfirmMessage] = useState('Уверены, что хотите удалить этот объект?')

    const { siteId } = useParams()
    const navigate = useNavigate()

    const handleClick = (e: any) => {
        if (e.currentTarget.style.backgroundColor === "rgb(217, 217, 217)"){
            e.currentTarget.style.backgroundColor = "rgb(121, 121, 121)"
            setChecked([...checked, e.currentTarget.id])
            setConfirmMessage('Уверены, что хотите удалить эти пачки?')
        } else{
            e.currentTarget.style.backgroundColor = "rgb(217, 217, 217)"
            var index = checked.indexOf(e.currentTarget.id)
            if (index !== -1) {
                checked.splice(index, 1);
            }
            if (checked.length === 0){
                setConfirmMessage('Уверены, что хотите удалить этот объект?')
            }
        }
        console.log(checked)
    }
    const deleteBatches = () => {
        if (checked.length !== 0){
            console.log(JSON.stringify(checked))
            fetch("http://localhost:8000/batches", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"batch_ids": checked})
        })
        } else{
            fetch("http://localhost:8000/site?site_id=" + siteId, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
            navigate('/')
        }
        
    }

    const submit = () => {

        confirmAlert({
          title: 'Удалить',
          message: confirmMessage,
          buttons: [
            {
              label: 'Да',
              onClick: () => deleteBatches()
            },
            {
              label: 'Нет',
            }
          ]
        });
      }
    
    
    
    useEffect(() => {
        fetch("http://localhost:8000/site?site_id=" + siteId, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            return response.json();
        }).then((site) => {
            setName(site["name"])    
            setComment(site["comment"]) 
        })

        fetch("http://localhost:8000/batches?site_id=" + siteId, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            return response.json();
        }).then((batches_list) => {
            setBatches(batches_list)
        })
    }, [])

    return(
        <VStack>
            <div id="obj-header">
                <div id="obj-text">
                    <div id="obj-name">
                        {name}
                    </div>
                    <div id="obj-comment">
                        {comment}
                    </div>
                </div>
                <div id="obj-btns">
                    <button className="obj-btn" id="red-btn" onClick={submit}>Удалить</button>
                </div>
            </div>
            <ul className="object-list">
                <Link to={("/site/" + siteId + "/createBatch")}>
                    <Plus onClick={null}/>
                </Link>
                {batches.map((batch, i) => (
                    <li key={i} className="item" id={batch[0]} onClick={handleClick}>
                        <SiteText 
                                name={`${batch[2].slice(8, 10)}.${batch[2].slice(5, 7)}.${batch[2].slice(0, 4)}-${batch[3].slice(8, 10)}.${batch[3].slice(5, 7)}.${batch[3].slice(0, 4)}`} 
                                date={batch[5]} batches=''/>
                    </li>
                ))}
            </ul>
            <Link to="/">Назад</Link>
        </VStack>
    )
}
export default Site;
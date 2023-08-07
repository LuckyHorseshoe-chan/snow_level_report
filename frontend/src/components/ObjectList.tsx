import Plus from "./Plus";
import ObjectText from "./ObjectText";

function ObjectList(){
    return (
        <ul className="object-list">
            <Plus/>
            <li className="item">
                <ObjectText name='Сопка' date='23-11-2023' batches='7 пачек'/>
            </li>
            <li className="item">2</li>
            <li className="item">3</li>
            <li className="item">4</li>
            <li className="item">5</li>
            <li className="item">6</li>
            <li className="item">7</li>
            <li className="item">7</li>
            <li className="item">7</li>
            <li className="item">6</li>
            <li className="item">6</li>
            <li className="item">6</li>
            <li className="item">6</li>
            <li className="item">6</li>
            <li className="item">6</li>
            <li className="item">6</li>
            <li className="item">6</li>
        </ul>
    )
}
export default ObjectList;
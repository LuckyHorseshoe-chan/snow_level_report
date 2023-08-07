import ObjectText from "../components/ObjectText";
import Plus from "../components/Plus";

function Object(){
    return(
        <div id="object-page">
            <div id="obj-header">
                <div id="obj-text">
                    <div id="obj-name">
                        Сопка
                    </div>
                    <div id="obj-comment">
                        Комментарий очень длинный и содержательный
                    </div>
                </div>
                <div id="obj-btns">
                    <button className="obj-btn" id="blue-btn">Использовать в отчёте</button>
                    <button className="obj-btn" id="grey-btn">Изменить</button>
                    <button className="obj-btn" id="red-btn">Удалить</button>
                </div>
            </div>
            <ul className="object-list">
                <Plus/>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
                <li className="item">
                    <ObjectText name='Сопка' date='' batches='7 фоток'/>
                </li>
            </ul>
        </div>
    )
}
export default Object;
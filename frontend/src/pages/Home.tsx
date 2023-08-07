import { VStack, Button } from '@chakra-ui/react'
import { useState } from 'react';
import Modal from 'react-modal';
import ObjectList from '../components/ObjectList';
import CreateObject from './CreateObject'; 

function Home(){
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
    setModalIsOpen(true);
    };

    const closeModal = () => {
    setModalIsOpen(false);
    };

    return(
        <div>
            <div className="home-page">
                <button id="create-report" onClick={openModal}>Создать отчёт</button>
                <ObjectList/>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className='modal'>
                <CreateObject/>
            </Modal>
        </div>
    );
}
export default Home;
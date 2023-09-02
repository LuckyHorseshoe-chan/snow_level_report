import { VStack } from '@chakra-ui/react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import Modal from 'react-modal';
import SiteList from '../components/SiteList';
import CreateSite from './CreateSite'; 

function Home(){
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
    setModalIsOpen(true);
    };

    const closeModal = () => {
    setModalIsOpen(false);
    };

    return(
        <VStack>
            <Link to="/create_report">
                <button id="create-report">Создать отчёт</button>
            </Link>
            <SiteList openModal={openModal}/>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className='modal'>
                <CreateSite closeModal={closeModal}/>
            </Modal>
        </VStack>
    );
}
export default Home;
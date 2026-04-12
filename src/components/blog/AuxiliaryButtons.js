import AddButton from './AddButton';

function AuxiliaryButtons ({ loggedIn, isThereMoreContent, onViewAllClick, onAddButtonClick }) {
    return (
        <div className='auxiliary-buttons'>
            {loggedIn && <AddButton buttonClassname='auxiliary-buttons__add-btn' onClick={onAddButtonClick}/>}
            {isThereMoreContent &&
                <button className='auxiliary-buttons__view-all-btn' onClick={onViewAllClick}>View all</button>
            }
        </div>
    )
}

export  default AuxiliaryButtons;
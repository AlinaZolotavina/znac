import { useState } from "react";

function EditingHashtags({ editingHashtags, onSubmit, isSendingReq, photoId }) {
    const [hashtags, setHashtags] = useState(editingHashtags);
    const [hashtagsError, setHashtagsError] = useState();
    function handleHashtagsChange(e) {
        const regex = /^[A-Za-zА-Яа-я0-9 _]*$/;
        if(e.target.value.length === 0) {
            setHashtagsError('You must add at least one hashtag')
        } else if (!regex.test(e.target.value)) {
            setHashtagsError('Only letters, numbers and underscores are allowed')
        } else {
            setHashtagsError('');
        }
        setHashtags(e.target.value);
    }

    function handleEditHashtags(e) {
        e.preventDefault();
        onSubmit(photoId, hashtags);
    }
    return(
        <form
            name='edit-hashtags'
            className='edit-hashtags'
            onSubmit={handleEditHashtags}
        >
            <label className='edit-hashtags__input'>
                <input
                    type='text'
                    value={hashtags}
                    onChange={handleHashtagsChange}
                    className='edit-hashtags__field'
                />
                <span className='input__error'>{hashtagsError}</span>
            </label>
            <button 
                className='edit-hashtags__submit-btn'
                type='submit'
                // disabled={areHashtagsSame}
            />
        </form>
    )
};

export default EditingHashtags;
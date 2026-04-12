import CV from './CV';

function CVs () {
    function downloadEnglishCV () {
        window.open('https://drive.google.com/uc?id=13PZIqP13A5AZgA_wkFboxER42Nk6DsZx&export=download','_blank');
    };

    function downloadGermanCV() {
        window.alert("Sorry, German version of CV is not available at the moment");
    }

    function downloadRussianCV() {
        window.open('https://drive.google.com/uc?id=1i4_KosxU2ZVoPyIZCAdkJmsK8XP9KhWP&export=download','_blank');
    };

    return (
        <div className='background_color_blue'>
            <div className='cv'>
                <h2 className='section-title cv__title'>CV</h2>
                <ul className='cv__container'>
                    <CV cvVerssion='English version' onCvClick={downloadEnglishCV}/>
                    <CV cvVerssion='German version' onCvClick={downloadGermanCV}/>
                    <CV cvVerssion='Russian version' onCvClick={downloadRussianCV}/>
                </ul>
            </div>
        </div>
    )
}

export default CVs;
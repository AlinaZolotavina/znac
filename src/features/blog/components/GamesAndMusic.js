function GamesAndMusic ({ onGamesClick, onMusicClick}) {
    return (
        <section className='games-and-music'>
            <div className='games-and-music__item games-and-music__item_type_games' onClick={onGamesClick} >
                <div className='games-and-music__icon games-and-music__icon_type_games'/>
                <p className='games-and-music__paragraph'>Play games I made</p>
            </div>
            <div className='games-and-music__item games-and-music__item_type_music' onClick={onMusicClick} >
                <div className='games-and-music__icon games-and-music__icon_type_music'/>
                <p className='games-and-music__paragraph'>Listen to music I like</p>
            </div>
        </section>
    )
}

export default GamesAndMusic;
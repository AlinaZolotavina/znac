
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Social from "./Social";

function BlogPromo () {
    const location = useLocation();
    return (
        <div className='blog-promo'>
            <div className='blog-promo__image' />
            <div className='blog-promo__info'>
                {location.pathname ==='/alina' &&
                    <h1 className='blog-promo__text blog-promo__text_location_main-page'>
                        Hi there!<br/>
                        I'm <span className='blog-promo__highlighted-text'>Alina</span>
                    </h1>
                }
                {location.pathname === '/alina/about' &&
                    <h1 className='blog-promo__text blog-promo__text_location_about'>
                        Hey! My name is Alina.
                        I'm newbie in frontend development. I have started and keep learning Java Script and React JS. In my free time I create vector graphic in AI, do some <a className='blog-promo__highlighted-text blog-promo__highlighted-text_type_link' href='https://www.behance.net/gallery/122424931/udmurtijaugoschaet' target="_blank">print designs</a>
                        , read books and take care of <a className='blog-promo__highlighted-text blog-promo__highlighted-text_type_link' href='https://www.instagram.com/fasya_the_cat?igsh=MWthZjFjNDR4eXZ0OA==' target="_blank">my cat</a>.
                    </h1>
                }
                <Social />
            </div>
        </div>
    )
}

export default BlogPromo;
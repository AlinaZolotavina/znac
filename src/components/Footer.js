function Footer() {
    return (
        <footer className="footer" id="footer">
            <p className="footer__column">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the Lorem Ipsum is simply dummy text of the printing and typesettin.</p>
            <div className="footer__column">
                <a className="footer__link" href="mailto:thesiriuss@gmail.com">
                    <div className="footer__icon footer__icon_email"/>
                    thesiriuss@gmail.com
                </a>
                <a className="footer__link" href="https://www.instagram.com/nisirius/" target="_blank" rel="noreferrer">
                    <div className="footer__icon footer__icon_instagram"/>
                    nisirius
                </a>
            </div>
        </footer>
    );
}

export default Footer;
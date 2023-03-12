function Footer() {
    return (
        <footer className="footer section" id="footer">
            <div className="footer__column">
                <p className="footer__paragraph">© 2023 All rights reserved | ZNAC</p>
                <p className="footer__paragraph">Website design & development by
                    <a className="footer__link" href="https://www.linkedin.com/in/alina-zolotavina-38a612259/" target="_blank" rel="noreferrer">Alina Zolotavina</a>
                </p>
            </div>
            <div className="footer__column footer__column_right">
                <a className="footer__link" href="mailto:znacompany@gmail.com">
                    <div className="footer__icon footer__icon_email"/>
                    znacompany@gmail.com
                </a>
                <a className="footer__link" href="https://www.instagram.com/znac.photo/" target="_blank" rel="noreferrer">
                    <div className="footer__icon footer__icon_instagram"/>
                    znac.photo
                </a>
            </div>
        </footer>
    );
}

export default Footer;
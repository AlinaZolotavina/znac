function LogoutButton({ className, email, onLogout }) {
    function handleLogout() {
        onLogout(email);
    }
    return (
        <button
            className={className}
            onClick={handleLogout}
        >
            LOG OUT
        </button>
    );
}

export default LogoutButton;
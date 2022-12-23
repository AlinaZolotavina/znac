function LogoutButton({ className, onLogout }) {
    return (
        <button
            className={className}
            onClicl={onLogout}
        >
            LOG OUT
        </button>
    );
}

export default LogoutButton;
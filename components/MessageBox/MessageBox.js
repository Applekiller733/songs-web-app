import "./MessageBox.css";

export default function MessageBox({children, onClose}){
    return (
        <div className="msgbox-overlay">
            <div className="msgbox-content">
                {children}
                <button className="msgbox-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
}
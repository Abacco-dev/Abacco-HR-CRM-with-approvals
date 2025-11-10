// src/utils/Portal.jsx
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function Portal({ children }) {
    const [mountPoint, setMountPoint] = useState(null);

    useEffect(() => {
        // Make sure document is available
        const modalRoot = document.getElementById("modal-root");
        if (modalRoot) {
            setMountPoint(modalRoot);
        } else {
            // fallback: append directly to body
            const newDiv = document.createElement("div");
            newDiv.id = "modal-root";
            document.body.appendChild(newDiv);
            setMountPoint(newDiv);
        }
    }, []);

    if (!mountPoint) return null;

    return createPortal(children, mountPoint);
}

const CLIENT_ID = "325961026401-p31uitoqa05u3k32rrumftcqjdv3rjij.apps.googleusercontent.com";
const FOLDER_ID = "1hiYfUo4FtwFDGUTAZI-68IHa2l9rYzef";

const SCOPES = "https://www.googleapis.com/auth/drive.file";

document.addEventListener("DOMContentLoaded", () => {

    // Solo ejecutar en fotos.html
    if (!location.pathname.endsWith("fotos.html")) {
        return;
    }

    const boton = document.createElement("button");
    boton.textContent = "Conectar con Google Drive";
    boton.id = "btnGoogleDrive";

    document.body.prepend(boton);

    const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (respuesta) => {
            if (respuesta.error) {
                console.error(respuesta);
                alert("No se pudo conectar con Google Drive.");
                return;
            }

            alert("¡Google Drive conectado correctamente! ✅");
            console.log("Token de acceso recibido.");
        }
    });

    boton.addEventListener("click", () => {
        tokenClient.requestAccessToken();
    });

});
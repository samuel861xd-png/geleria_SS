const CLIENT_ID = "325961026401-p31uitoqa05u3k32rrumftcqjdv3rjij.apps.googleusercontent.com";
const FOLDER_ID = "1hiYfUo4FtwFDGUTAZI-68IHa2l9rYzef";

const SCOPES = "https://www.googleapis.com/auth/drive.file";

let accessToken = null;
let archivoPendiente = null;

document.addEventListener("DOMContentLoaded", () => {

    // Solo funciona en fotos.html
    if (!location.pathname.endsWith("fotos.html")) {
        return;
    }

    const selectorFoto = document.getElementById("selector-foto");

    if (!selectorFoto) {
        return;
    }

    const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,

        callback: async (respuesta) => {

            if (respuesta.error) {
                console.error(respuesta);
                alert("No se pudo conectar con Google Drive.");
                return;
            }

            accessToken = respuesta.access_token;

            if (archivoPendiente) {
                const archivo = archivoPendiente;
                archivoPendiente = null;

                await subirFoto(archivo);
            }
        }
    });

    selectorFoto.addEventListener("change", async () => {

        const archivo = selectorFoto.files[0];

        if (!archivo) {
            return;
        }

        // Si todavía no tenemos permiso de Google
        if (!accessToken) {

            archivoPendiente = archivo;

            tokenClient.requestAccessToken();

            selectorFoto.value = "";
            return;
        }

        await subirFoto(archivo);

        selectorFoto.value = "";
    });


    async function subirFoto(archivo) {

        try {

            const boundary = "-------GaleriaSSBoundary";

            const metadata = {
                name: archivo.name,
                parents: [FOLDER_ID],
                mimeType: archivo.type
            };

            const cuerpo = new Blob([
                `--${boundary}\r\n`,
                "Content-Type: application/json; charset=UTF-8\r\n\r\n",
                JSON.stringify(metadata),
                "\r\n",
                `--${boundary}\r\n`,
                `Content-Type: ${archivo.type}\r\n\r\n`,
                archivo,
                "\r\n",
                `--${boundary}--`
            ]);

            const respuesta = await fetch(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
                {
                    method: "POST",

                    headers: {
                        "Authorization": "Bearer " + accessToken,
                        "Content-Type": "multipart/related; boundary=" + boundary
                    },

                    body: cuerpo
                }
            );

            if (!respuesta.ok) {

                const error = await respuesta.text();

                console.error(error);

                alert("No se pudo guardar la foto en Google Drive.");
                return;
            }

            alert("📸 ¡Foto guardada correctamente!");

        } catch (error) {

            console.error(error);

            alert("Ocurrió un error al guardar la foto.");
        }
    }

});

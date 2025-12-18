// UBICACIÓN: src/routes/utils/svelte/download-zip/+server.js
import archiver from "archiver";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        // 1. Recibir datos del frontend
        const { mod_list } = await request.json();

        console.log(mod_list);

        if (!mod_list || mod_list.length === 0) {
            return new Response("No hay mods para descargar", { status: 400 });
        }

        // 2. Configurar el compresor ZIP
        const archive = archiver("zip", {
            zlib: { level: 9 } // Compresión máxima
        });

        // 3. Crear un canal (Stream) para enviar los datos al navegador poco a poco
        const stream = new ReadableStream({
            start(controller) {
                archive.on('data', chunk => controller.enqueue(chunk));
                archive.on('end', () => controller.close());
                archive.on('error', err => controller.error(err));
            }
        });

        // 4. Iniciar la descarga de archivos en segundo plano
        // NO usamos 'await' aquí para permitir que el zip empiece a descargarse ya
        (async () => {
            for (const mod of mod_list) {
                try {
                    // Obtener la URL (soporta ambas propiedades por si acaso)
                    const fileUrl = mod.url || mod.download_url;
                    
                    if (!fileUrl) {
                        console.error(`❌ Mod sin URL: ${mod.name}`);
                        continue;
                    }

                    // --- CORRECCIÓN CLAVE ---
                    // Intentamos usar mod.filename. Si no existe, lo sacamos de la URL.
                    // Ejemplo URL: .../sodium-1.0.jar -> "sodium-1.0.jar"
                    let fileName = mod.filename || mod.file_name;
                    
                    if (!fileName) {
                        try {
                            // Extraemos el nombre del final de la URL
                            const urlObj = new URL(fileUrl);
                            const pathSegments = urlObj.pathname.split('/');
                            fileName = pathSegments[pathSegments.length - 1];
                            
                            // Decodificar caracteres raros (espacios, %20, etc)
                            fileName = decodeURIComponent(fileName);
                        } catch (e) {
                            // Si todo falla, nombre genérico para que no crashee
                            fileName = `mod-${Date.now()}.jar`;
                        }
                    }
                    // -------------------------

                    console.log(`📥 Procesando: ${fileName}`);
                    
                    const response = await fetch(fileUrl, {
                        headers: { "User-Agent": "ModDownloader/1.0.0" }
                    });

                    if (!response.ok) {
                        console.error(`❌ Falló descarga de: ${fileName}`);
                        continue;
                    }

                    const arrayBuffer = await response.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    
                    // Ahora sí, append seguro con nombre válido
                    archive.append(buffer, { name: fileName });
                    
                } catch (error) {
                    console.error(`🔥 Error procesando mod:`, error);
                }
            }
            // CRÍTICO: Avisar que terminamos
            await archive.finalize();
        })();

        // 5. Devolver la respuesta correcta para SvelteKit
        return new Response(stream, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": 'attachment; filename="MisMods.zip"'
            }
        });

    } catch (err) {
        console.error("Error FATAL en servidor:", err);
        return new Response('Error interno', { status: 500 });
    }
}
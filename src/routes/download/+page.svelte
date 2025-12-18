<script>
    import Navbar from "$lib/components/ui/navbar.svelte";
    import Footer from "$lib/components/ui/footer.svelte";

    import ArrowLeftIcon from "$lib/svg_icons/arrow_left.svelte";
    import ArrowRightIcon from "$lib/svg_icons/arrow_right.svelte";
    import ArrowBarIcon from "$lib/svg_icons/arrow_bar.svelte";

    import ModList from "$lib/components/files/mods_list.svelte";

    import { modListStore } from "$utils/mods.svelte.js";

    import FabricIcon from "$lib/svg_icons/fabric.svelte";
    import ForgeIcon from "$lib/svg_icons/forge.svelte";
    import QuiltIcon from "$lib/svg_icons/quilt.svelte";
    import NeoForgeIcon from "$lib/svg_icons/neoforge.svelte";

    const loaders = {
        fabric: false,
        forge: false,
        quilt: false,
        neoforge: false,
    };

    let isDownloading = false;
    let errorMsg = "";

    function downloadAllMods() {
        if (
            !(
                loaders.fabric ||
                loaders.forge ||
                loaders.quilt ||
                loaders.neoforge
            )
        )
        return;

        let files = [];

        const modsStore = modListStore.mods;
        modsStore.forEach((mod) => {
            Object.entries(loaders).forEach(([key, value]) => {
                if (value && mod.loaders[key]) {
                    files.push({
                        loader: key,
                        url: mod.loaders[key].url,
                        name: mod.loaders[key].filename,
                    });
                }
            });
        })

        getZip(files);
    }

    function downloadSingleMod(modIndex) {
        if (
            !(
                loaders.fabric ||
                loaders.forge ||
                loaders.quilt ||
                loaders.neoforge
            )
        )
            return;

        const currentMod = modListStore.mods[modIndex].loaders;
        let files = [];

        Object.entries(currentMod).forEach(([key, value]) => {
            if (value) {
                files.push({
                    loader: key,
                    url: value.url,
                    name: value.filename,
                });
            }
        });

        getZip(files);
    }

    async function getZip(files) {
        if (files.length === 0) return;
        isDownloading = true;

        const api_url = "/utils/svelte/download-zip";
        const response = await fetch(api_url, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ mod_list: files }),
        });

        console.log("Chingadera: " + response);

        if (!response.ok) throw new Error("Error al descargar del servidor");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;

        a.download = "ModPack.zip";

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        a.remove();
    }
</script>

<main
    class="flex flex-col items-center justify-center w-full h-screen bg-linear-to-r from-main-green-700 to-main-green-900"
>
    <Navbar tailwind_size="h-1/6">
        <h1 class="text-4xl font-bold text-main-green-300">Descargar mods</h1>
        <h2 class="text-2xl font-bold text-main-green-200">
            En esta parte puedes descargar tus mods listados
        </h2>
    </Navbar>

    <section
        class="w-8/10 flex-1 min-h-0 flex flex-col items-center justify-center"
    >
        <bside class="w-full flex-1 min-h-0 overflow-y-hidden pt-4 relative">
            <ModList>
                <li
                    class="sticky top-0 select-none w-full h-min text-xl flex items-center justify-between p-2 gap-4 text-main-green-900
                    backdrop-blur-lg backdrop-brightness-90
                    "
                >
                    <span
                        class="w-1/10 text-center bg-main-green-50 rounded-md p-2"
                        >#</span
                    >
                    <span
                        class="w-4/10 text-left bg-main-green-50 rounded-md p-2"
                        >Nombre del mod</span
                    >
                    <p
                        class="w-4/10 flex items-center justify-around gap-2 p-2"
                    >
                        <span
                            class="flex flex-col flex-1 justify-center items-center gap-2"
                        >
                            <label
                                for="fabric"
                                class="flex items-center justify-center"
                            >
                                <FabricIcon size="32px" color="#edfcf6" />
                            </label>
                            <input
                                class="outline-none"
                                type="checkbox"
                                id="fabric"
                                bind:checked={loaders.fabric}
                            />
                        </span>
                        <span
                            class=" h-full flex flex-col flex-1 justify-center items-center gap-2"
                        >
                            <label
                                for="forge"
                                class="flex items-center justify-center"
                            >
                                <ForgeIcon size="32px" color="#edfcf6" />
                            </label>
                            <input
                                class="outline-none"
                                type="checkbox"
                                id="forge"
                                bind:checked={loaders.forge}
                            />
                        </span>
                        <span
                            class="h-full flex flex-col flex-1 justify-center items-center gap-2"
                        >
                            <label
                                for="quilt"
                                class="flex items-center justify-center"
                            >
                                <QuiltIcon size="32px" color="#edfcf6" />
                            </label>
                            <input
                                class="outline-none"
                                type="checkbox"
                                id="quilt"
                                bind:checked={loaders.quilt}
                            />
                        </span>
                        <span
                            class="h-full flex flex-col flex-1 justify-center items-center gap-2"
                        >
                            <label
                                for="neoforge"
                                class="flex items-center justify-center"
                            >
                                <NeoForgeIcon size="32px" color="#edfcf6" />
                            </label>
                            <input
                                class="outline-none"
                                type="checkbox"
                                id="neoforge"
                                bind:checked={loaders.neoforge}
                            />
                        </span>
                    </p>
                    <span
                        class="w-1/10 bg-main-green-500 text-center text-main-green-900 rounded-md p-2"
                        >Descargar</span
                    >
                </li>

                {#each modListStore.mods as mod, index}
                    <li
                        class="select-none w-full h-min text-xl flex items-center justify-between p-2 gap-4 text-main-green-900
                    "
                    >
                        <span
                            class="w-1/10 text-center bg-main-green-100 rounded-md p-2"
                            >{index + 1}</span
                        >
                        <span
                            class="w-8/10 text-left bg-main-green-100 rounded-md p-2"
                            >{mod.name}</span
                        >
                        <button
                            class="w-1/10 bg-main-green-500 flex justify-center items-center text-main-green-900 rounded-md p-2"
                            on:click={() => downloadSingleMod(index)}
                        >
                            <ArrowBarIcon size="32" color="#094b3c " />
                        </button>
                    </li>
                {/each}
            </ModList>
        </bside>

        <cside class="w-full h-min p-2">
            <section class="w-full flex items-center justify-between">
                <a
                    class=" h-full flex items-center justify-center gap-4"
                    href="/search"
                >
                    <ArrowLeftIcon size={32} color="#74e0b8 " />
                    <h1 class="text-xl font-bold text-main-green-300">
                        Ir a buscar
                    </h1>
                </a>
                <button
                    class=" h-full flex items-center justify-center gap-4 p-2 bg-main-green-200 hover:backdrop-blur-lg"
                    on:click={downloadAllMods}
                >
                    <h1 class="text-2xl font-bold text-main-green-600">
                        Descargar todos
                    </h1>
                </button>
                <a
                    class=" h-full flex items-center justify-center gap-4"
                    href="/"
                >
                    <h1 class="text-xl font-bold text-main-green-300">
                        Ir al inicio
                    </h1>
                    <ArrowRightIcon size={32} color="#74e0b8" />
                </a>
            </section>
        </cside>
    </section>

    <div class="w-full py-2">
        <Footer color="text-cyan-200 text-xl" />
    </div>
</main>

<style>
    cside a,
    cside button,
    cside label {
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        padding: 0.5rem;
        border-radius: 0.5rem;
    }
    cside a:hover {
        transform: scale(1.1);
        background-color: #00000009;
    }

    cside button:hover {
        transform: scale(1.5);
    }
</style>

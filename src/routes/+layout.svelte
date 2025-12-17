<script>
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { onNavigate } from "$app/navigation";

	let { children } = $props();

	// 💡 LÓGICA DE DIRECCIÓN
	// Definimos el orden de tus pantallas
	const ordenRutas = ["/list", "/search", "/download"];

	onNavigate((navigation) => {
		// 1. Si el navegador no soporta la API, dejamos que SvelteKit navegue normal
		if (!document.startViewTransition) return;

		// 2. Iniciamos la transición
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				// 3. "resolve()" le dice al navegador: "Ya capturé la foto de la página vieja"
				resolve();
				// 4. Esperamos a que SvelteKit termine de cargar la nueva página
				await navigation.complete;
			});
		});
	});

	onNavigate(({ from, to }) => {
		// Obtenemos los índices (ej: list es 0, search es 1)
		const indiceViejo = ordenRutas.indexOf(from?.route.id);
		const indiceNuevo = ordenRutas.indexOf(to?.route.id);

		// Si vamos a una pantalla con índice menor (ej: de 1 a 0), es "atrás"
		const esAtras = indiceNuevo < indiceViejo;

		// Le ponemos una clase al HTML para que CSS sepa qué hacer
		document.documentElement.classList.toggle("back-transition", esAtras);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

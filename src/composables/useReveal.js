import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

// Apparition au défilement : chaque élément marqué data-reveal dans le composant
// reçoit la classe is-visible une seule fois, quand il entre dans l'écran.
// `ready` (optionnel) : quand il passe à true, les éléments rendus après coup sont aussi scannés.
export function useReveal(rootRef, ready = null) {
	let observer = null;

	const scan = () => {
		if (!rootRef.value) return;
		const items = rootRef.value.querySelectorAll('[data-reveal]:not(.is-visible)');
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (!('IntersectionObserver' in window) || reduced) {
			items.forEach((el) => el.classList.add('is-visible'));
			return;
		}

		observer ??= new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				});
			},
			{ threshold: 0.2 }
		);
		items.forEach((el) => observer.observe(el));
	};

	onMounted(scan);

	if (ready) {
		watch(ready, (value) => {
			if (value) nextTick(scan);
		});
	}

	onBeforeUnmount(() => observer?.disconnect());
}

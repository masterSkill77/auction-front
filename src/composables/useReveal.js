import { onMounted, onBeforeUnmount } from 'vue';

// Apparition au défilement : chaque élément marqué data-reveal dans le composant
// reçoit la classe is-visible une seule fois, quand il entre dans l'écran.
export function useReveal(rootRef) {
	let observer = null;

	onMounted(() => {
		const items = rootRef.value.querySelectorAll('[data-reveal]');
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (!('IntersectionObserver' in window) || reduced) {
			items.forEach((el) => el.classList.add('is-visible'));
			return;
		}

		observer = new IntersectionObserver(
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
	});

	onBeforeUnmount(() => observer && observer.disconnect());
}

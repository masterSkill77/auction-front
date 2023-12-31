import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomePage from '@/views/pages/HomePage.vue';
import AboutPage from '@/views/pages/AboutPage.vue';
import NewsPage from '@/views/pages/NewsPage.vue';
import AuctionsPage from '@/views/pages/AuctionsPage.vue';
import ProfilePage from '@/views/pages/ProfilePage.vue';
import AdminPage from '@/views/pages/AdminPage.vue';
import ChatPage from '@/views/pages/ChatPage.vue';
import AuctionPage from '@/Model/auctions/AuctionCard.vue';
import LoginPage from '@/views/auth/LoginPage.vue';
import RegisterPage from '@/views/auth/RegisterPage.vue';
import NotFound from '@/views/404.vue';
import AdminHomePage from '@/components/UI/dashboard/AdminHomePage.vue';
import SettingsPage from '@/views/pages/SettingsPage.vue';
import PaiementPage from '@/views/pages/PaiementPage.vue';
import MyAuctionsPage from '@/views/pages/MyAuctionsPage.vue';
import MyNftPage from '@/views/pages/MyNftPage.vue';
import CreateWizardPage from '@/views/pages/CreateWizardPage.vue';
import HomeCreatePage from '@/Model/wizard/HomeCreatePage.vue';
import NftCreation from '@/Model/wizard/nft/NftCreation.vue';
import AuctionCreation from '@/Model/wizard/auction/AuctionCreation.vue';
import VideoCall from '@/Model/video-call/VideoCall.vue';
import PackPage from '@/views/pages/PackPage.vue';
import NftPage from '@/Model/nft/Nft.vue';
import ContactPage from '@/views/pages/ContactPage.vue';

import axios from '@/src/axios';
const TOKEN_NAME = 'auction_token';
const USER_TOKEN = 'auction_user';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomePage,
		},
		{
			path: '/register',
			name: 'register',
			component: RegisterPage,
		},
		{
			path: '/about',
			name: 'about',
			component: AboutPage,
		},
		{
			path: '/news',
			name: 'news',
			component: NewsPage,
		},
		{
			path: '/auctions',
			name: 'auctions',
			component: AuctionsPage,
			meta: {
				requiresAuth: true,
			},
		},
		{
			name: 'cardauction',
			path: '/auction/:auctionId',
			component: AuctionPage,
			meta: {
				requiresAuth: true,
			},
		},
		{
			name: 'contact',
			path: '/contact',
			component: ContactPage,
			meta: {
				requiresAuth: false,
			},
		},
		{
			path: '/profile',
			name: 'Profile',
			component: AdminPage,
			meta: {
				requiresAuth: true,
			},
			children: [
				{
					path: 'chat',
					name: 'Chat',
					component: ChatPage,
					meta: {
						requiresAuth: true,
					},
				},
				{
					path: '',
					name: 'HomeAdminPage',
					component: AdminHomePage,
					meta: {
						requiresAuth: true,
					},
				},
				{
					path: 'user/:id',
					name: 'ProfileForUser',
					component: ProfilePage,
					meta: {
						requiresAuth: true,
					},
				},
				{
					path: 'settings',
					name: 'Settings',
					component: SettingsPage,
					meta: {
						requiresAuth: true,
					},
				},
				{
					path: 'paiement/:uuid',
					name: 'Paiement',
					component: PaiementPage,
					meta: {
						requiresAuth: true,
					},
				},
				{
					path: 'auctions',
					name: 'My Auctions',
					component: MyAuctionsPage,
					meta: {
						requiresAuth: true,
					},
				},
				{
					path: 'nfts',
					name: 'My-Nft',
					component: MyNftPage,
					meta: {
						requiresAuth: true,
					},
				},
				{
					path: 'nft/:id',
					name: 'Nft',
					component: NftPage,
					meta: {
						requiresAuth: true,
					},
				},

				{
					path: 'create',
					name: 'wizard',
					component: CreateWizardPage,
					meta: {
						requiresAuth: true,
					},
					children: [
						{
							path: '',
							name: 'wizard-home',
							component: HomeCreatePage,
							meta: {
								requiresAuth: true,
							},
						},
						{
							path: 'nft',
							name: 'wizard-nft',
							component: NftCreation,
							meta: {
								requiresAuth: true,
							},
						},
						{
							path: 'auction',
							name: 'wizard-  auction',
							component: AuctionCreation,
							meta: {
								requiresAuth: true,
							},
						},
					],
				},
				{
					name: 'Pack',
					path: 'packs',
					component: PackPage,
				},
			],
		},
		{
			path: '/login',
			name: 'login',
			component: LoginPage,
		},

		{ path: '/404', name: 'NotFoundData', component: NotFound },
		{ path: '/:catchAll(.*)', name: 'NotFound', component: NotFound },
	],
});

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore();
	const src = '/js/active.js';
	var s = document.createElement('script');
	s.setAttribute('src', src);
	document.body.appendChild(s);
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!authStore.isAuthenticated && from.name !== 'login') {
			next({ name: 'login' });
			return;
		} else {
			const data = await axios.get('/user').then((response) => response.data);
			localStorage.setItem(USER_TOKEN, JSON.stringify(data));
			next();
			return;
		}
	} else {
		next();
		return;
	}
});

export default router;

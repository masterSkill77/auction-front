import { defineStore } from 'pinia';
import axios from '@/src/axios';

export const useBidStore = defineStore('bid', {
	actions: {
		async makeBid(body) {
			return await axios.post('/bid', body).then(({ data }) => data);
		},
		async getMyBids() {
			return await axios.get('/bid').then(({ data }) => data);
		},
	},
});

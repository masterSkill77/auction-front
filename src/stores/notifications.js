import { defineStore } from 'pinia';
import axiosInstance from '@/src/axios';

// Compteurs du menu : demandes d'ami reçues et enchères gagnées à payer
export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    friendRequests: 0,
    wonUnpaid: 0,
    timer: null,
  }),
  actions: {
    async refresh() {
      try {
        const { data } = await axiosInstance.get('/notifications/summary');
        this.friendRequests = data.friend_requests;
        this.wonUnpaid = data.won_unpaid;
      } catch (error) {
        // Compteur non critique : on garde la dernière valeur connue
      }
    },
    start() {
      if (this.timer) return;
      this.refresh();
      this.timer = setInterval(() => this.refresh(), 60000);
    },
    stop() {
      clearInterval(this.timer);
      this.timer = null;
    },
  },
});

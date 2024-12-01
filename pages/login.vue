<template>
  <div class="bg-[#F0EEE2] flex items-center justify-center min-h-screen">
    <div
      class="bg-[#FDFCF7] p-8 rounded-lg shadow-md flex flex-col justify-start w-96 h-80"
    >
      <div class="text-center text-[#3d3d3d] text-3xl mb-6">Login</div>
      <div class="flex flex-col items-center justify-center flex-grow">
        <input
          v-model="username"
          type="text"
          class="bg-[#d3d1c9] rounded-md w-full h-10 mb-4"
          placeholder="Username"
          required
        />
        <input
          v-model="password"
          type="password"
          class="bg-[#d3d1c9] rounded-md w-full h-10 mb-4"
          placeholder="Password"
          required
        />
        <button @click="login" class="bg-[#cac4a0] rounded-md w-full h-10">
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
definePageMeta({
  layout: "login",
});
import axios from "axios";
import { useToast } from "vue-toastification"; // Import library notifikasi

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      const toast = useToast(); // Inisialisasi toast
      if (!this.username || !this.password) {
        toast.error("Username dan Password tidak boleh kosong!"); // Notifikasi jika input kosong
        return;
      }
      try {
        const response = await axios.post("http://localhost:8080/auth/login", {
          username: this.username,
          password: this.password,
        });

        if (response.status === 200) {
          // Simpan token di localStorage
          localStorage.setItem("authToken", response.data.token);
          // Redirect ke dashboard
          this.$router.push("/"); // Gunakan router Nuxt untuk redirect
          toast.success("Login berhasil!"); // Notifikasi sukses
        }
      } catch (error: unknown) {
        console.error("Error logging in:", error);
        if (error instanceof Error) {
          toast.error("Kesalahan jaringan: " + error.message); // Notifikasi kesalahan jaringan
        } else if (axios.isAxiosError(error) && error.response) {
          toast.error("Kesalahan server: " + error.response.data); // Notifikasi kesalahan server
        }
      }
    },
  },
};
</script>
<layout name="login" />

<style scoped>
/* Tambahkan gaya kustom tambahan di sini */
</style>

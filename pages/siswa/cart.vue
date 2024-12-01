<template>
  <div class="flex flex-col items-center p-4">
    <h1 class="text-2xl font-bold mb-4">Keranjang Buku</h1>
    <div class="flex w-full max-w-5xl">
      <!-- Bagian Keranjang -->
      <div class="w-full max-w-md h-[50rem] overflow-y-auto border mr-4" :style="{ zIndex: showModal ? 0 : 10 }">
        <!-- Iterasi cartItems -->
        <div v-for="book in cartItems" :key="book.id" class="flex items-center justify-between p-2 border-b">
          <!-- Menampilkan gambar buku -->
          <img :src="book.photo
            ? `data:image/jpeg;base64,${book.photo}`
            : 'path/to/default/image.jpg'
            " alt="Book Cover" class="w-36 h-50 object-cover rounded-lg mr-2" />
          <!-- Menampilkan nama buku dan jumlah -->
          <span class="flex-1 ml-4">{{ book.nama }} (Jumlah: {{ book.quantity }})</span>
          <!-- Tombol tambah jumlah -->
          <button @click="increaseQuantity(book.id)" class="text-green-500 hover:underline flex items-center">
            <Icon name="system-uicons:plus" class="mr-1" />
          </button>
          <!-- Tombol kurangi jumlah -->
          <button @click="decreaseQuantity(book.id)" class="text-yellow-500 hover:underline flex items-center">
            <Icon name="system-uicons:minus" class="mr-1" />
          </button>
          <!-- Tombol hapus -->
          <button @click="removeFromCart(book.id)" class="text-red-500 hover:underline flex items-center">
            <Icon name="system-uicons:trash" class="mr-1" />
          </button>
        </div>
      </div>
      <!-- Bagian Tombol Pinjam -->
      <div class="flex flex-col items-start justify-start">

        <button @click="handlePinjamClick" class="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 mb-4">
          Pinjam Buku
        </button>
        <p class="text-gray-600">
          Isi formulir untuk melanjutkan proses peminjaman buku.
        </p>
      </div>
    </div>

    <!-- Modal form untuk peminjaman -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center">
      <div class="p-6 bg-slate-500 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold text-white mb-4">Form Peminjaman</h2>
        <form @submit.prevent="submitPeminjaman">
          <div class="mb-4">
            <label class="block text-white">Tanggal Pinjam:</label>

            <input type="date" :value="formatDate(currentDate)" disabled
              class="w-full border p-2 rounded bg-gray-100" />
          </div>
          <div class="mb-4">
            <label class="block text-white">Durasi Peminjaman:</label>
            <select v-model="selectedDuration" @change="updateReturnDate" class="w-full border p-2 rounded">
              <option value="1">1 Hari</option>
              <option value="4">4 Hari</option>
              <option value="7">7 Hari</option>
              <option value="14">14 Hari</option>
              <option value="30">30 Hari</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-white">Tanggal Pengembalian:</label>

            <input type="date" :value="formatDate(returnDate)" disabled class="w-full border p-2 rounded bg-gray-100" />
          </div>
          <div class="flex justify-end">
            <button type="button" @click="showModal = false"
              class="mr-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              Batal
            </button>
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification"; // Import library notifikasi

export default {
  data() {
    return {
      cartItems: [],
      showModal: false,
      selectedDuration: "7",
      userId: "",
      peminjaman: {
        tgl_pinjam: "",
        tgl_pengembalian: "",
        jml_buku: 0,
        userid: ""
      }
    };
  },
  computed: {
    currentDate() {
      const date = new Date();
      return date.toISOString();
    },
    returnDate() {
      const date = new Date();
      date.setDate(date.getDate() + parseInt(this.selectedDuration));
      return date.toISOString();
    },
    totalQuantity() {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }
  },
  methods: {
    formatDate(dateString, toISO = false) {
      const date = new Date(dateString);
      if (toISO) {
        return date.toISOString(); // Format ISO 8601
      }
      return date.toISOString().split('T')[0]; // Default format 'YYYY-MM-DD'
    },
    handlePinjamClick() {
      if (this.cartItems.length === 0) {
        const toast = useToast();
        toast.error('Keranjang kosong! Silahkan pilih buku terlebih dahulu.', {
          position: 'top-right',
          duration: 3000,
          icon: '⚠️'
        });
        return;
      }
      this.showModal = true;
    },
    decodeToken() {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = atob(base64);
          const decodedToken = JSON.parse(jsonPayload);
          this.userId = decodedToken.user_id || "";
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    },
    updateReturnDate() {


      this.peminjaman.tgl_pinjam = this.formatDate(this.currentDate);
      this.peminjaman.tgl_pengembalian = this.formatDate(this.returnDate);
    },
    async loadCartItems() {
      try {
        const cartData = localStorage.getItem("cart");
        const cartIds = cartData ? JSON.parse(cartData) : [];
        this.cartItems = [];
        for (const item of cartIds) {
          const id = typeof item === "object" ? item.id : item;
          const quantity = typeof item === "object" ? item.quantity : 1;
          if (!id) continue;
          try {
            const response = await fetch(`http://localhost:8080/book/${id}`);
            if (!response.ok) continue;
            const result = await response.json();
            this.cartItems.push({ ...result.data, quantity });
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    removeFromCart(bookId) {
      this.cartItems = this.cartItems.filter((item) => item.id !== bookId);
      const updatedCartIds = this.cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));
      localStorage.setItem("cart", JSON.stringify(updatedCartIds));
    },
    increaseQuantity(bookId) {
      const book = this.cartItems.find((item) => item.id === bookId);
      if (book) book.quantity += 1;
      this.updateCartInLocalStorage();
    },
    decreaseQuantity(bookId) {
      const book = this.cartItems.find((item) => item.id === bookId);
      if (book && book.quantity > 1) book.quantity -= 1;
      this.updateCartInLocalStorage();
    },
    updateCartInLocalStorage() {
      const updatedCartIds = this.cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));
      localStorage.setItem("cart", JSON.stringify(updatedCartIds));
    },
    async submitPeminjaman() {
      try {
        for (const item of this.cartItems) {
          for (let i = 0; i < item.quantity; i++) {
            const payload = {
              tgl_pinjam: this.formatDate(this.currentDate, true), // ISO 8601
              tgl_pengembalian: this.formatDate(this.returnDate, true), // ISO 8601
              jml_buku: 1,
              userid: this.userId,
              bukuid: item.id,
            };

            const response = await fetch('http://localhost:8080/lend/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });

            if (!response.ok) {
              throw new Error('Failed to submit peminjaman');
            }
          }
        }

        this.showModal = false;
        localStorage.removeItem('cart');
        this.cartItems = [];

        const toast = useToast();
        toast.success('Peminjaman berhasil dilakukan!', {
          position: 'top-right',
          duration: 3000,
        });
      } catch (error) {
        console.error('Error submitting peminjaman:', error);
        const toast = useToast();
        toast.error('Gagal melakukan peminjaman!', {
          position: 'top-right',
          duration: 3000,
        });
      }
    }
  },
  mounted() {
    this.loadCartItems();
    this.updateReturnDate();
    this.decodeToken();
  },
};
</script>

<style scoped>
/* Tambahkan gaya kustom di sini */
</style>

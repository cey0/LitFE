<template>
  <div class="flex h-screen">
    <!-- Left Panel -->
    <div
      class="flex-1 flex bg-[#FDFCF7] border-r border-gray-300 p-[0.3125rem] w-1/2 overflow-auto"
    >
      <div
        v-for="book in books"
        :key="book.id"
        class="p-2 border-b w-[12.25rem] h-[18.175rem] relative group cursor-pointer"
        @click="selectBook(book)"
      >
        <img
          :src="
            book.photo
              ? 'data:image/jpeg;base64,' + book.photo
              : 'path/to/default/image.jpg'
          "
          alt="Book Cover"
          class="w-full h-full object-cover rounded-lg"
        />
        <div
          class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {{ book.nama }}
        </div>
      </div>
    </div>

    <!-- Right Panel -->
    <div
      class="bg-[#F0EEE2] w-1/2 p-[0.5rem] flex flex-col items-center justify-center"
    >
      <div v-if="selectedBook" class="text-center">
        <img
          :src="
            selectedBook.photo
              ? 'data:image/jpeg;base64,' + selectedBook.photo
              : 'path/to/default/image.jpg'
          "
          alt="Book Cover"
          class="w-80 h-98 object-cover rounded-lg mb-4 mx-auto"
        />
        <h2 class="text-2xl font-bold mb-2">{{ selectedBook.nama }}</h2>
        <div class="w-full h-32 p-2 border rounded-md">
          <div
            v-for="(value, key) in selectedBook.comment"
            :key="key"
            class="mb-2"
          >
            <strong>{{ key }}:</strong> {{ value }}
          </div>
        </div>
        <!-- Button Pinjam -->
        <button
          @click="addToCart(selectedBook)"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Pinjam Buku
        </button>
      </div>
      <div v-else>
        <p>Pilih buku untuk melihat detail dan komentar.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification"; // Import library toast

export default {
  data() {
    return {
      books: [], // Menyimpan daftar buku
      selectedBook: this.getSelectedBookFromLocalStorage(), // Menyimpan buku yang dipilih
      cart: this.getCartFromLocalStorage(), // Menyimpan daftar buku yang dipinjam
    };
  },
  computed: {
    commentAsString: {
      get() {
        // Konversi objek comment ke string agar bisa diedit di textarea
        return this.selectedBook && this.selectedBook.comment
          ? JSON.stringify(this.selectedBook.comment, null, 2)
          : "";
      },
      set(value) {
        try {
          // Konversi string kembali ke JSON
          this.selectedBook.comment = JSON.parse(value);
        } catch (error) {
          console.error("Invalid JSON:", error);
        }
      },
    },
  },
  mounted() {
    this.fetchBooks(); // Memanggil fungsi untuk mengambil buku saat komponen dimuat
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await fetch("http://localhost:8080/book/");
        const result = await response.json();
        if (result && Array.isArray(result.data)) {
          this.books = result.data;
        } else {
          console.error("Invalid book data:", result);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    },
    selectBook(book) {
      this.selectedBook = book; // Menyimpan buku yang dipilih
      localStorage.setItem("selectedBook", JSON.stringify(book)); // Menyimpan buku yang dipilih ke localStorage
    },
    addToCart(book) {
      const toast = useToast(); // Inisialisasi toast
      const existingItem = this.cart.find((item) => item.id === book.id);
      if (existingItem) {
        existingItem.quantity += 1; // Menambahkan jumlah buku jika sudah ada di keranjang
        toast.success("Jumlah buku di keranjang ditambah!"); // Notifikasi sukses
      } else {
        this.cart.push({ id: book.id, quantity: 1 }); // Menambahkan buku baru ke keranjang dengan jumlah 1
        toast.success("Buku berhasil ditambahkan ke keranjang!"); // Notifikasi sukses
      }
      localStorage.setItem("cart", JSON.stringify(this.cart)); // Menyimpan keranjang ke localStorage
    },
    updateCartIcon() {
      // Memperbarui ikon keranjang di AppSidebar.vue
      const cartIcon = document.querySelector(".cart-icon");
      if (cartIcon) {
        cartIcon.setAttribute("data-count", this.cart.length);
      }
    },
    getSelectedBookFromLocalStorage() {
      try {
        return JSON.parse(localStorage.getItem("selectedBook")) || null;
      } catch (error) {
        console.error("Error parsing selectedBook from localStorage:", error);
        return null;
      }
    },
    getCartFromLocalStorage() {
      try {
        return JSON.parse(localStorage.getItem("cart")) || [];
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        return [];
      }
    },
  },
};
</script>

<style scoped>
/* Tambahkan overflow scroll ke panel kiri untuk daftar buku */
.overflow-auto {
  overflow-y: auto;
}
</style>

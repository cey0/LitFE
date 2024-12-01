<template>
  <div class="flex h-screen">
    <!-- Left Panel -->
    <div
      class="flex-1 flex bg-[#FDFCF7] border-r border-gray-300 p-[0.5rem] w-2/5 overflow-auto"
    >
      <div
        v-for="category in categories"
        :key="category.id"
        class="p-2 border-b w-[12.25rem] h-[5.175rem] relative group cursor-pointer"
        @click="selectCategory(category)"
      >
        <div
          class="w-full h-full object-cover rounded-lg bg-gray-200 flex items-center justify-center"
        >
          <span class="text-lg font-bold">{{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- Right Panel -->
    <div
      class="bg-[#F0EEE2] w-3/5 p-[1rem] flex items-center justify-center overflow-auto"
    >
      <div
        v-if="selectedBooks.length"
        class="flex flex-wrap justify-center gap-4"
      >
        <div
          v-for="book in selectedBooks"
          :key="book.id"
          class="mb-6 text-center cursor-pointer"
          @click="goToBookPage(book)"
        >
          <h2 class="text-2xl font-bold mb-4">{{ book.nama }}</h2>
          <img
            :src="
              book.photo
                ? 'data:image/jpeg;base64,' + book.photo
                : 'path/to/default/image.jpg'
            "
            alt="Book Cover"
            class="w-auto max-w-full h-auto max-h-80 object-contain rounded-lg mb-4"
          />
          <div
            class="w-full h-32 p-2 border rounded-md text-left overflow-y-auto"
          >
            <p>{{ book.description }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Pilih kategori untuk melihat detail buku.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [], // Menyimpan daftar kategori
      selectedCategory: null, // Menyimpan kategori yang dipilih
      selectedBooks: [], // Menyimpan daftar buku yang dipilih
    };
  },
  mounted() {
    this.fetchCategories(); // Memanggil fungsi untuk mengambil kategori saat komponen dimuat
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await fetch("http://localhost:8080/cat/");
        const result = await response.json();
        if (result && Array.isArray(result.data)) {
          this.categories = result.data;
        } else {
          console.error("Invalid category data:", result);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async selectCategory(category) {
      this.selectedCategory = category; // Menyimpan kategori yang dipilih
      try {
        const response = await fetch(
          `http://localhost:8080/book/cat/${category.id}`
        );
        const result = await response.json();
        if (result && Array.isArray(result.data)) {
          this.selectedBooks = result.data; // Menyimpan semua buku dari kategori yang dipilih
        } else {
          console.error("Invalid book data:", result);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    },
    goToBookPage(book) {
      // Implementasi fungsi untuk navigasi ke halaman buku
      console.log("Navigasi ke halaman buku:", book);
    },
  },
};
</script>

<style scoped>
/* Tambahkan overflow scroll ke panel kiri untuk daftar kategori */
.overflow-auto {
  overflow-y: auto;
}
</style>

<template>
  <transition name="page-flip">
    <div class="flex h-screen">
      <!-- Left Panel -->
      <div
        class="flex-1 flex flex-col bg-[#fffaf0] border-r border-gray-300 p-[0.3125rem] w-1/2"
      >
        <div
          class="mt-[4.375rem] w-[18.625rem] h-[28.25rem] bg-gray-600 mb-[0.3125rem] rounded-lg ml-[0.5rem]"
        >
          <img
            :src="'data:image/jpeg;base64,' + lastBookPhoto"
            alt="Last Borrowed Book Cover"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
        <p class="text-[4.375rem] ml-[0.5rem]">
          Happy reading, <span class="font-bold">{{ decodedUsername }}</span>
        </p>
      </div>
      <div class="bg-white w-1/2 p-[0.5rem]">
        <div class="flex flex-col gap-[0.3rem]">
          <!-- Popular Books -->
          <div class="flex gap-[0.9rem] overflow-x-auto scrollbar-hide">
            <div
              v-for="book in popularBooks"
              :key="book.id"
              class="w-[12.25rem] h-[18.175rem] bg-gray-200 rounded-lg relative group"
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
          <!-- Books by Popular Category -->
          <div class="flex gap-[0.9rem] overflow-x-auto scrollbar-hide">
            <div
              v-for="book in categoryBooks"
              :key="book.id"
              class="w-[12.25rem] h-[18.175rem] bg-gray-200 rounded-lg relative group"
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
          <!-- Random Books -->
          <div class="flex gap-[0.9rem] overflow-x-auto scrollbar-hide">
            <div
              v-for="book in randomBooks"
              :key="book.id"
              class="w-[12.25rem] h-[18.175rem] bg-gray-200 rounded-lg relative group"
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
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      popularBooks: [],
      categoryBooks: [],
      randomBooks: [],
      lastBookPhoto: "",
      decodedUsername: "",
      userId: "", // Tambahkan userId di data
    };
  },
  mounted() {
    this.decodeUsername(); // Panggil decodeUsername untuk mengisi userId
    this.fetchPopularBooks();
    this.fetchCategoryBooks();
    this.fetchRandomBooks();
  },
  methods: {
    async fetchPopularBooks() {
      try {
        const response = await fetch("http://localhost:8080/book/populer");
        const result = await response.json();
        if (result && Array.isArray(result.data)) {
          this.popularBooks = result.data;
        } else {
          console.error("Invalid popular books data:", result);
        }
      } catch (error) {
        console.error("Error fetching popular books:", error);
      }
    },
    async fetchCategoryBooks() {
      try {
        const response = await fetch("http://localhost:8080/book/cat");
        const result = await response.json();
        if (result && Array.isArray(result.data)) {
          this.categoryBooks = result.data;
        } else {
          console.error("Invalid category books data:", result);
        }
      } catch (error) {
        console.error("Error fetching category books:", error);
      }
    },
    async fetchRandomBooks() {
      try {
        const response = await fetch("http://localhost:8080/book/random");
        const result = await response.json();
        if (result && Array.isArray(result.data)) {
          this.randomBooks = result.data;
        } else {
          console.error("Invalid random books data:", result);
        }
      } catch (error) {
        console.error("Error fetching random books:", error);
      }
    },
    async fetchLastBorrowedBook() {
      try {
        const response = await fetch(
          `http://localhost:8080/book/previous/${this.userId}`
        );
        const result = await response.json();
        if (result && result.data) {
          this.lastBookPhoto = result.data.photo;
        } else {
          console.error("Invalid last borrowed book data:", result);
        }
      } catch (error) {
        console.error("Error fetching last borrowed book:", error);
      }
    },
    decodeUsername() {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = atob(base64);
          const decodedToken = JSON.parse(jsonPayload);

          this.decodedUsername = decodedToken.username || "Guest";
          this.userId = decodedToken.user_id || "";

          if (this.userId) {
            this.fetchLastBorrowedBook();
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        console.error("No token found in localStorage");
      }
    },
  },
};
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.page-flip-enter-active,
.page-flip-leave-active {
  transition: transform 0.6s;
  transform-style: preserve-3d;
  perspective: 1000px;
}
.page-flip-enter, .page-flip-leave-to /* .page-flip-leave-active in <2.1.8 */ {
  transform: rotateY(180deg);
}
</style>

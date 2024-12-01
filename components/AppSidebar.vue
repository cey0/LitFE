<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div :class="[
      'bg-[#F0EEE2] text-black w-20 transition-transform transform flex flex-col justify-between',
      isOpen ? 'translate-x-0' : '-translate-x-64',
    ]" class="fixed h-full z-20">
      <!-- Vertical Line -->
      <div class="absolute left-[4.5rem] w-[1px] bg-black" style="top: 1.5rem; bottom: 1.5rem"></div>

      <!-- Logo -->
      <div class="p-6 text-center">
        <img src="@/assets/image/Vector 2.svg" alt="Logo" class="w-full h-auto" />
      </div>

      <!-- Navigation -->
      <nav class="flex-grow flex items-center">
        <ul class="w-full">
          <li v-for="item in navItems" :key="item.name">
            <NuxtLink :to="item.link" class="flex items-center justify-center p-4 rounded-lg relative">
              <div class="icon hover:bg-[#E86067] p-2 rounded-xl h-12">
                <Icon :name="item.icon" class="" size="2rem" />
                <!-- Cart Badge -->
                <span v-if="item.name === 'Cart' && cartCount > 0"
                  class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {{ cartCount }}
                </span>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Profile Circle -->
      <div class="flex flex-col items-center mb-6 space-y-4">
        <!-- Logout Button -->
        <NuxtLink to="/login" @click="handleLogout"
          class="flex items-center justify-center w-10 h-10 bg-red-500 text-black rounded-full shadow-md hover:bg-red-600">
          <Icon name="system-uicons:door" size="1.5rem" />
        </NuxtLink>

        <!-- Profile Circle -->
        <div class="w-10 h-10 rounded-full bg-gray-300 overflow-hidden shadow-md">
          <img src="https://via.placeholder.com/150" alt="User Profile" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { Icon } from "#components";

export default defineComponent({
  name: "Sidebar",
  props: {
    cartCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  setup() {
    const isOpen = ref(true);
    const navItems = ref([
      {
        name: "Dashboard",
        link: "/siswa",
        icon: "system-uicons:home-door",
      },
      { name: "Profile", link: "/siswa/books", icon: "system-uicons:book-text" },
      {
        name: "Settings",
        link: "/siswa/category",
        icon: "system-uicons:grid-squares",
      },
      { name: "Cart", link: "/siswa/cart", icon: "system-uicons:cart" },
    ]);

    const cartCount = ref(0);
    let intervalId: number | undefined; // Menyimpan ID interval

    // Fungsi untuk menghitung item dalam cart
    const updateCartCount = () => {
      if (typeof window !== "undefined") {
        const cartData = localStorage.getItem("cart");
        const cartItems = cartData ? JSON.parse(cartData) : [];
        cartCount.value = cartItems.length;
      }
    };

    // Logout handler
    const handleLogout = () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        updateCartCount(); // Memperbarui count setelah logout
      }
    };

    onMounted(() => {
      updateCartCount(); // Hitung saat pertama kali komponen di-mount
      intervalId = window.setInterval(updateCartCount, 1000); // Cek setiap 1 detik
    });

    onBeforeUnmount(() => {
      if (intervalId) {
        clearInterval(intervalId); // Hapus interval saat komponen di-unmount
      }
    });

    return {
      isOpen,
      navItems,
      handleLogout,
      cartCount,
    };
  },
});
</script>

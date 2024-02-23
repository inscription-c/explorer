<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import Logo from '@/layouts/Logo.vue';
import Search from '@/layouts/Search.vue';
import DesktopNav from '@/layouts/nav/DesktopNav.vue';
import MobileNav from '@/layouts/nav/MobileNav.vue';

import { Menu2Icon } from 'vue-tabler-icons';

const route = useRoute();
const showMenu = ref(false);
</script>

<template>
  <div>
    <div>
      <!-- -----------------------------------------------
      Start Header
      ----------------------------------------------- -->
      <v-app-bar class="lp-header" flat elevation="6" height="80">
        <v-container class=" py-sm-4 py-0">
          <v-toolbar class="d-flex align-center">
            <Logo />

            <!-- Desktop view Navigation -->
            <div class="navigation ml-auto d-lg-flex d-none align-center">
              <Search class="mr-4 elevation-0" v-if="route.path !== '/'" width="300px" />
              <DesktopNav />
            </div>
            <v-btn variant="text" class="hidden-lg-and-up ml-auto" icon @click.stop="showMenu = !showMenu">
              <Menu2Icon size="22" stroke-width="1.5" />
            </v-btn>
          </v-toolbar>
        </v-container>
      </v-app-bar>
      <!-- -----------------------------------------------
      End Header
      ----------------------------------------------- -->
    </div>

    <!----sidebar menu drawer start----->
    <v-navigation-drawer class="lp-drawer" v-model="showMenu" location="left" temporary>
      <MobileNav />
    </v-navigation-drawer>
  </div>
</template>

<style lang="scss" scoped>
.v-container {
  max-width: 1200px !important;
}
</style>

<template>
  <nav class="side-nav">
    <a href="/" class="intro-x flex items-center pl-5 pt-4 mt-3">
      <img
          alt="Midone - HTML Admin Template"
          class="w-6"
          src="../assets/images/logo.svg"
      />
      <span class="hidden xl:block text-white text-lg ml-3"> Tinker</span>
    </a>
    <div class="side-nav__devider my-6"></div>
    <ul>
      <li>
        <a class="side-menu side-menu--active">
          <div class="side-menu__icon">
            <i data-lucide="message-square"></i>
          </div>
          <div class="side-menu__title">Chat</div>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
export default {
  name: "SideMenu",
};
</script>

<style></style>

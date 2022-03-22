<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/Main.vue'
import Header from './components/Header.vue'
import Aside from './components/Aside.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header><Header></Header></el-header>
      <el-container>
        <el-aside width="35%"><Aside></Aside></el-aside>
        <el-container>
          <el-main ><Main msg="Hello Vue 3 + Vite" /></el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
  
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

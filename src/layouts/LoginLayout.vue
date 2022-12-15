<template>
  <div class="container">
    <div class="login">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  margin: 0 auto;

  .login {
    width: 100%;
    min-height: 100vh;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 15px;
    background-image: url("../assets/bg-home.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

  }
}
</style>

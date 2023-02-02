<template>
  <div class="pl-link-to-store">
    <a href="javascript:void(0)">
      <img :src="'/img/pl/appstore.svg'" alt="" />
    </a>
    <a href="javascript:void(0)" class="second-link">
      <img :src="'/img/pl/google-play.svg'" alt="" />
    </a>
  </div>
</template>

<script>
export default {
  name: "LinkToStore"
};
</script>

<style scoped lang="scss">
.pl-link-to-store {
  display: flex;
  place-content: center;

  .second-link {
    margin-left: 24px;
  }
}

</style>

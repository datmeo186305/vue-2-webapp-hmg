<template>
  <div class="monex_contact_fixed">
    <ul>
      <li>
        <a
          :href="zaloURL"
          target="_blank"
          rel="noopener"
          data-toggle="tooltip"
          data-html="true"
          data-placement="left"
          title=""
          data-original-title="Zalo"
          ><img :src="'/img/img_zalo_contactf_2021.png'" alt=""
        /></a>
      </li>
      <li>
        <a
          :href="fbMessURL"
          data-toggle="tooltip"
          data-html="true"
          target="_blank"
          rel="noopener"
          data-placement="left"
          title=""
          data-original-title="Messenger"
          ><img :src="'/img/img_mess_contactf_2021.png'" alt=""
        /></a>
      </li>
    </ul>
  </div>
</template>

<script>
import Configuration from "@/helpers/configuration";

export default {
  name: "ChatBox",
  data() {
    return {
      zaloURL: Configuration.value('VUE_APP_ZALO_URL') || "https://zalo.me/2848902721585176437",
      fbMessURL: Configuration.value('VUE_APP_FB_MESSENGER_URL') || "https://m.me/monexvn"
    };
  }
};
</script>

<style scoped lang="scss">
.monex_contact_fixed {
  position: fixed;
  z-index: 999;
  right: 16px;
  bottom: 16px;

  ul li {
    margin: 0 0 10px 0;
    position: relative;

    a {
      width: 55px;
      height: 55px;
      background: #22aef9;
      color: #fff;
      display: block;
      text-align: center;
      line-height: 53px;
      cursor: pointer;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      -ms-border-radius: 50%;
      -o-border-radius: 50%;
      border-radius: 50%;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

      img {
        max-width: 100%;
        width: 55px;
        height: 55px;
      }
    }
  }
}

@media (max-width: 768px) {
  .monex_contact_fixed ul li a {
    width: 40px;
    height: 40px;
    line-height: 36px;

    img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>

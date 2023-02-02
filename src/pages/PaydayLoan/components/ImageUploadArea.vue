<template>
  <div class="area-upload-container">
    <a
      href="javascript:void(0)"
      class="ekyc-upload-area filled-ekyc-upload-area"
      v-if="image"
    >
      <img v-if="!file" :src="image" alt="" class="uploaded-img" />
      <img
        v-else-if="
          file &&
            [
              'image/gif',
              'image/jpeg',
              'image/png',
              'image/jpg',
              'jpg',
              'gif',
              'jpeg',
              'png'
            ].includes(file['type'])
        "
        :src="image"
        alt=""
        class="uploaded-img"
      />
      <div v-else class="uploaded-img uploaded-file">
        <div class="uploaded-file-box">
          <img :src="placeholderImageSrc" alt="" class="pl-upload-icon" />
          <div class="pl-filename">
            <span class="pl-name">{{ fileName }}</span>
            <span class="pl-extension">{{ "." + fileType }}</span>
          </div>
        </div>
      </div>
      <div class="filled-ekyc-action">
        <p class="filled-ekyc-title">
          <span>{{ filledTitle }}</span>
          <img :src="'/img/pl/mandatory.svg'" alt="*" v-if="required" />
        </p>
        <a
          href="javascript:void(0)"
          class="btn-change-img"
          :disabled="disabled"
          @click="changeImage"
        >
          <img
            :src="'/img/pl/arrow-counterclockwise.svg'"
            class="change-img-icon"
            alt=""
          />
          <span>{{ $t("common.change") }}</span>
        </a>
      </div>
    </a>
    <a
      v-else
      href="javascript:void(0)"
      class="ekyc-upload-area"
      :disabled="disabled"
      @click="uploadImg"
    >
      <div class="ekyc-place-content">
        <div class="ekyc-body">
          <div class="text-center ekyc-upload-img" v-if="placeholderImageSrc">
            <div class="box-ekyc-img">
              <img :src="placeholderImageSrc" alt="" class="pl-upload-icon" />
              <img :src="'/img/pl/add.svg'" alt="add" class="pl-add-icon" />
            </div>
          </div>
          <div class="text-center ekyc-upload-title" v-if="uploadTitle">
            <p>
              <span>{{ uploadTitle }}</span>
              <img :src="'/img/pl/mandatory.svg'" alt="*" v-if="required" />
            </p>
          </div>
          <div class="text-center ekyc-upload-hint" v-if="uploadHint">
            <p>
              <span>{{ uploadHint }}</span>
            </p>
          </div>
        </div>
      </div>
    </a>
    <input type="reset" :id="`reset-manual-upload-input-${id}`" hidden />
    <ValidationProvider
      :name="filledTitle"
      ref="provider"
      :rules="(initValue && initValue === imageSrc) ? '' : rules"
      v-slot="{ errors, validate }"
    >
      <input
        type="file"
        :id="`manual-upload-input-${id}`"
        :ref="`input-type-file-${id}`"
        :disabled="disabled"
        @change="
          onFileChange($event);
          validate(file);
        "
        :accept="acceptFileType"
        :name="name"
        hidden
      />
      <div class="pl-invalid-feedback" v-if="errors[0]">
        {{ errors[0] }}
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import isBase64 from "is-base64";
import { mapMutations } from "vuex";
import * as Sentry from "@sentry/browser";

export default {
  name: "ImageUploadArea",
  props: {
    imageSrc: {
      type: String
    },
    initValue: {
      type: String
    },
    placeholderImageSrc: {
      type: String
    },
    filledTitle: {
      type: String
    },
    uploadHint: {
      type: String
    },
    uploadTitle: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    isManualUploadFile: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: "image-upload-area"
    },
    acceptFileType: {
      type: String,
      default:
        "image/png, image/jpeg, image/jpg, application/pdf, application/zip,application/x-zip,application/x-zip-compressed, application/x-rar-compressed, application/octet-stream"
    },
    rules: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      file: null,
      image: null,
      fileName: "",
      fileType: "",
      // isHeicImg: false,
      thumbnailSize: 2000
    };
  },
  watch: {
    imageSrc(newVal) {
      if (!newVal) {
        document.getElementById(`reset-manual-upload-input-${this.id}`).click();
        this.file = null;
      }
      this.image = newVal;
    },
    file(newVal) {
      if (this.isManualUploadFile && newVal && newVal["name"]) {
        this.fileName = this.fileNameAndExt(newVal["name"])[0];
        this.fileType = this.fileNameAndExt(newVal["name"])[1];
      }
    }
  },
  mounted() {
    this.initImgSrc(this.imageSrc);
  },
  methods: {
    ...mapMutations({
      showLoading: "loading/SHOW_LOADING",
      hideLoading: "loading/HIDE_LOADING"
    }),
    initImgSrc(value) {
      if (!value) {
        document.getElementById(`reset-manual-upload-input-${this.id}`).click();
        this.file = null;
      }
      this.image = value;
      if (!this.isManualUploadFile || !value || isBase64(value)) {
        return;
      } else if (isBase64(value, { mimeRequired: true })) return;

      this.urltoFile(
        value,
        this.getFilename(value),
        this.getUrlExtension(value)
      ).then(file => {
        this.file = file;
      });
    },
    uploadImg() {
      if (this.isManualUploadFile) {
        document.getElementById(`manual-upload-input-${this.id}`).click();
      }

      this.$emit("uploadImage");
    },
    changeImage() {
      if (this.isManualUploadFile) {
        document.getElementById(`manual-upload-input-${this.id}`).click();
      }
      this.$emit("changeImage");
    },
    onFileChange(e) {
      // this.isHeicImg = false;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.getValidFile(files[0]);
    },
    createImage(file) {
      let reader = new FileReader();
      let vm = this;
      reader.onload = e => {
        this.image = e.target.result;
        vm.$emit("receiveResult", e.target.result, file);
      };
      reader.readAsDataURL(file);
    },
    getFilename(url) {
      if (url) {
        var m = url.toString().match(/.*\/(.+?)\./);
        if (m && m.length > 1) {
          return m[1];
        }
      }
      return "";
    },
    getUrlExtension(url) {
      if (!url) return "";
      return url
        .split(/[#?]/)[0]
        .split(".")
        .pop()
        .trim();
    },
    fileNameAndExt(str) {
      if (!str) return [];
      let file = str.split("/").pop();
      return [
        file.substr(0, file.lastIndexOf(".")),
        file.substr(file.lastIndexOf(".") + 1, file.length)
      ];
    },
    urltoFile(url, filename, mimeType) {
      return fetch(url)
        .then(function(res) {
          return res.arrayBuffer();
        })
        .then(function(buf) {
          return new File([buf], filename, { type: mimeType });
        })
        .catch(e => {
          Sentry.captureException(e);
        });
    },
    async getValidFile(file) {
      if (!(file instanceof File)) {
        return null;
      }
      this.showLoading();

      let fileType = this.fileNameAndExt(file["name"])[1];
      // if (
      //   fileType.toLowerCase() === "heic" ||
      //   fileType.toLowerCase() === "heif"
      // ) {
      //   this.isHeicImg = true;
      // }
      this.file = file;
      this.createImage(file);
      this.hideLoading();
    },
    // resize(fileName, blob, callback) {
    //   const self = this;
    //   const image = new Image();
    //   const fr = new FileReader();
    //   fr.onload = function(evt) {
    //     image.onload = function() {
    //       let width, height;
    //       if (image.width > image.height) {
    //         const ratio = image.height / image.width;
    //         width = self.thumbnailSize;
    //         height = self.thumbnailSize * ratio;
    //       } else {
    //         const ratio = image.width / image.height;
    //         width = self.thumbnailSize * ratio;
    //         height = self.thumbnailSize;
    //       }
    //       const canvas = document.createElement("canvas");
    //       canvas.id = "canvas";
    //       canvas.width = width;
    //       canvas.height = height;
    //       const ctx = canvas.getContext("2d");
    //       if (ctx) {
    //         ctx.clearRect(0, 0, width, height);
    //         ctx.drawImage(
    //           image,
    //           0,
    //           0,
    //           image.width,
    //           image.height,
    //           0,
    //           0,
    //           width,
    //           height
    //         );
    //       }
    //       const base64 = canvas.toDataURL("image/jpeg");
    //       const bin = atob(base64.split("base64,")[1]);
    //       const len = bin.length;
    //       const barr = new Uint8Array(len);
    //       let i = 0;
    //       while (i < len) {
    //         barr[i] = bin.charCodeAt(i);
    //         i++;
    //       }
    //       const resizeBlob = new Blob([barr], { type: "image/jpeg" });
    //       callback({
    //         fileName: fileName,
    //         ofileData: evt.target ? evt.target.result : null,
    //         fileData: base64,
    //         ofileSize: blob.size,
    //         fileSize: resizeBlob.size,
    //         fileType: resizeBlob.type
    //       });
    //     };
    //     image.onerror = function() {
    //       this.errorCallback(["選択されたファイルをロードできません。"]);
    //     };
    //     image.src = evt.target ? evt.target.result + "" : "";
    //   };
    //   fr.readAsDataURL(blob);
    // },
    // convertHeicToPng(file) {
    //   heic2any({
    //     blob: file,
    //     toType: "image/jpeg",
    //     quality: 1
    //   })
    //     .then(rb => {
    //       this.resize(file.name, rb, res => {
    //         this.image = res.fileData;
    //         this.file = this.dataURLtoFile(res.fileData, "image.jpg");
    //         this.$emit("receiveResult", this.image, this.file);
    //       });
    //     })
    //     .finally(() => {
    //       this.hideLoading();
    //     });
    // },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/pl/pl-ekyc";
</style>

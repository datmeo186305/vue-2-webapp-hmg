import {
  email,
  max,
  required,
  min,
  confirmed,
  numeric,
  regex,
  mimes,
  size,
  excluded,
  image
} from "vee-validate/dist/rules";
import vi from "vee-validate/dist/locale/vi.json";
import { extend, setInteractionMode, configure, localize } from "vee-validate";

setInteractionMode("eager");

configure({
  // Generates an English message locale generator
  generateMessage: localize("vi", vi)
});

extend("required", {
  ...required,
  message: "{_field_} không được để trống"
});

extend("numeric", {
  ...numeric,
  message: "{_field_} phải là định dạng kiểu số"
});

extend("regex", {
  ...regex,
  message: "{_field_} không hợp lệ"
});

extend("confirmed", {
  ...confirmed,
  message: "{_field_} không trùng khớp"
});

extend("max", {
  ...max,
  message: "{_field_} không được lớn hơn {length} ký tự"
});

extend("min", {
  ...min,
  message: "{_field_} không được nhỏ hơn {length} ký tự"
});

extend("email", {
  ...email,
  message: "{_field_} không đúng định dạng."
});

extend("mimes", {
  ...mimes
});

extend("size", {
  ...size,
  message: "{_field_} phải có dung lượng nhỏ hơn {size} KB"
});

extend("excluded", {
  ...excluded
});

extend("image", {
  ...image,
  message: "{_field_} phải là một ảnh."
});

const isConfirmedRule = {
  message:
    "Bạn phải đồng ý với các điều khoản, điều kiện và Chính sách bảo mật của Monex trước khi tiếp tục.",
  validate(value) {
    return value;
  }
};

extend("isConfirmed", isConfirmedRule);

const notIncludeSpecialCharacterRule = {
  message: "{_field_} không được bao gồm các ký tự đặc biệt.",
  validate(value) {
    const VALIDREG = /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷýỹ0-9 -]+$/;

    return VALIDREG.test(value);
  }
};

extend("notIncludeSpecialChar", notIncludeSpecialCharacterRule);

const strongPasswordRule = {
  message:
    "{_field_} phải gồm ít nhất 6 ký tự!",
  validate(value) {
    // Custom regex for a strong password
    const PASSREG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;

    // Check for either of these to return true
    return PASSREG.test(value);
  }
};

extend("strongPassword", strongPasswordRule);

const validPhoneNumberRule = {
  message: "{_field_} sai định dạng.",
  validate(value) {
    // Custom regex for a phone number
    const PHONEREG = /^((0|\+84)[1|3|5|7|8|9])+([0-9]{8})$/;
    // const PHONEREG = /^(0|\+84)((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\d{3})(\d{3})$/;

    // Check for either of these to return true
    return PHONEREG.test(value);
  }
};


extend("validPhoneNumber", validPhoneNumberRule);

const validPhoneNumberOrNotExistRule = {
  message: "{_field_} không đúng hoặc chưa tồn tại trên hệ thống.",
  validate(value) {
    // Custom regex for a phone number
    const PHONEREG = /^((0|\+84)[1|3|5|7|8|9])+([0-9]{8})$/;

    // Check for either of these to return true
    return PHONEREG.test(value);
  }
};

extend("validPhoneNumberOrNotExistRule", validPhoneNumberOrNotExistRule);

const validEmailRule = {
  message: "{_field_} sai định dạng.",
  validate(value) {
    // Custom regex for a phone number
    const PHONEREG = /^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]/;

    // Check for either of these to return true
    return PHONEREG.test(value);
  }
};

extend("validEmail", validEmailRule);

import i18n from "../lang/i18n";
import moment from "moment";

export function formatPrice(value) {
  let val = (value / 1).toFixed(0).replace(".", ",");
  return (
    val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
    " " +
    i18n.t("common.short_vnd")
  );
}


export function formatMillionPrice(value) {
  let fractionDigits = (value / 1000000) % 1 !== 0 ? 1 : 0;
  let val = (value / 1000000).toFixed(fractionDigits).replace(".", ",");
  return (
    val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
    " " +
    i18n.t("common.million")
  );
}

export function formatTimeAgo(value) {
  return value ? moment(new Date(value)).fromNow() : "";
}

export function formatDateAndTime(value) {
  return value
    ? moment(new Date(value), "DD/MM/YYYY HH:mm:ss").format(
        "DD/MM/YYYY HH:mm:ss"
      )
    : null;
}

export function formatDate(value) {
  return value
    ? moment(new Date(value), "DD/MM/YYYY HH:mm:ss").format(
      "DD/MM/YYYY"
    )
    : null;
}


export function formatIntToFloat(value) {
  return value ? value.toFixed(1) : null;
}

export function two_digits(value) {
  if (value < 0) {
    return '00';
  }
  if (value.toString().length <= 1) {
    return `0${value}`;
  }
  return value;
}

export function formatSettlementDate(value) {
  if (!value) {
    return "N/A";
  }
  const createdDate = new Date(value);
  if (createdDate.getDate() >= 15) {
    return "15/" + moment(createdDate).add(1, "month").format("MM/YYYY");
  }

  return "15/" + moment(createdDate).format("MM/YYYY");
}

export function formatPunishStartTime(value) {
  if (!value) {
    return "N/A";
  }

  const createdDate = new Date(value);
  if (createdDate.getDate() >= 15) {
    return "00h Ngày 16/" + moment(createdDate).add(1, "month").format("MM/YYYY");
  }

  return "00h Ngày 16/" + moment(createdDate).format("MM/YYYY");
}

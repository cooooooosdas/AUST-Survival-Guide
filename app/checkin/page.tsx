import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "学习打卡",
  description: "每日学习打卡，养成好习惯",
};

import CheckinClient from "./CheckinClient";

export default function CheckinPage() {
  return <CheckinClient />;
}

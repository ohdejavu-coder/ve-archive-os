import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * POST /api/contact — sends contact form emails via 163 SMTP.
 */
export async function POST(request: Request) {
  try {
    const { name, email, type, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "请填写姓名、邮箱和留言" }, { status: 400 });
    }

    const auth = process.env.SMTP_AUTH;
    if (!auth) {
      console.error("SMTP_AUTH not configured");
      return NextResponse.json({ error: "邮件服务未配置" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.163.com",
      port: 465,
      secure: true,
      auth: {
        user: "ohdejavu@163.com",
        pass: auth,
      },
    });

    await transporter.sendMail({
      from: "ohdejavu@163.com",
      to: "ohdejavu@163.com",
      replyTo: email,
      subject: `[VE Archive 联系] ${type || "合作咨询"} — 来自 ${name}`,
      text: `姓名：${name}
邮箱：${email}
类型：${type || "未选择"}
留言：${message}
---
此邮件通过 VE Archive OS 网站 (veisviddy.com) 的联系表单发送。`,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact email error:", e);
    return NextResponse.json({ error: "发送失败，请稍后重试或直接发送邮件至 ohdejavu@163.com" }, { status: 500 });
  }
}

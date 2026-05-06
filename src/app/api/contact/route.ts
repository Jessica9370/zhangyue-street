import { NextResponse } from "next/server";
import { Client } from "@larksuiteoapi/node-sdk";

const APP_ID = process.env.FEISHU_APP_ID!;
const APP_SECRET = process.env.FEISHU_APP_SECRET!;
const CONTACT_BASE_ID = process.env.FEISHU_CONTACT_BASE_ID || process.env.FEISHU_BASE_ID!;
const CONTACT_TABLE_ID = process.env.FEISHU_CONTACT_TABLE_ID;

const client = new Client({
  appId: APP_ID,
  appSecret: APP_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    if (!CONTACT_TABLE_ID) {
      console.error("FEISHU_CONTACT_TABLE_ID 未配置，请在 .env.local 中设置");
      return NextResponse.json(
        { success: false, error: "留言功能暂未配置，请联系管理员" },
        { status: 500 }
      );
    }

    const result = await client.bitable.appTableRecord.create({
      path: {
        app_token: CONTACT_BASE_ID,
        table_id: CONTACT_TABLE_ID,
      },
      data: {
        fields: {
          "文本": `${name} - ${email}`,
          "姓名": name,
          "邮箱": email,
          "留言内容": message,
        },
      },
    });

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error("=== 留言 API 错误 ===");
    console.error("message:", error.message);
    if (error.response?.data) {
      console.error("飞书响应:", JSON.stringify(error.response.data, null, 2));
    }
    console.error("stack:", error.stack);
    return NextResponse.json(
      { success: false, error: "留言提交失败，请稍后重试" },
      { status: 500 }
    );
  }
}

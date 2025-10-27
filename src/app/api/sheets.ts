'use server';
import { google } from "googleapis";
import dotenv from 'dotenv';

dotenv.config();  // Загружаем переменные окружения из .env

export async function getSheetData() { 
  const glAuth = await google.auth.getClient({
    credentials: {
      "type": "service_account",
      "project_id": process.env.GOOGLE_PROJECT_ID,
      "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
      "private_key": process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),  // Форматируем ключ
      "client_email": process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      "universe_domain": "googleapis.com"
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const glSheets = google.sheets({ version: "v4", auth: glAuth });

  const data = await glSheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,  // Используем переменную окружения для ID
    range: 'Лист1!A2:C',  // Диапазон
  });

  return { data: data.data.values };
}

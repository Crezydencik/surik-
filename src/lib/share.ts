import { toast } from "sonner";

/** Универсальный share с фолбэком на копирование */
export async function shareLink({
  url,
  title,
  text,
}: {
  url: string;
  title?: string;
  text?: string;
}) {
  try {
    if (navigator.share) {
      await navigator.share({ url, title, text });
      return true;
    }
    // Фолбэк: копируем ссылку
    await navigator.clipboard.writeText(url);
    toast.success("Ссылка скопирована");
    return true;
  } catch (e) {
    // если пользователь отменил или ошибка — тоже попробуем копировать
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована");
      return true;
    } catch {
      toast.error("Не удалось поделиться");
      return false;
    }
  }
}
